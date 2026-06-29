import React from 'react';

interface DashboardMetricsProps {
  walletAddress: string;
  balance: number;
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk';
  aiAnalysis: string;
  isLoading?: boolean;
}

export default function DashboardMetrics({
  walletAddress,
  balance,
  riskLevel,
  aiAnalysis,
  isLoading = false
}: DashboardMetricsProps) {
  
  // Dynamic color configuration helper for the AI risk badges
  const getRiskBadgeStyles = (risk: string) => {
    switch (risk) {
      case 'High Risk':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium Risk':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="font-sans text-gray-500 animate-pulse">Syncing with Casper Blockchain...</p>
      </div>
    );
  }

  return (
  <div className="w-full max-w-md mx-auto p-2 space-y-3">
    {/* 👑 Elegant Section Header */}
    <h2 className="font-serif text-xl font-bold text-gray-900 tracking-tight">
      Account Metrics
    </h2>
    
    <hr className="border-gray-200" />

    {/* 🎛️ Side-by-Side Wallet & Indicator Row */}
    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between gap-3">
      <div className="min-w-0 flex-1">
        <span className="font-sans text-[10px] font-semibold text-gray-400 tracking-wider uppercase block">
          Active Wallet
        </span>
        <p className="font-mono text-xs text-gray-700 font-medium break-all mt-1 bg-gray-50 p-1.5 rounded border border-gray-100 truncate">
          {walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 6)}` : 'Not Connected'}
        </p>
      </div>

      {/* Dynamic Risk Level Indicator Badge right beside it */}
      <div className="flex flex-col items-end shrink-0">
        <span className="font-sans text-[10px] font-semibold text-gray-400 tracking-wider uppercase block mb-1">
          Risk Level
        </span>
        <span className={`px-2.5 py-1 text-xs font-bold font-sans rounded-full border ${getRiskBadgeStyles(riskLevel)}`}>
          {riskLevel}
        </span>
      </div>
    </div>

    {/* AI Insights Section */}
    <div className="bg-gradient-to-br from-gray-50 to-white p-3 rounded-xl border border-gray-100 shadow-sm space-y-1">
      <span className="font-sans text-[10px] font-semibold text-gray-400 tracking-wider uppercase block">
        AI Agent Diagnostic
      </span>
      <p className="font-sans text-xs text-gray-600 leading-relaxed">
        {aiAnalysis || "Awaiting transaction analytics from CasperTalk Engine..."}
      </p>
    </div>

  </div>
);
}