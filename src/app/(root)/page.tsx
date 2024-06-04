"use client"
import React, { useState, useEffect, useRef } from 'react';
import { SignedIn, SignedOut } from "@clerk/nextjs";

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const Home: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (input.trim()) {
      setMessages([...messages, { sender: 'user', text: input }]);
      setInput('');
      try {
        let req = await fetch('/api/chat', {
          method: 'POST',
          body: JSON.stringify({ message: input }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (req.ok) {
          let res = await req.json();
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
                  {message.text}
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
