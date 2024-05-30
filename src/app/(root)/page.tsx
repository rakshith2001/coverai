"use client";

import React, { useState, useEffect, useRef } from 'react';

import { SignedIn, SignedOut } from "@clerk/nextjs"
import {chatbot} from '@/chatbot/chatbot';
const Home = () => {
  

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  



  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { sender: 'user', text: input }]);
      setInput('');
      // Simulate a bot response
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: 'This is a response from the bot.' }]);
      }, 1000);
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
      <div className="flex flex-col h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">Welcome to the Chat App</h1>
        <p className="text-gray-500">Please sign in to continue.</p>
      </div>
    </SignedOut>
    </>
    
  );
}

export default Home