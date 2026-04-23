/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  avatar?: string;
  isAnonymous: boolean;
  onboarded: boolean;
  tags: string[];
  intensity: number;
  currentStruggle: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  type: 'human' | 'ai';
  isSystem?: boolean;
}

export interface Match {
  id: string;
  userIds: [string, string];
  commonTags: string[];
  status: 'pending' | 'accepted' | 'declined';
  lastActivity: number;
}

export interface Therapist {
  id: string;
  name: string;
  specialties: string[];
  bio: string;
  avatar: string;
  price: string;
}

export interface ChatSession {
  targetUserId: string;
  messages: Message[];
  isAI: boolean;
  isTyping: boolean;
}
