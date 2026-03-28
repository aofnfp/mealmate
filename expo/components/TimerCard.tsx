import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { X, Play, Pause, RotateCcw } from 'lucide-react-native';
import { RunningTimer } from '@/types';
import { TimerDisplay } from './TimerDisplay';
import { calculateRemaining } from '@/lib/time';
import { useTimerStore } from '@/store/timers';

interface TimerCardProps {
  timer: RunningTimer;
  onDelete: () => void;
}

export function TimerCard({ timer, onDelete }: TimerCardProps) {
  const { pauseTimer, resumeTimer, resetTimer } = useTimerStore();
  const [now, setNow] = React.useState(Date.now());

  React.useEffect(() => {
    if (timer.status === 'running') {
      const interval = setInterval(() => setNow(Date.now()), 100);
      return () => clearInterval(interval);
    }
  }, [timer.status]);

  const remaining = useMemo(() => {
    return calculateRemaining(
      timer.durationMs,
      timer.startEpochMs,
      timer.pausedAt,
      timer.elapsedMs,
      now
    );
  }, [timer, now]);

  const progress = useMemo(() => {
    const elapsed = timer.durationMs - remaining;
    return Math.min(1, Math.max(0, elapsed / timer.durationMs));
  }, [remaining, timer.durationMs]);

  const statusColor = 
    timer.status === 'completed' ? '#34C759' :
    timer.status === 'paused' ? '#FF9500' :
    timer.status === 'running' ? '#007AFF' : '#8E8E93';

  return (
    <View style={[styles.container, { borderLeftColor: statusColor }]}>
      <View style={styles.header}>
        <Text style={styles.label} numberOfLines={1}>{timer.label}</Text>
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <X size={20} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <TimerDisplay 
          milliseconds={timer.status === 'completed' ? 0 : remaining} 
          size="small"
          color={statusColor}
        />
        
        <View style={styles.controls}>
          {timer.status === 'running' && (
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: '#FF9500' }]}
              onPress={() => pauseTimer(timer.id)}
            >
              <Pause size={16} color="#fff" fill="#fff" />
            </TouchableOpacity>
          )}
          
          {timer.status === 'paused' && (
            <>
              <TouchableOpacity
                style={[styles.controlButton, { backgroundColor: '#007AFF' }]}
                onPress={() => resumeTimer(timer.id)}
              >
                <Play size={16} color="#fff" fill="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlButton, { backgroundColor: '#F2F2F7' }]}
                onPress={() => resetTimer(timer.id)}
              >
                <RotateCcw size={16} color="#666" />
              </TouchableOpacity>
            </>
          )}
          
          {(timer.status === 'idle' || timer.status === 'completed') && (
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: '#F2F2F7' }]}
              onPress={() => resetTimer(timer.id)}
            >
              <RotateCcw size={16} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <Animated.View 
            style={[
              styles.progressBar, 
              { 
                width: `${progress * 100}%`,
                backgroundColor: statusColor,
              }
            ]} 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  controls: {
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    height: 4,
    marginTop: 4,
  },
  progressBackground: {
    height: 4,
    backgroundColor: '#F2F2F7',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
});