"use client"
import React, { useState, useEffect, useRef } from 'react';
import { SignedIn, SignedOut } from "@clerk/nextjs";
import jsPDF from 'jspdf';
import { FaDownload } from 'react-icons/fa';
import { creditFee } from '@/constants';
import { updateCredits } from '@/lib/actions/user.actions';
import { InsufficientCreditsModal } from '@/components/shared/InsufficientCreditsModal';
import Landing from './Landing';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  cols?: number;
}

const GptInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [creditBalance, setCreditBalance] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchCreditBalance = async () => {
      try {
        const res = await fetch('/api/get-user-gpt');
        if (res.ok) {
          const data = await res.json();
          setCreditBalance(data.creditBalance);
        } else {
          throw new Error('Failed to fetch credit balance.');
        }
      } catch (error) {
        console.error('Error fetching credit balance:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreditBalance();
  }, []);

  const handleSend = async (): Promise<void> => {
    if (input.trim()) {
      setMessages([...messages, { sender: 'user', text: input }]);
      setInput('');
      try {
        const req = await fetch('/api/chat', {
          method: 'POST',
          body: JSON.stringify({ message: input }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (req.ok) {
          const res = await req.json();
          setTimeout(() => {
            setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: res.message }]);
          }, 1000);
        } else {
          throw new Error('Network response was not ok.');
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleDownload = async (): Promise<void> => {
    if (creditBalance !== null && creditBalance < Math.abs(creditFee)) {
      return; // Don't proceed with download if credits are insufficient
    }

    const doc = new jsPDF();
    const recentMessage = messages[messages.length - 1]?.text || 'No messages';

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const textWidth = pageWidth - margin * 2;
    doc.setFont('helvetica', 'normal');

    // Split text into lines that fit within the specified width
    const lines: string[] = doc.splitTextToSize(recentMessage, textWidth);

    doc.text('Cover Letter', 90, 20);

    let y = 30; // Starting y position for the text
    const lineHeight = 10; // Height between lines

    lines.forEach((line: string) => {
      if (y + lineHeight > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage(); // Add new page if text exceeds page height
        y = margin; // Reset y position for the new page
      }
      doc.text(line, margin, y);
      y += lineHeight; // Move y position for the next line
    });

    doc.save('cover_letter.pdf');

    try {
      await updateCredits('user-id', -creditFee); // Deduct credits
      if (creditBalance !== null) {
        setCreditBalance(creditBalance - creditFee);
      }
    } catch (error) {
      console.error('Error updating credits:', error);
    }
  };

  const handleEdit = (index: number, newText: string) => {
    const updatedMessages = [...messages];
    updatedMessages[index] = { ...updatedMessages[index], text: newText };
    setMessages(updatedMessages);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isDownloadDisabled = messages.length === 0 || messages[messages.length - 1]?.sender !== 'bot';

  return (
    <>
      {isLoading ? (
        // Show spinner loader while fetching credit balance
        <div className="flex justify-center items-center h-screen">
          <div className="loader"></div>
        </div>
      ) : creditBalance !== null && creditBalance < Math.abs(creditFee) ? (
        // Show insufficient funds modal if credit balance is insufficient
        <InsufficientCreditsModal />
      ) : (
        // Show form if credit balance is sufficient
        <SignedIn>
          <div className="flex flex-col h-screen bg-gray-100">
            <div className="flex flex-col flex-grow bg-white p-4">
              <div className="flex flex-col flex-grow overflow-y-auto space-y-2">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-md max-w-xs ${
                      message.sender === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'
                    }`}
                  >
                    {message.sender === 'bot' ? (
                      <textarea
                        value={message.text}
                        onChange={(e) => handleEdit(index, e.target.value)}
                        rows={Math.max(Math.ceil(message.text.length / 30), 1)} // Adjust based on character count
                        cols={30} // Initial cols value
                        className="w-full h-full resize-none"
                        autoFocus // Focus on the input box
                      />
                    ) : (
                      message.text
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="flex p-4 border-t border-gray-200">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyUp={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-grow p-2 border rounded-l-md"
                />
                <button onClick={handleSend} className="p-2 bg-blue-500 text-white rounded-r-md">
                  Send
                </button>
                <button
                  onClick={handleDownload}
                  className={`ml-2 p-2 bg-green-500 text-white rounded-md ${
                    isDownloadDisabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isDownloadDisabled}
                >
                  <FaDownload />
                </button>
              </div>
            </div>
          </div>
        </SignedIn>
      )}
      <SignedOut>
        <Landing />
      </SignedOut>
    </>
  );
};

export default GptInterface;
