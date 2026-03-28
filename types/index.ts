// === Timer Types ===

export type TimerStatus = 'idle' | 'running' | 'paused' | 'break';
export type SessionPhase = 'work' | 'short_break' | 'long_break';

export interface TimerConfig {
  workDuration: number; // seconds
  shortBreakDuration: number; // seconds
  longBreakDuration: number; // seconds
  sessionsBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
}

export interface TimerState {
  status: TimerStatus;
  phase: SessionPhase;
  startedAt: number | null; // epoch ms
  elapsedMs: number; // accumulated before current run
  totalDurationMs: number;
  completedSessions: number;
  activeTagId: string | null;
}

// === Session History ===

export interface CompletedSession {
  id: string;
  startedAt: string; // ISO
  endedAt: string; // ISO
  durationMs: number;
  phase: SessionPhase;
  tagId: string | null;
  tagName: string | null;
}

// === Tags ===

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
  '#E07A5F', '#3D405B', '#81B29A', '#F2CC8F', '#5B8E7D',
  '#BC6C25', '#606C38', '#DDA15E', '#283618', '#8B5E3C',
];

// === Sounds ===

export type SoundId = 'rain' | 'forest' | 'ocean' | 'cafe' | 'white_noise';

export interface AmbientSound {
  id: SoundId;
  name: string;
  premium: boolean;
}

export const AMBIENT_SOUNDS: AmbientSound[] = [
  { id: 'rain', name: 'Rain', premium: false },
  { id: 'forest', name: 'Forest', premium: false },
  { id: 'ocean', name: 'Ocean Waves', premium: false },
  { id: 'cafe', name: 'Cafe', premium: true },
  { id: 'white_noise', name: 'White Noise', premium: true },
];

// === Settings ===

export interface AppSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  notificationsEnabled: boolean;
  volume: number;
  themeId: string;
}

// === Theme ===

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

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
}

// === Presets ===

export interface TimerPreset {
  id: string;
  name: string;
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessions: number;
}

export const DEFAULT_PRESETS: TimerPreset[] = [
  { id: 'pomodoro', name: 'Pomodoro', workMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15, sessions: 4 },
  { id: 'deep_work', name: 'Deep Work', workMinutes: 50, shortBreakMinutes: 10, longBreakMinutes: 30, sessions: 2 },
  { id: 'quick', name: 'Quick Focus', workMinutes: 15, shortBreakMinutes: 3, longBreakMinutes: 10, sessions: 4 },
];
