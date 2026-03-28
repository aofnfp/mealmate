export type TowerType = 'career' | 'health' | 'learning' | 'creativity' | 'relationships' | 'personal';

export interface Tower {
  type: TowerType;
  level: number;
  energyInvested: number;
  currentGoal: string;
  progress: number; // 0-100 for current level
}

export interface UserProfile {
  totalEnergy: number;
  currentStreak: number;
  lifetimeSessions: number;
  totalFocusTime: number; // in seconds
  selectedCauses: string[];
  lastSessionDate: string | null;
  totalDonated: number;
}

export interface CurrentSession {
  towerType: TowerType | null;
  duration: number; // in seconds
  remaining: number; // in seconds
  isActive: boolean;
  isPaused: boolean;
  intention: string;
  startTime: number | null;
  pausedTime: number;
  energyEarned: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'builder' | 'streak' | 'impact' | 'special';
  unlockedAt: string | null;
  progress?: number;
  requirement?: number;
}

export interface Settings {
  constructionSounds: boolean;
  celebrationEffects: boolean;
  volume: number;
  architecturalStyle: 'modern' | 'classical' | 'futuristic';
  weatherEffects: boolean;
  sessionReminders: boolean;
  streakNotifications: boolean;
  impactUpdates: boolean;
  themeId: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
}

export interface ThemeColors {
  primary: string;
  onPrimary: string;
  secondary: string;
  onSecondary: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  outline: string;
}

export interface DonationCause {
  id: string;
  title: string;
  description: string;
  icon: string;
  currentProject: string;
  progress: number;
  totalContributed: number;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  sessions: number;
  totalMinutes: number;
  createdAt: string;
  lastUsed: string | null;
}

export const TAG_COLORS = [
  '#F4A09C', // Coral Pink
  '#EE786C', // Salmon
  '#D97A34', // Burnt Orange
  '#FFA85C', // Orange
  '#FFD93D', // Yellow
  
  '#F9E784', // Light Yellow
  '#C4D66C', // Yellow Green
  '#92B264', // Olive Green
  '#6CBAA5', // Teal
  '#87CEEB', // Sky Blue
  
  '#6CB4EE', // Blue
  '#6C8EBF', // Steel Blue
  '#9B88B4', // Purple
  '#D4A5A5', // Dusty Rose
  '#A8896C', // Brown
];

export interface QuickTimer {
  duration: number;
  label: string;
  subtitle?: string;
}

export const TOWER_METADATA: Record<TowerType, { icon: string; title: string; color: string; description: string }> = {
  career: { icon: '🏢', title: 'Career', color: '#2E86AB', description: 'Advance your professional goals' },
  health: { icon: '💪', title: 'Health', color: '#34C759', description: 'Build strength and wellness' },
  learning: { icon: '📚', title: 'Learning', color: '#F18F01', description: 'Expand your knowledge' },
  creativity: { icon: '🎨', title: 'Creativity', color: '#A23B72', description: 'Express your artistic side' },
  relationships: { icon: '❤️', title: 'Relationships', color: '#FF3B30', description: 'Strengthen connections' },
  personal: { icon: '🧘', title: 'Personal', color: '#5856D6', description: 'Develop inner peace' }
};

export const QUICK_TIMERS: QuickTimer[] = [
  { duration: 600, label: '10m', subtitle: 'Quick Start' },
  { duration: 1500, label: '25m', subtitle: 'Power Session' },
  { duration: 2700, label: '45m', subtitle: 'Deep Work' },
  { duration: 5400, label: '90m', subtitle: 'Marathon' }
];

export const ACHIEVEMENTS_DATA: Achievement[] = [
  // Builder Badges
  { id: 'first_tower', title: 'First Tower', description: 'Complete your first focus session', icon: '🏗️', category: 'builder', unlockedAt: null },
  { id: 'city_planner', title: 'City Planner', description: 'Build in all 6 life areas', icon: '🌆', category: 'builder', unlockedAt: null },
  { id: 'architect', title: 'Architect', description: 'Reach level 10 in any tower', icon: '📐', category: 'builder', unlockedAt: null },
  { id: 'master_builder', title: 'Master Builder', description: 'Reach level 25 in any tower', icon: '🏛️', category: 'builder', unlockedAt: null },
  
  // Streak Achievements
  { id: 'streak_3', title: '3 Day Streak', description: 'Focus for 3 consecutive days', icon: '🔥', category: 'streak', unlockedAt: null },
  { id: 'week_warrior', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '⚔️', category: 'streak', unlockedAt: null },
  { id: 'month_master', title: 'Month Master', description: 'Maintain a 30-day streak', icon: '👑', category: 'streak', unlockedAt: null },
  
  // Impact Awards
  { id: 'first_donation', title: 'First Donation', description: 'Make your first energy donation', icon: '💝', category: 'impact', unlockedAt: null },
  { id: 'generous_giver', title: 'Generous Giver', description: 'Donate 1000 energy points', icon: '🎁', category: 'impact', unlockedAt: null },
  { id: 'change_maker', title: 'Change Maker', description: 'Donate 10,000 energy points', icon: '🌟', category: 'impact', unlockedAt: null }
];

export const DONATION_CAUSES: DonationCause[] = [
  {
    id: 'education',
    title: 'Education',
    description: 'Build schools and support learning',
    icon: '🏫',
    currentProject: 'School in Kenya',
    progress: 0,
    totalContributed: 0
  },
  {
    id: 'environment',
    title: 'Environment',
    description: 'Plant trees and protect nature',
    icon: '🌳',
    currentProject: 'Reforestation in Brazil',
    progress: 0,
    totalContributed: 0
  },
  {
    id: 'health',
    title: 'Health',
    description: 'Support medical research and care',
    icon: '🏥',
    currentProject: 'Clean Water Wells',
    progress: 0,
    totalContributed: 0
  }
];