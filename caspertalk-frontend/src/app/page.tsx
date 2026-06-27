'use client';

import { useState, useEffect } from 'react';
import DashboardMetrics from '@/components/DashboardMetrics';
import ChatWindow from '@/components/ChatWindow';
import ChatInput from '@/components/ChatInput';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Message {
  id?: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp?: string; // 👈 Add this line to satisfy ChatWindow
}

export default function MainDashboardPage() {
  const [history, setHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // A test public key wallet address to pass to our backend
  const userPublicKey = "01a0bcce1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

  // 1. INITIAL LOAD ROUTINE: Pull existing chat logs from MongoDB when page opens
  useEffect(() => {
    async function loadChatHistory() {
      try {
        const response = await fetch('http://localhost:5000/api/messages');
        if (response.ok) {
          const storedLogs = await response.json();
          // Map MongoDB formatting safely to our frontend state array
          setHistory(storedLogs.map((msg: any) => ({
            id: msg._id,
            sender: msg.sender,
            text: msg.text
          })));
        }
      } catch (error) {
        console.error("Could not fetch historical logs from data layer:", error);
      }
    }
    loadChatHistory();
  }, []);

  // 2. LIVE SEND ROUTINE: Ship prompt to Node.js and await the AI response
  const handleSendMessage = async (userText: string) => {
    // Optimistically add user bubble to screen instantly
    const localUserMsg: Message = { sender: 'user', text: userText };
    setHistory((prev) => [...prev, localUserMsg]);
    
    // Activate our localized spinner state
    setIsLoading(true);

    try {
      // Dispatch the payload over the local network pipe
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'user',
          text: userText,
          publicKey: userPublicKey // Pass public key context to ground the agent
        })
      });

      if (!response.ok) throw new Error("Server transmission error");

      const data = await response.json();

      // If the backend returned a processed AI response, add it to the timeline
      if (data.aiResponse) {
        setHistory((prev) => [...prev, data.aiResponse]);
      }

    } catch (error) {
      console.error("Data pipeline broken:", error);
      setHistory((prev) => [...prev, { 
        sender: 'ai', 
        text: "Connection Alert: Lost tracking communication with the local Node.js engine server." 
      }]);
    } finally {
      // Shut off the spinner once the transmission closes
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 max-w-md mx-auto overflow-hidden">
      <header className="p-4 border-b border-slate-900 bg-slate-900/50">
        <h1 className="text-xl font-bold text-center">Casper<span className="text-amber-400">Talk AI</span></h1>
      </header>

      <DashboardMetrics walletAddress={userPublicKey} />

      <div className="flex-1 min-h-0 p-4">
        <ChatWindow messages={history} />
      </div>

      {/* Show an inline subtle indicator if the agent is compiling network data */}
      {isLoading && (
        <div className="flex items-center gap-2 px-6 py-2 text-xs text-amber-400/70 font-mono animate-pulse">
          <LoadingSpinner />
          <span>Agent parsing Casper state blocks...</span>
        </div>
      )}

      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}