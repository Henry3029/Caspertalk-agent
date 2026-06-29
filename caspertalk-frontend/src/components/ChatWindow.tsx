import React, { useEffect, useRef } from 'react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface ChatWindowProps {
  messages: Message[];
  isAiTyping?: boolean;
}

export default function ChatWindow({ messages, isAiTyping = false }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Automatically scroll down to show new messages as they arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  return (
  /* 1. Outer Frame: Claims 100% width and height allocated by page.tsx */
  <div className="absolute inset-0 w-full h-full flex flex-col bg-gray-50 rounded-xl border border-gray-100 shadow-inner overflow-hidden">
    
    {/* 2. Isolated Scrollable Box: Only this section tracks vertically */}
    <div className="flex-1 min-h-0 w-full overflow-y-auto p-4 space-y-3">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <p className="font-serif text-sm text-gray-400 italic">
            No messages yet. Ask the CasperTalk Agent about your balance or asset security rules.
          </p>
        </div>
      ) : (
        messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm font-sans shadow-sm break-words ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
                <span
                  className={`block text-[10px] mt-1 text-right ${
                    isUser ? 'text-indigo-200' : 'text-gray-400'
                  }`}
                >
                  {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || ""}
                </span>
              </div>
            </div>
          );
        })
      )}

      {/* 🧠 AI Loading Bubble Indicator sits perfectly inside the scroll zone flow */}
      {isAiTyping && (
        <div className="flex w-full justify-start pt-1">
          <div className="bg-white text-gray-500 border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 text-sm shadow-sm flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}

      {/* Invisible anchor point used by the auto-scroll pipeline */}
      <div ref={bottomRef} />
    </div>

  </div>
);
}