import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-3 p-4">
      {/* 🎬 YouTube-Style C-Shape Spinner */}
      <div className="w-10 h-10 rounded-full border-4 border-transparent border-t-[#C5A059] animate-spin"></div>
      
      {/* Status Text */}
      <span className="font-sans text-xs font-semibold text-gray-400 tracking-wider uppercase animate-pulse">
        Loading...
      </span>
    </div>
  );
}