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
    <div className="w-full max-w-md mx-auto p-4 space-y-4">
      {/* 👑 Elegant Section Header */}
      <h2 className="font-serif text-2xl font-bold text-gray-900 tracking-tight">
        Account Metrics
      </h2>
      
      <hr className="border-gray-200" />

      {/* 🎛️ Responsive Stats Grid Layout */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        
        {/* Card 1: Wallet Address Info */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="font-sans text-xs font-semibold text-gray-400 tracking-wider uppercase">
            Active Wallet
          </span>
          <p className="font-sans text-sm text-gray-700 font-medium break-all mt-2 bg-gray-50 p-2 rounded border border-gray-100">
            {walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 6)}` : 'Not Connected'}
          </p>
        </div>

        {/* Card 2: Live Token Balance */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="font-sans text-xs font-semibold text-gray-400 tracking-wider uppercase">
            Total Balance
          </span>
          <div className="flex items-baseline space-x-1 mt-2">
            <span className="font-serif text-2xl font-bold text-gray-900">
              {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
            </span>
            <span className="font-sans text-xs font-bold text-indigo-600 uppercase">
              CSPR
            </span>
          </div>
        </div>

      </div>

      {/* 🧠 Card 3: Combined AI Insights & Risk Engine Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-sans text-xs font-semibold text-gray-400 tracking-wider uppercase">
            AI Agent Diagnostic
          </span>
          {/* Dynamic Risk Level Indicator Badge */}
          <span className={`px-2.5 py-1 text-xs font-bold font-sans rounded-full border ${getRiskBadgeStyles(riskLevel)}`}>
            {riskLevel}
          </span>
        </div>

        <div>
          <p className="font-sans text-sm text-gray-600 leading-relaxed">
            {aiAnalysis || "Awaiting transaction analytics from CasperTalk Engine..."}
          </p>
        </div>
      </div>

    </div>
  );
}