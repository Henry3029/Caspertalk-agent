'use client';

import { useState, useEffect } from 'react';
import DashboardMetrics from '@/components/DashboardMetrics';
import ChatWindow from '@/components/ChatWindow';
import ChatInput from '@/components/ChatInput';
import LoadingSpinner from '@/components/LoadingSpinner';

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
  
  const userPublicKey = "01a0bcce1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

  // 1. SAFE INITIAL INITIALIZATION: Load an introductory greeting instead of hitting the backend
  useEffect(() => {
    setHistory([
      {
        id: 'welcome-log',
        sender: 'ai',
        text: "System Online: CasperTalk AI Agent Engine initialized. Ask me about your account risk state or wallet balance metrics to check the network state.",
        timestamp: new Date()
      }
    ]);
  }, []);

  // 2. LIVE SEND ROUTINE: Fast Local Simulation for Demo Video Capture (NO BACKEND REQUIRED)
  const handleSendMessage = async (userText: string) => {
    const localUserMsg: Message = { 
      id: crypto.randomUUID(),
      sender: 'user', 
      text: userText,
      timestamp: new Date() 
    };
    
    // Instantly add user chat bubble to screen
    setHistory((prev) => [...prev, localUserMsg]);
    setIsLoading(true);

    // Artificial timing delay so it looks like real AI processing on camera
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const textLower = userText.toLowerCase();
      let aiResponseText = "";

      // 🧠 Keyword Router Mapping
      if (textLower.includes('risk') || textLower.includes('security') || textLower.includes('state')) {
        aiResponseText = "Analysis complete: Your current account risk factor is evaluated as Low Risk. No malicious smart contract calls or drain patterns have been tracked on-chain.";
        
        setMetrics(prev => ({
          ...prev,
          riskLevel: 'Low Risk',
          aiAnalysis: "Security state checked: Your assets on the Casper network are fully secure."
        }));

      } else if (textLower.includes('balance') || textLower.includes('cspr') || textLower.includes('wallet')) {
        aiResponseText = "Ledger query successful: The wallet address provided holds a verified balance of 2,450.75 CSPR on the Casper Testnet nodes.";
        
        setMetrics(prev => ({
          ...prev,
          balance: 2450.75,
          aiAnalysis: "Balance query logged. Live node synchronization active."
        }));

      } else {
        // 🛑 Your Custom Catch-All Fallback Rule
        aiResponseText = "Sorry, I can't find that in the active block state tracking ledger! Try asking about your account risk state, current wallet balance, or network diagnostics.";
      }

      // Render the response bubble onto your screen frame layout
      setHistory((prev) => [...prev, {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error("Local context error tracking:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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

      {/* Loading Indicator */}
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