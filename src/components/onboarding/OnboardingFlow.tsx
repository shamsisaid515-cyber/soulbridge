/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../store';
import { ChevronRight, ChevronLeft, Heart, Ghost, User } from 'lucide-react';

import { db } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

const STEPS = [
  {
    id: 'identity',
    title: "How would you like to be seen?",
    description: "Your privacy is our priority. You can stay anonymous or use your name."
  },
  {
    id: 'struggle',
    title: "What are you going through?",
    description: "Knowing a bit about your situation helps us find the right connection."
  },
  {
    id: 'intensity',
    title: "How intense is this feeling?",
    description: "Scale of 1 (Managing) to 10 (Overwhelming)."
  }
];

const TAGS = ['Grief', 'Anxiety', 'Stress', 'Relationships', 'Depression', 'Work', 'Health', 'General Support'];

export default function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const { user, updateOnboarding, completeOnboarding } = useStore();

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      // Save to Firebase before completing
      if (user) {
        try {
          await setDoc(doc(db, 'users', user.id), {
            ...user,
            onboarded: true,
            isOnline: true,
            lastSeen: new Date().toISOString()
          });
        } catch (e) {
          console.error("Error saving profile:", e);
        }
      }
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const currentStep = STEPS[step];

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <div className="mb-12 flex justify-center gap-2">
          {STEPS.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-500 ${i <= step ? 'w-12 bg-[#4A90E2]' : 'w-4 bg-gray-200'}`} 
            />
          ))}
        </div>

        <div className="glass-card p-10 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-serif font-bold mb-3">{currentStep.title}</h2>
                <p className="text-gray-500 leading-relaxed">{currentStep.description}</p>
              </div>

              {step === 0 && (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => updateOnboarding({ isAnonymous: true })}
                    className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${user?.isAnonymous ? 'border-[#8B93FF] bg-[#8B93FF]/10' : 'border-white/5 hover:border-white/10'}`}
                  >
                    <Ghost className={`w-10 h-10 ${user?.isAnonymous ? 'text-[#8B93FF]' : 'text-white/20'}`} />
                    <span className="font-semibold text-sm tracking-tight">Anonymous</span>
                  </button>
                  <button
                    onClick={() => updateOnboarding({ isAnonymous: false })}
                    className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${!user?.isAnonymous ? 'border-[#8B93FF] bg-[#8B93FF]/10' : 'border-white/5 hover:border-white/10'}`}
                  >
                    <User className={`w-10 h-10 ${!user?.isAnonymous ? 'text-[#8B93FF]' : 'text-white/20'}`} />
                    <span className="font-semibold text-sm tracking-tight">Use Name</span>
                  </button>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <textarea
                    value={user?.currentStruggle}
                    onChange={(e) => updateOnboarding({ currentStruggle: e.target.value })}
                    placeholder="Describe what's on your mind... (optional)"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-[#8B93FF]/20 min-h-[120px] resize-none outline-none text-white/80"
                  />
                  <div className="flex flex-wrap gap-2">
                    {TAGS.map(tag => (
                      <button
                        key={tag}
                        onClick={() => {
                          const tags = user?.tags || [];
                          if (tags.includes(tag)) {
                            updateOnboarding({ tags: tags.filter(t => t !== tag) });
                          } else {
                            updateOnboarding({ tags: [...tags, tag] });
                          }
                        }}
                        className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${user?.tags.includes(tag) ? 'bg-[#8B93FF] text-black border-[#8B93FF]' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-12 py-6">
                  <div className="relative">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={user?.intensity || 5}
                      onChange={(e) => updateOnboarding({ intensity: parseInt(e.target.value) })}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#8B93FF]"
                    />
                    <div className="flex justify-between mt-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                      <span>Light</span>
                      <span>Heavy</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-7xl font-sans font-light text-[#8B93FF]">{user?.intensity}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                {step > 0 && (
                  <button onClick={handleBack} className="button-secondary px-6">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <button onClick={handleNext} className="button-primary flex-1 flex justify-center items-center gap-2">
                  {step === STEPS.length - 1 ? 'Start Healing' : 'Continue'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <p className="text-center mt-8 text-gray-400 text-sm flex items-center justify-center gap-2">
          <Heart className="w-4 h-4" /> Your data is encrypted and secure.
        </p>
      </div>
    </div>
  );
}
