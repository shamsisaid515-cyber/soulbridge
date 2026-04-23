/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MessageCircle, ArrowLeft, Heart, Info } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useStore } from '../store';
import ChatWindow from '../components/chat/ChatWindow';

export default function AISupport() {
  const navigate = useNavigate();
  const { user, setActiveSession, activeSession, addMessage } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Initialize AI session if not exists
    if (!activeSession || !activeSession.isAI) {
      setActiveSession({
        targetUserId: 'ai-guide',
        messages: [
          {
            id: 'ai-init',
            senderId: 'ai',
            text: "Hello. I'm your AI guide. I'm here to listen, offer support, and help you navigate your feelings in a safe, non-judgmental way. How are you feeling right now?",
            timestamp: Date.now(),
            type: 'ai'
          }
        ],
        isAI: true,
        isTyping: false
      });
    }
  }, []);

  // Listen for new human messages to trigger AI response
  useEffect(() => {
    const lastMessage = activeSession?.messages[activeSession.messages.length - 1];
    if (activeSession?.isAI && lastMessage && lastMessage.senderId === 'me' && !isProcessing) {
      handleAIResponse(lastMessage.text);
    }
  }, [activeSession?.messages]);

  const handleAIResponse = async (userText: string) => {
    setIsProcessing(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";
      
      const prompt = `You are "SoulBridge AI Guide", an emotionally intelligent, empathetic, and supportive mental health companion. 
      The user is going through: ${user?.tags.join(', ')}. 
      Their current intensity level is ${user?.intensity}/10.
      Context: ${user?.currentStruggle}
      
      User said: "${userText}"
      
      Respond with deep empathy, active listening, and gentle validation. Keep it relatively concise (2-4 sentences). 
      IMPORTANT: You are an AI, not a therapist. If the user mentions self-harm or high danger, gently suggest professional help. 
      Avoid generic "I am sorry to hear that". Try to be human-centered.`;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      const responseText = response.text || "I'm here for you. Can you tell me more about that?";
      
      addMessage({
        id: Math.random().toString(36).substr(2, 9),
        senderId: 'ai',
        text: responseText,
        timestamp: Date.now(),
        type: 'ai'
      });
    } catch (error) {
      console.error("AI Error:", error);
      addMessage({
        id: 'error',
        senderId: 'ai',
        text: "I'm having a little trouble connecting right now, but I'm still here with you. Take a deep breath.",
        timestamp: Date.now(),
        type: 'ai'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center p-4 lg:p-10">
      <div className="w-full max-w-4xl flex-1 flex flex-col gap-6">
      <header className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-black/20 backdrop-blur-md rounded-t-[40px]">
        <div className="flex items-center gap-4">
           <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-white/5 rounded-full transition-all text-white/40 hover:text-white"
           >
            <ArrowLeft className="w-6 h-6" />
           </button>
           <div>
              <h1 className="text-xl font-sans font-light flex items-center gap-2">
                AI Support Space <Sparkles className="w-5 h-5 text-[#8B93FF]" />
              </h1>
              <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest pl-0.5">Private & Secure</p>
           </div>
        </div>
        <button className="px-6 py-2 bg-[#FF4E4E]/10 text-[#FF4E4E] border border-[#FF4E4E]/30 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#FF4E4E]/20 transition-all">
          Distress Exit
        </button>
      </header>

      <div className="flex-1 min-h-0 glass-card !rounded-t-none border-t-0 bg-transparent">
        <ChatWindow onClose={() => navigate('/dashboard')} isAISession={true} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           { label: "Meditation Help", icon: Heart },
           { label: "Anxiety Tips", icon: MessageCircle },
           { label: "Sleep Support", icon: Sparkles },
           { label: "Safety Info", icon: Info },
         ].map((item, i) => (
           <button 
            key={i}
            className="glass-card p-6 flex flex-col items-center gap-3 hover:bg-white/5 transition-all group bg-white/[0.01]"
           >
             <item.icon className="w-6 h-6 text-[#8B93FF]/60 group-hover:scale-110 group-hover:text-[#8B93FF] transition-all" />
             <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">{item.label}</span>
           </button>
         ))}
      </div>
      </div>
    </div>
  );
}
