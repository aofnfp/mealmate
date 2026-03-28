import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  TimerConfig,
  TimerState,
  CompletedSession,
  Tag,
  AppSettings,
  TAG_COLORS,
} from '@/types';

const KEYS = {
  TIMER_CONFIG: 'ff.timer.config',
  TIMER_STATE: 'ff.timer.state',
  SESSIONS: 'ff.sessions',
  TAGS: 'ff.tags',
  SELECTED_TAG: 'ff.selected_tag',
  SETTINGS: 'ff.settings',
  THEME_ID: 'ff.theme_id',
  STREAK: 'ff.streak',
  LAST_SESSION_DATE: 'ff.last_session_date',
} as const;

const DEFAULT_CONFIG: TimerConfig = {
  workDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  sessionsBeforeLongBreak: 4,
  autoStartBreaks: false,
  autoStartWork: false,
};

const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  hapticsEnabled: true,
  notificationsEnabled: true,
  volume: 70,
  themeId: 'calm_slate',
};

const DEFAULT_TAGS: Tag[] = [
  { id: '1', name: 'Deep Work', color: TAG_COLORS[0], sessions: 0, totalMinutes: 0, createdAt: new Date().toISOString(), lastUsed: null },
  { id: '2', name: 'Study', color: TAG_COLORS[1], sessions: 0, totalMinutes: 0, createdAt: new Date().toISOString(), lastUsed: null },
  { id: '3', name: 'Exercise', color: TAG_COLORS[2], sessions: 0, totalMinutes: 0, createdAt: new Date().toISOString(), lastUsed: null },
  { id: '4', name: 'Reading', color: TAG_COLORS[3], sessions: 0, totalMinutes: 0, createdAt: new Date().toISOString(), lastUsed: null },
];

async function getJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw || raw === 'undefined' || raw === 'null') return fallback;
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return { ...(fallback as object), ...parsed } as T;
    }
    return parsed as T;
  } catch {
    return fallback;
  }
}

async function getJSONArray<T>(key: string, fallback: T[]): Promise<T[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw || raw === 'undefined' || raw === 'null') return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

async function setJSON(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Storage write failed [${key}]:`, e);
  }
}

export const storage = {
  getTimerConfig: () => getJSON(KEYS.TIMER_CONFIG, DEFAULT_CONFIG),
  saveTimerConfig: (config: TimerConfig) => setJSON(KEYS.TIMER_CONFIG, config),

  getTimerState: (): Promise<TimerState | null> => getJSON<TimerState | null>(KEYS.TIMER_STATE, null),
  saveTimerState: async (state: TimerState | null) => {
    if (state) await setJSON(KEYS.TIMER_STATE, state);
    else await AsyncStorage.removeItem(KEYS.TIMER_STATE);
  },

  getSessions: () => getJSONArray<CompletedSession>(KEYS.SESSIONS, []),
  saveSessions: (sessions: CompletedSession[]) => setJSON(KEYS.SESSIONS, sessions),
  addSession: async (session: CompletedSession) => {
    const sessions = await storage.getSessions();
    sessions.push(session);
    if (sessions.length > 500) sessions.splice(0, sessions.length - 500);
    await storage.saveSessions(sessions);
  },

  getTags: () => getJSONArray<Tag>(KEYS.TAGS, DEFAULT_TAGS),
  saveTags: (tags: Tag[]) => setJSON(KEYS.TAGS, tags),

  getSelectedTagId: async (): Promise<string | null> => {
    try { return await AsyncStorage.getItem(KEYS.SELECTED_TAG); }
    catch { return null; }
  },
  saveSelectedTagId: async (id: string | null) => {
    if (id) await AsyncStorage.setItem(KEYS.SELECTED_TAG, id);
    else await AsyncStorage.removeItem(KEYS.SELECTED_TAG);
  },

  getSettings: () => getJSON(KEYS.SETTINGS, DEFAULT_SETTINGS),
  saveSettings: (settings: AppSettings) => setJSON(KEYS.SETTINGS, settings),

  getThemeId: async (): Promise<string | null> => {
    try { return await AsyncStorage.getItem(KEYS.THEME_ID); }
    catch { return null; }
  },
  saveThemeId: (id: string) => AsyncStorage.setItem(KEYS.THEME_ID, id),

  getStreak: async (): Promise<{ count: number; lastDate: string | null }> => {
    try {
      const count = parseInt((await AsyncStorage.getItem(KEYS.STREAK)) || '0', 10);
      const lastDate = await AsyncStorage.getItem(KEYS.LAST_SESSION_DATE);
      return { count: isNaN(count) ? 0 : count, lastDate };
    } catch {
      return { count: 0, lastDate: null };
    }
  },
  saveStreak: async (count: number, lastDate: string) => {
    await AsyncStorage.setItem(KEYS.STREAK, String(count));
    await AsyncStorage.setItem(KEYS.LAST_SESSION_DATE, lastDate);
  },

  clearAll: () => AsyncStorage.multiRemove(Object.values(KEYS)),
};
