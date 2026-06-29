'use client';

import { useState, useEffect } from 'react';
import DashboardMetrics from '@/components/DashboardMetrics';
import ChatWindow from '@/components/ChatWindow';
import ChatInput from '@/components/ChatInput';
import LoadingSpinner from '@/components/LoadingSpinner';

//  Synchronized to match ChatWindow's explicit requirement
interface Message {
  id: string; // Made strict since we generate it or fetch it from MongoDB _id
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date; //  Changed from string? to absolute Date
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
            id: msg._id || crypto.randomUUID(), // Map MongoDB _id safely
            sender: msg.sender === 'user' ? 'user' : 'ai',
            text: msg.text,
            timestamp: new Date(msg.createdAt || msg.timestamp || Date.now()) // Clean conversion to Date instance
          })));

          // If the latest message contains updated metrics from Casper, apply it to the dashboard
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
      timestamp: new Date() // Enforces true Date object matching interface
    };
    
    setHistory((prev) => [...prev, localUserMsg]);
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'user',
          text: userText,
          publicKey: userPublicKey 
        }),
      });

      if (!response.ok) {
  // Capture status code and any custom error message from backend
  const errBody = await response.json().catch(() => ({}));
  throw new Error(`Server Error (${response.status}): ${errBody.error || response.statusText || 'Transmission failed'}`);
}
      const data = await response.json();

      // Catch real backend response payload
      if (data.aiResponse) {
        setHistory((prev) => [...prev, {
          id: data.aiResponse._id || crypto.randomUUID(),
          sender: 'ai',
          text: data.aiResponse.text,
          timestamp: new Date()
        }]);

        // Map real chain metrics directly from your live backend controller
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
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 w-full overflow-hidden">
      <header className="p-4 border-b border-slate-900 bg-slate-900/50 shrink-0 z-10">
        <h1 className="text-xl font-bold text-center">Casper<span className="text-amber-400">Talk AI</span></h1>
      </header>

<div className="shrink-0 bg-white border-b border-gray-100 z-10">
      <DashboardMetrics 
        walletAddress={userPublicKey} 
        balance={metrics.balance} 
        riskLevel={metrics.riskLevel} 
        aiAnalysis={metrics.aiAnalysis} 
        isLoading={isLoading}
      />
</div>

  <div className="flex-1 min-h-0 w-full relative">
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