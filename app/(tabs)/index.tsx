import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, Pause, RotateCcw, SkipForward, Tag } from 'lucide-react-native';
import { useTheme } from '@/store/theme-context';
import { useTimerStore } from '@/store/timer-store';
import { DEFAULT_PRESETS, SessionPhase } from '@/types';

function formatTime(ms: number): string {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

function phaseLabel(phase: SessionPhase): string {
  switch (phase) {
    case 'work': return 'Focus';
    case 'short_break': return 'Short Break';
    case 'long_break': return 'Long Break';
  }
}

function phaseColor(phase: SessionPhase, primary: string): string {
  switch (phase) {
    case 'work': return primary;
    case 'short_break': return '#16A34A';
    case 'long_break': return '#2563EB';
  }
}

export default function TimerScreen() {
  const { colors } = useTheme();
  const {
    timer, config, tags, isLoaded,
    startWork, startBreak, pause, resume, reset, skip, setActiveTag, tick,
  } = useTimerStore();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Tick loop
  useEffect(() => {
    if (timer.status === 'running') {
      intervalRef.current = setInterval(() => tick(Date.now()), 250);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timer.status, tick]);

  // Calculate remaining time
  const remainingMs = useMemo(() => {
    if (timer.status === 'idle') return timer.totalDurationMs;
    return Math.max(0, timer.totalDurationMs - timer.elapsedMs);
  }, [timer]);

  const progress = useMemo(() => {
    if (timer.totalDurationMs === 0) return 0;
    return Math.min(1, timer.elapsedMs / timer.totalDurationMs);
  }, [timer]);

  // Animate progress
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  const handlePlayPause = useCallback(() => {
    if (timer.status === 'idle') {
      if (timer.phase === 'work') startWork();
      else startBreak();
    } else if (timer.status === 'running') {
      pause();
    } else if (timer.status === 'paused') {
      resume();
    }
  }, [timer.status, timer.phase, startWork, startBreak, pause, resume]);

  const handleReset = useCallback(() => reset(), [reset]);
  const handleSkip = useCallback(() => skip(), [skip]);

  const activeTag = tags.find(t => t.id === timer.activeTagId);
  const accent = phaseColor(timer.phase, colors.primary);

  // Preset selection for idle state
  const handlePresetSelect = useCallback((preset: typeof DEFAULT_PRESETS[0]) => {
    if (timer.status !== 'idle') return;
    const { setConfig } = useTimerStore.getState();
    setConfig({
      workDuration: preset.workMinutes * 60,
      shortBreakDuration: preset.shortBreakMinutes * 60,
      longBreakDuration: preset.longBreakMinutes * 60,
      sessionsBeforeLongBreak: preset.sessions,
    });
  }, [timer.status]);

  // Ring dimensions
  const RING_SIZE = 280;
  const STROKE = 8;
  const RADIUS = (RING_SIZE - STROKE) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    safeArea: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
    phaseLabel: {
      fontSize: 14, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase',
      color: accent, marginBottom: 32,
    },
    ringContainer: { width: RING_SIZE, height: RING_SIZE, alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
    ringBg: {
      position: 'absolute', width: RING_SIZE, height: RING_SIZE, borderRadius: RING_SIZE / 2,
      borderWidth: STROKE, borderColor: colors.outline,
    },
    timerText: { fontSize: 56, fontWeight: '300', color: colors.textPrimary, letterSpacing: 2, fontVariant: ['tabular-nums'] },
    sessionCounter: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
    controls: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 32 },
    playBtn: {
      width: 72, height: 72, borderRadius: 36, backgroundColor: accent,
      alignItems: 'center', justifyContent: 'center',
      shadowColor: accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
    },
    secondaryBtn: {
      width: 48, height: 48, borderRadius: 24, backgroundColor: colors.surface,
      alignItems: 'center', justifyContent: 'center',
      borderWidth: 1, borderColor: colors.outline,
    },
    presets: { flexDirection: 'row', gap: 10, marginBottom: 24 },
    preset: {
      paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
      borderWidth: 1.5, borderColor: colors.outline, backgroundColor: colors.surface,
    },
    presetActive: { borderColor: accent, backgroundColor: `${accent}10` },
    presetText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
    presetTextActive: { color: accent },
    tagChip: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
      backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.outline,
    },
    tagDot: { width: 10, height: 10, borderRadius: 5 },
    tagText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  }), [colors, accent, RING_SIZE, STROKE]);

  if (!isLoaded) return <View style={styles.container} />;

  const currentPreset = DEFAULT_PRESETS.find(p =>
    p.workMinutes * 60 === config.workDuration &&
    p.shortBreakMinutes * 60 === config.shortBreakDuration
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Phase Label */}
        <Text style={styles.phaseLabel}>{phaseLabel(timer.phase)}</Text>

        {/* Progress Ring */}
        <View style={styles.ringContainer}>
          <View style={styles.ringBg} />
          <Animated.View
            style={{
              position: 'absolute',
              width: RING_SIZE,
              height: RING_SIZE,
              borderRadius: RING_SIZE / 2,
              borderWidth: STROKE,
              borderColor: 'transparent',
              borderTopColor: accent,
              borderRightColor: accent,
              transform: [
                { rotate: '-90deg' },
                {
                  rotate: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            }}
          />
          <Text style={styles.timerText}>{formatTime(remainingMs)}</Text>
          <Text style={styles.sessionCounter}>
            Session {timer.completedSessions + (timer.phase === 'work' ? 1 : 0)} of {config.sessionsBeforeLongBreak}
          </Text>
        </View>

        {/* Presets (when idle) */}
        {timer.status === 'idle' && timer.phase === 'work' && (
          <View style={styles.presets}>
            {DEFAULT_PRESETS.map(preset => {
              const isActive = currentPreset?.id === preset.id;
              return (
                <TouchableOpacity
                  key={preset.id}
                  style={[styles.preset, isActive && styles.presetActive]}
                  onPress={() => handlePresetSelect(preset)}
                >
                  <Text style={[styles.presetText, isActive && styles.presetTextActive]}>
                    {preset.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={handleReset}>
            <RotateCcw size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.playBtn} onPress={handlePlayPause}>
            {timer.status === 'running' ? (
              <Pause size={28} color="#FFFFFF" fill="#FFFFFF" />
            ) : (
              <Play size={28} color="#FFFFFF" fill="#FFFFFF" />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={handleSkip}>
            <SkipForward size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Tag chip */}
        <TouchableOpacity style={styles.tagChip}>
          <View style={[styles.tagDot, { backgroundColor: activeTag?.color || colors.textSecondary }]} />
          <Text style={styles.tagText}>{activeTag?.name || 'No tag'}</Text>
          <Tag size={14} color={colors.textSecondary} />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
