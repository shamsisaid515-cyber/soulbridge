/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  X, 
  ShieldAlert, 
  MoreVertical, 
  Smile, 
  Paperclip,
  ArrowBigRight
} from 'lucide-react';
import { useStore } from '../../store';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ChatWindowProps {
  onClose: () => void;
  isAISession?: boolean;
}

export default function ChatWindow({ onClose, isAISession = false }: ChatWindowProps) {
  const [inputText, setInputText] = useState('');
  const { activeSession, addMessage, match, user } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeSession?.messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: 'me',
      text: inputText,
      timestamp: Date.now(),
      type: isAISession ? 'ai' : 'human' as any
    };

    addMessage(newMessage);
    setInputText('');

    // If it's a human session, simulate a typing notification
    if (!isAISession) {
      setTimeout(() => {
        // Simulate a simple AI buddy or just wait for peer
      }, 1000);
    }
  };

  const targetName = isAISession ? "AI Guide" : (match?.name || "Peer");

  return (
    <div className={cn(
      "flex flex-col h-full glass-card border-white/10 shadow-2xl relative",
      isAISession && "bg-gradient-to-b from-[#8B93FF]/5 to-black/40"
    )}>
      {/* Header */}
      <header className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-black/20 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border border-white/20",
            isAISession 
              ? "bg-gradient-to-b from-[#8B93FF] to-[#1e293b]" 
              : "bg-gradient-to-b from-purple-500/20 to-black/40"
          )}>
            {targetName[0]}
          </div>
          <div>
            <h4 className="text-sm font-medium flex items-center gap-2">
              {targetName}
              {isAISession && <span className="text-[9px] px-1.5 py-0.5 bg-indigo-500/20 text-[#8B93FF] rounded uppercase tracking-widest font-bold">SoulBridge AI</span>}
            </h4>
            <p className="text-[10px] text-green-400 flex items-center gap-1 font-bold tracking-tighter uppercase">
              <span className="w-1 h-1 rounded-full bg-green-400" />
              Active
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs font-medium border border-white/10 transition-colors">
            Safety Options
          </button>
          <button className="p-2 text-white/40 hover:text-white transition-colors" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6"
      >
        <div className="h-4" />
        
        {activeSession?.messages.map((msg) => {
          if (msg.isSystem) {
             return (
               <div key={msg.id} className="text-center">
                  <span className="px-4 py-1.5 bg-white/5 text-white/30 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/5">
                    {msg.text}
                  </span>
               </div>
             );
          }

          const isMe = msg.senderId === 'me';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex w-full",
                isMe ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "max-w-[85%] px-5 py-4 rounded-2xl border backdrop-blur-sm",
                isMe 
                  ? "bg-[#3B3486]/40 text-white rounded-tr-none border-white/10" 
                  : "bg-white/[0.05] text-white/80 rounded-tl-none border-white/5"
              )}>
                {msg.type === 'ai' && !isMe && (
                   <p className="text-[10px] uppercase tracking-widest text-[#8B93FF] mb-2 font-bold opacity-80">SoulAI Response</p>
                )}
                <p className={cn(
                  "text-[14px] leading-relaxed",
                  msg.type === 'ai' && !isMe && "italic text-[#8B93FF]/90 font-light"
                )}>{msg.text}</p>
                <p className={cn(
                  "text-[10px] mt-2 font-medium opacity-20",
                  isMe ? "text-right" : "text-left"
                )}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Input area */}
      <footer className="p-4 bg-black/20 backdrop-blur-md border-t border-white/5">
        <div className="bg-white/5 border border-white/10 rounded-2xl flex items-center p-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type something safe..."
            className="bg-transparent flex-1 px-4 text-sm outline-none placeholder:text-white/20 h-10"
          />
          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
              inputText.trim() 
                ? "bg-[#8B93FF] text-black hover:bg-[#7a82ff] shadow-lg shadow-[#8B93FF]/20" 
                : "bg-white/5 text-white/20"
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-3 flex justify-center gap-6">
           <span className="text-[9px] text-white/20 uppercase tracking-[0.2em] font-bold">Encryption v2.4 Active</span>
           <span className="text-[9px] text-white/20 uppercase tracking-[0.2em] font-bold">Privacy Shield</span>
        </div>
      </footer>
    </div>
  );
}
