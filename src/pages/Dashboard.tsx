/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { 
  MessageSquare, 
  Sparkles, 
  UserPlus, 
  Stethoscope, 
  Settings, 
  LogOut,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import ChatWindow from '../components/chat/ChatWindow';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, match, isMatching, setIsMatching, setMatch, setActiveSession, activeSession } = useStore();

  const startMatching = () => {
    setIsMatching(true);
    // Simulate matching delay
    setTimeout(() => {
      setIsMatching(false);
      setMatch({
        id: 'user-123',
        name: 'Alex',
        isAnonymous: true,
        onboarded: true,
        tags: ['Grief', 'Anxiety'],
        intensity: 7,
        currentStruggle: 'I recently lost my job and I am feeling a bit lost.'
      });
    }, 3000);
  };

  const openChat = (isAI = false) => {
    if (isAI) {
      navigate('/ai-support');
      return;
    }
    
    if (match) {
      setActiveSession({
        targetUserId: match.id,
        messages: [
          {
            id: 'sys-1',
            senderId: 'system',
            text: `You have been matched with ${match.name}. Both of you are experiencing ${match.tags[0].toLowerCase()}. Say hello!`,
            timestamp: Date.now(),
            type: 'human',
            isSystem: true
          }
        ],
        isAI: false,
        isTyping: false
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-transparent">
      {/* Sidebar */}
      <aside className="w-full lg:w-24 border-b lg:border-r border-white/5 flex lg:flex-col items-center py-4 lg:py-8 px-4 justify-between z-20 backdrop-blur-md bg-black/10">
        <div className="flex lg:flex-col items-center gap-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-[#8B93FF] to-[#D291FF] rounded-2xl flex items-center justify-center shadow-lg">
            <HeartIcon className="text-black w-6 h-6" />
          </div>
          <nav className="flex lg:flex-col gap-6">
            <button className="p-3 text-[#8B93FF] bg-[#8B93FF]/10 rounded-2xl">
              <MessageSquare className="w-6 h-6" />
            </button>
            <button 
              onClick={() => navigate('/therapists')}
              className="p-3 text-white/40 hover:text-white transition-colors"
            >
              <Stethoscope className="w-6 h-6" />
            </button>
            <button 
              onClick={() => navigate('/ai-support')}
              className="p-3 text-white/40 hover:text-white transition-colors"
            >
              <Sparkles className="w-6 h-6" />
            </button>
          </nav>
        </div>
        <div className="flex lg:flex-col gap-6">
          <button className="p-3 text-white/40 hover:text-white transition-colors">
            <Settings className="w-6 h-6" />
          </button>
          <button 
            onClick={() => {
              useStore.getState().setUser(null);
              navigate('/');
            }}
            className="p-3 text-[#FF4E4E]/60 hover:text-[#FF4E4E] transition-colors"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-10 space-y-8 relative">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-sans font-light leading-tight">Good evening, <span className="text-[#8B93FF] italic">{user?.isAnonymous ? 'Friend' : user?.name}</span></h1>
            <p className="text-white/50 mt-1">We're glad <span className="text-[#8B93FF]/80">you're here.</span> How are you holding up?</p>
          </div>
          <div className="flex gap-4">
             <button className="button-danger">
               <ShieldAlert className="w-4 h-4" /> Distress Exit
             </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Peer Card */}
          <section className="lg:col-span-2 space-y-6">
            <h2 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-2">Your Peer Connection</h2>
            
            {!match && !isMatching && (
              <motion.div 
                whileHover={{ y: -5 }}
                className="glass-card p-12 text-center space-y-6 border-dashed"
              >
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5">
                  <UserPlus className="w-10 h-10 text-[#8B93FF]/60" />
                </div>
                <div>
                  <h3 className="text-2xl font-light mb-2">Find your bridge</h3>
                  <p className="text-white/40 max-w-sm mx-auto font-light leading-relaxed">
                    We'll match you with someone going through similar experiences. You can stop or skip anytime.
                  </p>
                </div>
                <button 
                  onClick={startMatching}
                  className="button-primary"
                >
                  Find a match
                </button>
              </motion.div>
            )}

            {isMatching && (
              <div className="glass-card p-12 text-center space-y-8 min-h-[300px] flex flex-col justify-center">
                <div className="relative w-24 h-24 mx-auto">
                   <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute inset-0 bg-[#8B93FF]/20 rounded-full"
                   />
                   <div className="absolute inset-4 bg-gradient-to-tr from-[#8B93FF] to-[#D291FF] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(139,147,255,0.4)]">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                   </div>
                </div>
                <p className="text-xl font-light text-[#8B93FF] italic">Scanning for a safe presence...</p>
              </div>
            )}

            {match && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-10 flex flex-col md:flex-row gap-10 items-center bg-white/[0.04]"
              >
                <div className="w-24 h-24 bg-gradient-to-b from-[#8B93FF] to-[#1e293b] rounded-[40px] flex items-center justify-center text-white/90 font-light text-4xl border border-white/10">
                  {match.name[0]}
                </div>
                <div className="flex-1 text-center md:text-left space-y-6">
                  <div>
                    <h3 className="text-3xl font-light tracking-tight">{match.name} <span className="text-xs text-white/30 ml-2 font-bold uppercase tracking-widest leading-none">• Peer Support</span></h3>
                    <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                      {match.tags.map(t => (
                        <span key={t} className="px-3 py-1 bg-white/5 text-white/60 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-white/40 italic font-light">"Both of you are navigating {match.tags[0].toLowerCase()}..."</p>
                  <div className="flex gap-4 justify-center md:justify-start pt-2">
                    <button 
                      onClick={() => openChat()}
                      className="button-primary px-10 flex items-center gap-2"
                    >
                      Open Chat <ArrowRight className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setMatch(null)}
                      className="button-secondary"
                    >
                      Skip match
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </section>

          {/* Right Column */}
          <section className="space-y-8">
             <div className="glass-card p-8 space-y-6 bg-white/[0.02]">
                <h2 className="text-[10px] font-bold text-[#8B93FF] uppercase tracking-[0.2em]">Support Center</h2>
                <div className="grid gap-4">
                   <button 
                    onClick={() => navigate('/ai-support')}
                    className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all"
                   >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium">Talk to SoulAI</p>
                          <p className="text-[10px] text-white/40 font-light">Instant, non-judgmental support</p>
                        </div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]"></div>
                   </button>
                   <button 
                    onClick={() => navigate('/therapists')}
                    className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all"
                   >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                          <Stethoscope className="w-5 h-5 text-teal-400" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium">Therapist</p>
                          <p className="text-[10px] text-white/40 font-light">Book professional sessions</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-white/20 font-bold">4 MIN</span>
                   </button>
                </div>
             </div>

             <div className="glass-card p-8 bg-gradient-to-br from-[#8B93FF]/10 to-transparent flex flex-col min-h-[220px]">
                <h2 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Daily Reflection</h2>
                <div className="space-y-8 flex flex-col justify-center flex-1">
                   <p className="text-xl font-light text-white/80 leading-snug italic">"How heavy is your heart feeling right now?"</p>
                   <div className="space-y-4">
                      <div className="relative w-full h-1 bg-white/10 rounded-full">
                         <div className="absolute left-0 top-0 h-full w-1/3 bg-[#8B93FF] rounded-full shadow-[0_0_12px_rgba(139,147,255,0.4)]" />
                         <div className="absolute left-1/3 -top-2 w-5 h-5 bg-white border-4 border-[#8B93FF] rounded-full shadow-lg" />
                      </div>
                      <div className="flex justify-between text-[10px] text-white/20 uppercase font-bold tracking-[0.1em]">
                        <span>Light</span>
                        <span>Balanced</span>
                        <span>Heavy</span>
                      </div>
                   </div>
                </div>
             </div>
          </section>
        </div>

        {/* Floating Chat Overlay for Human Chat */}
        {activeSession && !activeSession.isAI && (
          <div className="fixed inset-0 lg:inset-y-10 lg:right-10 lg:left-auto lg:w-[480px] z-50">
             <ChatWindow onClose={() => setActiveSession(null)} />
          </div>
        )}
      </main>
    </div>
  );
}

function HeartIcon(props: any) {
  return (
    <svg 
      {...props} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
