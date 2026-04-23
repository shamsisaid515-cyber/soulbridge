/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { ArrowLeft, Star, Calendar, MessageCircle, ShieldCheck } from 'lucide-react';

export default function Therapists() {
  const navigate = useNavigate();
  const { therapists } = useStore();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Return to Bridge
          </button>
          <h1 className="text-5xl font-sans font-light tracking-tight">Professional <span className="text-[#8B93FF] italic">Healers</span></h1>
          <p className="text-white/40 text-lg font-light leading-relaxed max-w-xl">Licensed therapists who specialize in your specific journey and emotional needs.</p>
        </div>
        <div className="flex items-center gap-2 text-[#8B93FF] bg-[#8B93FF]/10 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#8B93FF]/30">
           <ShieldCheck className="w-4 h-4" /> 100% Verified Presence
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        {therapists.map((therapist) => (
          <motion.div
            key={therapist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="glass-card p-8 flex flex-col md:flex-row gap-8 items-start bg-white/[0.02]"
          >
            <div className="relative shrink-0">
              <img 
                src={therapist.avatar} 
                alt={therapist.name}
                className="w-32 h-32 rounded-[40px] object-cover shadow-2xl border border-white/10"
              />
              <div className="absolute -bottom-2 -right-2 bg-[#0A0B10] p-1.5 rounded-full border border-white/10 shadow-lg">
                <div className="bg-[#8B93FF] p-1 rounded-full">
                  <Star className="text-black w-3 h-3 fill-current" />
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-light tracking-tight">{therapist.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {therapist.specialties.map(s => (
                      <span key={s} className="text-[9px] font-bold uppercase tracking-widest text-[#8B93FF] bg-[#8B93FF]/10 px-2 py-0.5 rounded border border-[#8B93FF]/20">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-light font-sans text-white/90">{therapist.price}</span>
                  <p className="text-[9px] text-white/20 uppercase font-bold tracking-widest mt-1">Per Session</p>
                </div>
              </div>

              <p className="text-white/40 text-sm leading-relaxed line-clamp-2 font-light">
                {therapist.bio}
              </p>

              <div className="flex gap-4 pt-2">
                <button className="button-primary flex-1 flex items-center justify-center gap-2 text-xs py-2.5">
                  <Calendar className="w-4 h-4" /> Book Session
                </button>
                <button className="button-secondary p-2.5">
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Call to Action */}
        <div className="lg:col-span-2 glass-card p-12 bg-gradient-to-r from-[#8B93FF]/5 to-transparent border-dashed border border-white/10 flex flex-col items-center text-center space-y-6 mt-8">
           <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/5 shadow-xl">
              <ShieldCheck className="w-8 h-8 text-[#8B93FF]" />
           </div>
           <div>
              <h4 className="text-3xl font-light italic tracking-tight">Looking for something specific?</h4>
              <p className="text-white/40 max-w-sm mt-3 font-light leading-relaxed">
                Our care team can manually match you with specialized therapists based on your onboarding profile and history.
              </p>
           </div>
           <button className="button-secondary text-[#8B93FF] border-[#8B93FF]/30 hover:bg-[#8B93FF]/10 h-auto self-center">
             Connect with Care Support
           </button>
        </div>
      </div>
    </div>
  );
}
