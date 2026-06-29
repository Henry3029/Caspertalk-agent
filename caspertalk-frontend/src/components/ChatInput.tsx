import React, { useState, FormEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Prevent empty entries or spacing strings from triggering requests
    if (!inputText.trim() || disabled) return;

    onSendMessage(inputText.trim());
    setInputText(''); // Reset state field immediately after passing data up
  };

  return (
    <form 
  onSubmit={handleSubmit} 
  className="w-full flex items-center space-x-2 bg-white p-4 border-t border-gray-200/80 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        disabled={disabled}
        placeholder={disabled ? "Waiting for response..." : "Ask CasperTalk Agent..."}
        className="flex-1 bg-gray-50 text-gray-800 placeholder-gray-400 text-sm font-sans rounded-lg px-3 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-60"
      />
      
      <button
        type="submit"
        disabled={!inputText.trim() || disabled}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 text-white font-sans text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center shadow-sm disabled:cursor-not-allowed"
      >
        Send
      </button>
    </form>
  );
}