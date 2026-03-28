import { create } from 'zustand';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import {
  TimerConfig,
  TimerState,
  SessionPhase,
  CompletedSession,
  Tag,
  TAG_COLORS,
} from '@/types';
import { storage } from '@/lib/storage';
import { playCompletionSound } from '@/lib/audio';

interface TimerStore {
  // Config
  config: TimerConfig;
  setConfig: (config: Partial<TimerConfig>) => Promise<void>;

  // Timer state
  timer: TimerState;
  isLoaded: boolean;

  // Actions
  loadFromStorage: () => Promise<void>;
  startWork: () => Promise<void>;
  startBreak: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  reset: () => Promise<void>;
  skip: () => Promise<void>;
  setActiveTag: (tagId: string | null) => void;

  // Called by tick interval
  tick: (now: number) => void;

  // Session history
  sessions: CompletedSession[];
  loadSessions: () => Promise<void>;

  // Tags
  tags: Tag[];
  loadTags: () => Promise<void>;
  addTag: (name: string, color?: string) => Promise<Tag | null>;
  deleteTag: (id: string) => Promise<void>;

  // Streak
  streak: number;
  lastSessionDate: string | null;
}

const DEFAULT_CONFIG: TimerConfig = {
  workDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  sessionsBeforeLongBreak: 4,
  autoStartBreaks: false,
  autoStartWork: false,
};

const IDLE_STATE: TimerState = {
  status: 'idle',
  phase: 'work',
  startedAt: null,
  elapsedMs: 0,
  totalDurationMs: 25 * 60 * 1000,
  completedSessions: 0,
  activeTagId: null,
};

function phaseDurationMs(phase: SessionPhase, config: TimerConfig): number {
  switch (phase) {
    case 'work': return config.workDuration * 1000;
    case 'short_break': return config.shortBreakDuration * 1000;
    case 'long_break': return config.longBreakDuration * 1000;
  }
}

function nextPhase(current: TimerState, config: TimerConfig): { phase: SessionPhase; sessions: number } {
  if (current.phase === 'work') {
    const sessions = current.completedSessions + 1;
    if (sessions >= config.sessionsBeforeLongBreak) {
      return { phase: 'long_break', sessions };
    }
    return { phase: 'short_break', sessions };
  }
  // After any break, go back to work
  const sessions = current.phase === 'long_break' ? 0 : current.completedSessions;
  return { phase: 'work', sessions };
}

async function scheduleEndNotification(durationMs: number) {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Timer Complete',
        body: 'Great work! Time for a break.',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: Math.max(1, Math.ceil(durationMs / 1000)),
      },
    });
  } catch (e) {
    console.warn('Failed to schedule notification:', e);
  }
}

async function cancelNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {
    console.warn('Failed to cancel notifications:', e);
  }
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  config: DEFAULT_CONFIG,
  timer: IDLE_STATE,
  isLoaded: false,
  sessions: [],
  tags: [],
  streak: 0,
  lastSessionDate: null,

  setConfig: async (partial) => {
    const config = { ...get().config, ...partial };
    set({ config });
    await storage.saveTimerConfig(config);
    // Update timer duration if idle
    const { timer } = get();
    if (timer.status === 'idle') {
      const totalDurationMs = phaseDurationMs(timer.phase, config);
      set({ timer: { ...timer, totalDurationMs } });
    }
  },

  loadFromStorage: async () => {
    const [config, timerState, sessions, tags, streakData, selectedTag] = await Promise.all([
      storage.getTimerConfig(),
      storage.getTimerState(),
      storage.getSessions(),
      storage.getTags(),
      storage.getStreak(),
      storage.getSelectedTagId(),
    ]);

    const finalConfig = { ...DEFAULT_CONFIG, ...config };

    let timer: TimerState;
    if (timerState && timerState.status === 'running' && timerState.startedAt) {
      // App was killed while running — calculate how much time passed
      const now = Date.now();
      const elapsed = timerState.elapsedMs + (now - timerState.startedAt);
      if (elapsed >= timerState.totalDurationMs) {
        // Timer completed while app was closed
        timer = { ...IDLE_STATE, totalDurationMs: phaseDurationMs('work', finalConfig), activeTagId: selectedTag };
      } else {
        // Timer still running, update elapsed
        timer = { ...timerState, elapsedMs: elapsed, startedAt: now, activeTagId: selectedTag };
      }
    } else if (timerState && timerState.status === 'paused') {
      timer = { ...timerState, activeTagId: selectedTag };
    } else {
      timer = { ...IDLE_STATE, totalDurationMs: phaseDurationMs('work', finalConfig), activeTagId: selectedTag };
    }

    set({
      config: finalConfig,
      timer,
      sessions,
      tags,
      streak: streakData.count,
      lastSessionDate: streakData.lastDate,
      isLoaded: true,
    });
  },

  startWork: async () => {
    const { config, timer } = get();
    const totalDurationMs = phaseDurationMs('work', config);
    const now = Date.now();
    const newTimer: TimerState = {
      status: 'running',
      phase: 'work',
      startedAt: now,
      elapsedMs: 0,
      totalDurationMs,
      completedSessions: timer.completedSessions,
      activeTagId: timer.activeTagId,
    };
    set({ timer: newTimer });
    await storage.saveTimerState(newTimer);
    await scheduleEndNotification(totalDurationMs);
  },

  startBreak: async () => {
    const { config, timer } = get();
    const { phase, sessions } = nextPhase(timer, config);
    const totalDurationMs = phaseDurationMs(phase, config);
    const now = Date.now();
    const newTimer: TimerState = {
      status: 'running',
      phase,
      startedAt: now,
      elapsedMs: 0,
      totalDurationMs,
      completedSessions: sessions,
      activeTagId: timer.activeTagId,
    };
    set({ timer: newTimer });
    await storage.saveTimerState(newTimer);
    await scheduleEndNotification(totalDurationMs);
  },

  pause: async () => {
    const { timer } = get();
    if (timer.status !== 'running' || !timer.startedAt) return;
    const now = Date.now();
    const elapsed = timer.elapsedMs + (now - timer.startedAt);
    const newTimer: TimerState = { ...timer, status: 'paused', startedAt: null, elapsedMs: elapsed };
    set({ timer: newTimer });
    await storage.saveTimerState(newTimer);
    await cancelNotifications();
  },

  resume: async () => {
    const { timer } = get();
    if (timer.status !== 'paused') return;
    const now = Date.now();
    const remaining = timer.totalDurationMs - timer.elapsedMs;
    const newTimer: TimerState = { ...timer, status: 'running', startedAt: now };
    set({ timer: newTimer });
    await storage.saveTimerState(newTimer);
    await scheduleEndNotification(remaining);
  },

  reset: async () => {
    const { config, timer } = get();
    const newTimer: TimerState = {
      ...IDLE_STATE,
      totalDurationMs: phaseDurationMs('work', config),
      activeTagId: timer.activeTagId,
    };
    set({ timer: newTimer });
    await storage.saveTimerState(null);
    await cancelNotifications();
  },

  skip: async () => {
    const { config, timer } = get();
    // Record completed session if skipping from work
    if (timer.phase === 'work' && timer.elapsedMs > 60000) {
      await get().tick(Date.now()); // force completion logic
    }
    const { phase, sessions } = nextPhase(timer, config);
    const totalDurationMs = phaseDurationMs(phase, config);
    const newTimer: TimerState = {
      status: 'idle',
      phase,
      startedAt: null,
      elapsedMs: 0,
      totalDurationMs,
      completedSessions: sessions,
      activeTagId: timer.activeTagId,
    };
    set({ timer: newTimer });
    await storage.saveTimerState(null);
    await cancelNotifications();
  },

  setActiveTag: (tagId) => {
    const { timer } = get();
    set({ timer: { ...timer, activeTagId: tagId } });
    storage.saveSelectedTagId(tagId);
  },

  tick: (now) => {
    const { timer, config } = get();
    if (timer.status !== 'running' || !timer.startedAt) return;

    const elapsed = timer.elapsedMs + (now - timer.startedAt);
    const remaining = timer.totalDurationMs - elapsed;

    if (remaining <= 0) {
      // Phase complete
      const completedTimer = { ...timer, status: 'idle' as const, startedAt: null, elapsedMs: timer.totalDurationMs };

      // Record session
      if (timer.phase === 'work') {
        const session: CompletedSession = {
          id: `session-${now}`,
          startedAt: new Date(timer.startedAt).toISOString(),
          endedAt: new Date(now).toISOString(),
          durationMs: timer.totalDurationMs,
          phase: 'work',
          tagId: timer.activeTagId,
          tagName: get().tags.find(t => t.id === timer.activeTagId)?.name || null,
        };
        storage.addSession(session);
        set(state => ({ sessions: [...state.sessions, session] }));

        // Update tag stats
        if (timer.activeTagId) {
          const tags = get().tags.map(t => {
            if (t.id === timer.activeTagId) {
              return {
                ...t,
                sessions: t.sessions + 1,
                totalMinutes: t.totalMinutes + Math.round(timer.totalDurationMs / 60000),
                lastUsed: new Date().toISOString(),
              };
            }
            return t;
          });
          set({ tags });
          storage.saveTags(tags);
        }

        // Update streak
        const today = new Date().toISOString().split('T')[0];
        const { lastSessionDate, streak } = get();
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        let newStreak = streak;
        if (lastSessionDate !== today) {
          newStreak = lastSessionDate === yesterday ? streak + 1 : 1;
        }
        set({ streak: newStreak, lastSessionDate: today });
        storage.saveStreak(newStreak, today);
      }

      // Play sound + haptic
      playCompletionSound();
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      }

      // Auto-start next phase or go idle
      const { phase, sessions } = nextPhase(timer, config);
      const shouldAutoStart =
        (timer.phase === 'work' && config.autoStartBreaks) ||
        (timer.phase !== 'work' && config.autoStartWork);

      if (shouldAutoStart) {
        const totalDurationMs = phaseDurationMs(phase, config);
        const newTimer: TimerState = {
          status: 'running',
          phase,
          startedAt: Date.now(),
          elapsedMs: 0,
          totalDurationMs,
          completedSessions: sessions,
          activeTagId: timer.activeTagId,
        };
        set({ timer: newTimer });
        storage.saveTimerState(newTimer);
        scheduleEndNotification(totalDurationMs);
      } else {
        const totalDurationMs = phaseDurationMs(phase, config);
        set({
          timer: {
            ...completedTimer,
            phase,
            completedSessions: sessions,
            totalDurationMs,
            elapsedMs: 0,
          },
        });
        storage.saveTimerState(null);
      }
      return;
    }

    // Just update elapsed in memory (no storage write on every tick)
    set({ timer: { ...timer, elapsedMs: elapsed, startedAt: now } });
  },

  loadSessions: async () => {
    const sessions = await storage.getSessions();
    set({ sessions });
  },

  loadTags: async () => {
    const tags = await storage.getTags();
    set({ tags });
  },

  addTag: async (name, color) => {
    const { tags } = get();
    if (tags.find(t => t.name.toLowerCase() === name.toLowerCase())) return null;
    const usedColors = tags.map(t => t.color);
    const available = TAG_COLORS.filter(c => !usedColors.includes(c));
    const newTag: Tag = {
      id: Date.now().toString(),
      name: name.trim(),
      color: color || available[0] || TAG_COLORS[tags.length % TAG_COLORS.length],
      sessions: 0,
      totalMinutes: 0,
      createdAt: new Date().toISOString(),
      lastUsed: null,
    };
    const updated = [...tags, newTag];
    set({ tags: updated });
    await storage.saveTags(updated);
    return newTag;
  },

  deleteTag: async (id) => {
    const { tags, timer } = get();
    const updated = tags.filter(t => t.id !== id);
    set({ tags: updated });
    await storage.saveTags(updated);
    if (timer.activeTagId === id) {
      get().setActiveTag(null);
    }
  },
}));

