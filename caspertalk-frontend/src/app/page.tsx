'use client';

import { useState, useEffect } from 'react';
import DashboardMetrics from '@/components/DashboardMetrics';
import ChatWindow from '@/components/ChatWindow';
import ChatInput from '@/components/ChatInput';
import LoadingSpinner from '@/components/LoadingSpinner';

// ✅ Synchronized to match ChatWindow's explicit requirement
interface Message {
  id: string; 
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date; 
}

export default function MainDashboardPage() {
  const [history, setHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [metrics, setMetrics] = useState({
    balance: 0,
    riskLevel: 'Low Risk' as 'Low Risk' | 'Medium Risk' | 'High Risk',
    aiAnalysis: 'Enter a prompt to inspect live Casper Network data.'
  });
  
  // A test public key wallet address to pass to our backend
  const userPublicKey = "01a0bcce1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

  // 1. INITIAL LOAD ROUTINE: Pull existing logs when the app opens
  useEffect(() => {
    async function loadChatHistory() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages`);
        if (response.ok) {
          const storedLogs = await response.json();
          
          setHistory(storedLogs.map((msg: any) => ({
            id: msg._id || crypto.randomUUID(), 
            sender: msg.sender === 'user' ? 'user' : 'ai',
            text: msg.text,
            timestamp: new Date(msg.createdAt || msg.timestamp || Date.now()) 
          })));

          const latestAiLog = [...storedLogs].reverse().find(msg => msg.sender === 'ai');
          if (latestAiLog && latestAiLog.metrics) {
            setMetrics({
              balance: latestAiLog.metrics.balance || 0,
              riskLevel: latestAiLog.metrics.riskLevel || 'Low Risk',
              aiAnalysis: latestAiLog.text
            });
          }
        }
      } catch (error) {
        console.error("Could not fetch historical logs from data layer:", error);
      }
    }
    loadChatHistory();
  }, []);

  // 2. LIVE SEND ROUTINE: Ship prompt to Node.js and catch response pipeline
  const handleSendMessage = async (userText: string) => {
    const localUserMsg: Message = { 
      id: crypto.randomUUID(),
      sender: 'user', 
      text: userText,
      timestamp: new Date() 
    };
    
    setHistory((prev) => [...prev, localUserMsg]);
    setIsLoading(true);

    try {
      // ✅ Swapped variables to match your exact parameter scope names!
      const response = await fetch('https://bug-free-giggle-69p5ww495v4gf55x6-5000.app.github.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: 'user',
          text: userText,             // 👈 Matches 'userText' from the function argument
          publicKey: userPublicKey    // 👈 Matches your component's 'userPublicKey' variable
        })
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(`Server Error (${response.status}): ${errBody.error || response.statusText || 'Transmission failed'}`);
      }
      
      const data = await response.json();

      if (data.aiResponse) {
        setHistory((prev) => [...prev, {
          id: data.aiResponse._id || crypto.randomUUID(),
          sender: 'ai',
          text: data.aiResponse.text,
          timestamp: new Date()
        }]);

        if (data.aiResponse.metrics) {
          setMetrics({
            balance: data.aiResponse.metrics.balance,
            riskLevel: data.aiResponse.metrics.riskLevel,
            aiAnalysis: data.aiResponse.text
          });
        }
      }

    } catch (error) {
      console.error("Data pipeline broken:", error);
      setHistory((prev) => [...prev, {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: "Connection Alert: Lost tracking communication with the agent logic.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
  /* 📱 Clean Light Mode Workspace Wrapper */
  <div className="h-screen w-full flex flex-col overflow-hidden bg-gray-100 text-gray-900">
    
    {/* 📋 FIXED HEADER */}
    <header className="p-4 border-b border-gray-200 bg-white shrink-0 z-10">
      <h1 className="text-xl font-bold text-center text-gray-900">
        Casper<span className="text-indigo-600">Talk AI</span>
      </h1>
    </header>

    {/* 📊 FIXED DASHBOARD METRICS */}
    <div className="shrink-0 z-10 bg-white border-b border-gray-200">
      <DashboardMetrics 
        walletAddress={userPublicKey} 
        balance={metrics.balance} 
        riskLevel={metrics.riskLevel} 
        aiAnalysis={metrics.aiAnalysis} 
        isLoading={isLoading}
      />
    </div>

    {/* 💬 TELEGRAM-STYLE INLINE SCROLL WINDOW */}
    <div className="flex-1 min-h-0 w-full relative bg-gray-50">
      <ChatWindow messages={history} />
    </div>

    {/* Show an inline subtle indicator if the agent is compiling network data */}
    {isLoading && (
      <div className="flex items-center gap-2 px-6 py-2 text-xs text-indigo-600 font-sans bg-white border-t border-gray-100 animate-pulse shrink-0">
        <LoadingSpinner />
        <span>Agent parsing Casper state blocks...</span>
      </div>
    )}

    {/* ⌨️ STICKY INPUT FOOTER */}
    <div className="shrink-0 bg-white border-t border-gray-200">
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  </div>
);
}