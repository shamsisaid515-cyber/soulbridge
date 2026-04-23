/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Heart, Shield, Users, MessageCircle } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-24">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-[#8B93FF] to-[#D291FF] rounded-xl flex items-center justify-center shadow-lg">
            <Heart className="text-black w-6 h-6" />
          </div>
          <span className="text-2xl font-sans font-semibold tracking-tight">SoulBridge</span>
        </div>
        <button 
          onClick={() => navigate('/onboarding')}
          className="button-secondary px-6 text-sm py-2"
        >
          Sign In
        </button>
      </nav>

      {/* Hero */}
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-6xl lg:text-8xl font-sans font-light leading-[0.95] mb-8 tracking-tight">
            Good evening, <br />
            <span className="text-[#8B93FF] italic">you're not alone.</span>
          </h1>
          <p className="text-xl text-white/50 mb-10 max-w-lg leading-relaxed">
            Connect with someone who truly understands what you're going through. 
            A safe, anonymous space for peer-to-peer mental health support.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => navigate('/onboarding')}
              className="button-primary"
            >
              Find someone who understands
            </button>
            <button className="button-secondary">
              How it works
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="glass-card aspect-square relative flex items-center justify-center p-12 bg-white/[0.02]">
            <div className="relative z-10 grid grid-cols-2 gap-6 w-full">
              {[
                { icon: Users, label: "Peer support", color: "bg-indigo-500/10" },
                { icon: Shield, label: "Full privacy", color: "bg-purple-500/10" },
                { icon: MessageCircle, label: "Real connections", color: "bg-blue-500/10" },
                { icon: Heart, label: "Safe space", color: "bg-rose-500/10" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl flex flex-col items-center gap-4 backdrop-blur-sm"
                >
                  <div className={`p-4 rounded-2xl ${item.color}`}>
                    <item.icon className="w-8 h-8 text-white/80" />
                  </div>
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Features */}
      <section className="mt-48 grid md:grid-cols-3 gap-12 text-white/80">
        <div className="space-y-4">
          <h3 className="text-2xl font-light text-[#8B93FF]">01. Be yourself</h3>
          <p className="text-white/50 leading-relaxed font-light">
            Choose an anonymous identity. No judgment, just authentic expression of your emotions.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-light text-[#8B93FF]">02. Get Matched</h3>
          <p className="text-white/50 leading-relaxed font-light">
            Our algorithm connects you with peers going through similar life transitions or struggles.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-light text-[#8B93FF]">03. Heal Together</h3>
          <p className="text-white/50 leading-relaxed font-light">
            Talk through shared experiences and support each other in a moderated, safe environment.
          </p>
        </div>
      </section>
    </div>
  );
}
