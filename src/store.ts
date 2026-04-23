/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { User, Message, Match, Therapist, ChatSession } from './types';
import { io, Socket } from 'socket.io-client';

interface SoulBridgeState {
  user: User | null;
  match: User | null;
  activeSession: ChatSession | null;
  matches: Match[];
  therapists: Therapist[];
  isMatching: boolean;
  socket: Socket | null;
  presenceList: Map<string, string>;
  
  // Actions
  setUser: (user: User | null) => void;
  setMatch: (match: User | null) => void;
  setActiveSession: (session: ChatSession | null) => void;
  addMessage: (message: Message) => void;
  setIsMatching: (loading: boolean) => void;
  updateOnboarding: (data: Partial<User>) => void;
  completeOnboarding: () => void;
  initSocket: (uid: string, name: string) => void;
}

export const useStore = create<SoulBridgeState>((set, get) => ({
  user: {
    id: `user_${Math.random().toString(36).substr(2, 9)}`,
    name: '',
    isAnonymous: true,
    onboarded: false,
    tags: [],
    intensity: 5,
    currentStruggle: '',
  },
  match: null,
  activeSession: null,
  matches: [],
  therapists: [
    {
      id: 't1',
      name: 'Dr. Sarah Wilson',
      specialties: ['Grief', 'Anxiety'],
      bio: 'Over 15 years of experience in cognitive behavioral therapy.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      price: '$80/session'
    },
    {
      id: 't2',
      name: 'Marcus Chen',
      specialties: ['Stress', 'Work-Life Balance'],
      bio: 'Helping professionals navigate high-pressure environments.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      price: '$95/session'
    }
  ],
  isMatching: false,
  socket: null,
  presenceList: new Map(),

  setUser: (user) => set({ user }),
  setMatch: (match) => set({ match }),
  setActiveSession: (activeSession) => set({ activeSession }),
  addMessage: (message) => set((state) => {
    if (!state.activeSession) return state;
    return {
      activeSession: {
        ...state.activeSession,
        messages: [...state.activeSession.messages, message]
      }
    };
  }),
  setIsMatching: (isMatching) => set({ isMatching }),
  updateOnboarding: (data) => set((state) => ({
    user: state.user ? { ...state.user, ...data } : null
  })),
  completeOnboarding: () => set((state) => ({
    user: state.user ? { ...state.user, onboarded: true } : null
  })),
  initSocket: (uid, name) => {
    const existingSocket = get().socket;
    if (existingSocket) return;

    const socket = io(); // Connects to the same host
    
    socket.on('connect', () => {
      socket.emit('user:online', { uid, name });
    });

    socket.on('presence:update', (list: [string, any][]) => {
      set({ presenceList: new Map(list.map(([id, info]) => [id, info.status])) });
    });

    socket.on('message:received', (message: Message) => {
      // Re-use addMessage logic
      if (message.senderId !== 'me') {
        get().addMessage(message);
      }
    });

    set({ socket });
  }
}));
