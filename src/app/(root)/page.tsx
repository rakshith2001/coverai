"use client"

import React, { useState, useEffect, useRef } from 'react';
import { SignedIn, SignedOut } from "@clerk/nextjs";
import jsPDF from 'jspdf';
import { FaDownload } from 'react-icons/fa';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  cols?: number; // Optional property for textarea cols
}

const Home: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    const doc = new jsPDF();
    const recentMessage = messages[messages.length - 1]?.text || 'No messages';

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const textWidth = pageWidth - margin * 2;
    doc.setFont('helvetica', 'normal');

    // Split text into lines that fit within the specified width
    const lines = doc.splitTextToSize(recentMessage, textWidth);

    doc.text('Cover Letter', 90, 20);

    let y = 30; // Starting y position for the text
    const lineHeight = 10; // Height between lines

    lines.forEach((line: string) => {
      if (y + lineHeight > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage(); // Add new page if text exceeds page height
        y = margin; // Reset y position for the new page
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });

    doc.save('cover_letter.pdf');

    try {
      const req = await fetch('/api/update-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!req.ok) {
        throw new Error('Failed to update credits');
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

  return (
    <>
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
              <button onClick={handleDownload} className="ml-2 p-2 bg-green-500 text-white rounded-md">
                <FaDownload />
              </button>
            </div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="flex flex-col h-screen bg-gray-100">
          <div className="flex flex-col flex-grow bg-white p-4">
            <div className="flex flex-col flex-grow items-center justify-center">
              <h1 className="text-2xl font-semibold">Sign in to Create Cover Letter</h1>
            </div>
          </div>
        </div>
      </SignedOut>
    </>
  );
}

export default Home;
