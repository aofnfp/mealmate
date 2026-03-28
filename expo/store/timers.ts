import { create } from 'zustand';
import { TimerPreset, RunningTimer, StopwatchState, AppSettings } from '@/types';
import { storage } from '@/lib/storage';
import { calculateRemaining, calculateElapsed } from '@/lib/time';
import { playCompletionSound, triggerHaptic } from '@/lib/audio';

interface TimerStore {
  // State
  presets: TimerPreset[];
  activeTimers: RunningTimer[];
  stopwatch: StopwatchState;
  settings: AppSettings;
  isLoaded: boolean;

  // Actions - Presets
  addPreset: (preset: TimerPreset) => Promise<void>;
  updatePreset: (id: string, updates: Partial<TimerPreset>) => Promise<void>;
  deletePreset: (id: string) => Promise<void>;

  // Actions - Timers
  startTimer: (preset: TimerPreset) => Promise<void>;
  pauseTimer: (id: string) => Promise<void>;
  resumeTimer: (id: string) => Promise<void>;
  resetTimer: (id: string) => Promise<void>;
  deleteTimer: (id: string) => Promise<void>;
  tickTimers: (now: number) => Promise<void>;

  // Actions - Stopwatch
  startStopwatch: () => Promise<void>;
  pauseStopwatch: () => Promise<void>;
  resetStopwatch: () => Promise<void>;
  addLap: () => Promise<void>;
  tickStopwatch: (now: number) => Promise<void>;

  // Actions - Settings
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;

  // Actions - Storage
  loadFromStorage: () => Promise<void>;
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  presets: [],
  activeTimers: [],
  stopwatch: {
    startEpochMs: null,
    pausedAt: null,
    elapsedMs: 0,
    status: 'idle',
    laps: [],
  },
  settings: {
    soundEnabled: true,
    hapticsEnabled: true,
    theme: 'system',
  },
  isLoaded: false,

  addPreset: async (preset) => {
    const { presets } = get();
    const newPresets = [...presets, preset];
    set({ presets: newPresets });
    await storage.saveTimerPresets(newPresets);
  },

  updatePreset: async (id, updates) => {
    const { presets } = get();
    const newPresets = presets.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    );
    set({ presets: newPresets });
    await storage.saveTimerPresets(newPresets);
  },

  deletePreset: async (id) => {
    const { presets } = get();
    const newPresets = presets.filter((p) => p.id !== id);
    set({ presets: newPresets });
    await storage.saveTimerPresets(newPresets);
  },

  startTimer: async (preset) => {
    const { activeTimers } = get();
    const newTimer: RunningTimer = {
      id: `timer-${Date.now()}-${Math.random()}`,
      presetId: preset.id,
      label: preset.label,
      durationMs: preset.durationMs,
      startEpochMs: Date.now(),
      pausedAt: null,
      elapsedMs: 0,
      status: 'running',
    };
    const newTimers = [...activeTimers, newTimer];
    set({ activeTimers: newTimers });
    await storage.saveActiveTimers(newTimers);
  },

  pauseTimer: async (id) => {
    const { activeTimers } = get();
    const now = Date.now();
    const newTimers = activeTimers.map((t) => {
      if (t.id === id && t.status === 'running' && t.startEpochMs) {
        const elapsed = t.elapsedMs + (now - t.startEpochMs);
        return {
          ...t,
          status: 'paused' as const,
          pausedAt: now,
          elapsedMs: elapsed,
          startEpochMs: null,
        };
      }
      return t;
    });
    set({ activeTimers: newTimers });
    await storage.saveActiveTimers(newTimers);
  },

  resumeTimer: async (id) => {
    const { activeTimers } = get();
    const now = Date.now();
    const newTimers = activeTimers.map((t) => {
      if (t.id === id && t.status === 'paused') {
        return {
          ...t,
          status: 'running' as const,
          startEpochMs: now,
          pausedAt: null,
        };
      }
      return t;
    });
    set({ activeTimers: newTimers });
    await storage.saveActiveTimers(newTimers);
  },

  resetTimer: async (id) => {
    const { activeTimers } = get();
    const newTimers = activeTimers.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          status: 'idle' as const,
          startEpochMs: null,
          pausedAt: null,
          elapsedMs: 0,
        };
      }
      return t;
    });
    set({ activeTimers: newTimers });
    await storage.saveActiveTimers(newTimers);
  },

  deleteTimer: async (id) => {
    const { activeTimers } = get();
    const newTimers = activeTimers.filter((t) => t.id !== id);
    set({ activeTimers: newTimers });
    await storage.saveActiveTimers(newTimers);
  },

  tickTimers: async (now) => {
    const { activeTimers, settings } = get();
    let hasChanges = false;
    let shouldPlaySound = false;

    const newTimers = activeTimers.map((timer) => {
      if (timer.status === 'running' && timer.startEpochMs) {
        const remaining = calculateRemaining(
          timer.durationMs,
          timer.startEpochMs,
          timer.pausedAt,
          timer.elapsedMs,
          now
        );

        if (remaining <= 0 && timer.status === 'running') {
          hasChanges = true;
          shouldPlaySound = true;
          return { ...timer, status: 'completed' as const };
        }
      }
      return timer;
    });

    if (hasChanges) {
      set({ activeTimers: newTimers });
      await storage.saveActiveTimers(newTimers);

      if (shouldPlaySound) {
        if (settings.soundEnabled) {
          await playCompletionSound();
        }
        if (settings.hapticsEnabled) {
          await triggerHaptic();
        }
      }
    }
  },

  startStopwatch: async () => {
    const now = Date.now();
    const newStopwatch: StopwatchState = {
      startEpochMs: now,
      pausedAt: null,
      elapsedMs: 0,
      status: 'running',
      laps: [],
    };
    set({ stopwatch: newStopwatch });
    await storage.saveStopwatchState(newStopwatch);
  },

  pauseStopwatch: async () => {
    const { stopwatch } = get();
    const now = Date.now();
    if (stopwatch.status === 'running' && stopwatch.startEpochMs) {
      const elapsed = stopwatch.elapsedMs + (now - stopwatch.startEpochMs);
      const newStopwatch: StopwatchState = {
        ...stopwatch,
        status: 'paused',
        pausedAt: now,
        elapsedMs: elapsed,
        startEpochMs: null,
      };
      set({ stopwatch: newStopwatch });
      await storage.saveStopwatchState(newStopwatch);
    }
  },

  resetStopwatch: async () => {
    const newStopwatch: StopwatchState = {
      startEpochMs: null,
      pausedAt: null,
      elapsedMs: 0,
      status: 'idle',
      laps: [],
    };
    set({ stopwatch: newStopwatch });
    await storage.saveStopwatchState(newStopwatch);
  },

  addLap: async () => {
    const { stopwatch } = get();
    const now = Date.now();
    const elapsed = calculateElapsed(
      stopwatch.startEpochMs,
      stopwatch.pausedAt,
      stopwatch.elapsedMs,
      now
    );
    const newStopwatch: StopwatchState = {
      ...stopwatch,
      laps: [...stopwatch.laps, elapsed],
    };
    set({ stopwatch: newStopwatch });
    await storage.saveStopwatchState(newStopwatch);
  },

  tickStopwatch: async (now) => {
    // Stopwatch doesn't need active ticking for state changes
    // The elapsed time is calculated on-demand in the UI
  },

  updateSettings: async (updates) => {
    const { settings } = get();
    const newSettings = { ...settings, ...updates };
    set({ settings: newSettings });
    await storage.saveSettings(newSettings);
  },

  loadFromStorage: async () => {
    const [presets, activeTimers, stopwatch, settings] = await Promise.all([
      storage.getTimerPresets(),
      storage.getActiveTimers(),
      storage.getStopwatchState(),
      storage.getSettings(),
    ]);

    set({
      presets,
      activeTimers,
      stopwatch: stopwatch || {
        startEpochMs: null,
        pausedAt: null,
        elapsedMs: 0,
        status: 'idle',
        laps: [],
      },
      settings,
      isLoaded: true,
    });
  },
}));