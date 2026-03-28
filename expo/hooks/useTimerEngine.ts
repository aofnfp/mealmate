import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useTimerStore } from '@/store/timers';

const TICK_INTERVAL = 250; // 250ms for smooth updates

export function useTimerEngine() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef(AppState.currentState);
  const { tickTimers, tickStopwatch, activeTimers, stopwatch } = useTimerStore();

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App has come to foreground, recalculate times
        console.log('App came to foreground, recalculating times');
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const hasActiveTimers = activeTimers.some(t => t.status === 'running');
    const isStopwatchRunning = stopwatch.status === 'running';

    if (hasActiveTimers || isStopwatchRunning) {
      if (!intervalRef.current) {
        console.log('Starting timer engine');
        intervalRef.current = setInterval(() => {
          const now = Date.now();
          if (hasActiveTimers) {
            tickTimers(now);
          }
          if (isStopwatchRunning) {
            tickStopwatch(now);
          }
        }, TICK_INTERVAL);
      }
    } else {
      if (intervalRef.current) {
        console.log('Stopping timer engine');
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [activeTimers, stopwatch.status, tickTimers, tickStopwatch]);
}