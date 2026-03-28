import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Play, Pause, RotateCcw } from 'lucide-react-native';

interface TimerControlsProps {
  status: 'idle' | 'running' | 'paused' | 'completed';
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  size?: 'small' | 'medium' | 'large';
}

export function TimerControls({
  status,
  onStart,
  onPause,
  onResume,
  onReset,
  size = 'medium',
}: TimerControlsProps) {
  const buttonSize = size === 'small' ? 44 : size === 'medium' ? 56 : 72;
  const iconSize = size === 'small' ? 20 : size === 'medium' ? 24 : 32;

  return (
    <View style={styles.container}>
      {(status === 'idle' || status === 'completed') && (
        <TouchableOpacity
          style={[styles.button, styles.primaryButton, { width: buttonSize, height: buttonSize }]}
          onPress={onStart}
          testID="timer-start"
        >
          <Play size={iconSize} color="#fff" fill="#fff" />
        </TouchableOpacity>
      )}

      {status === 'running' && (
        <TouchableOpacity
          style={[styles.button, styles.warningButton, { width: buttonSize, height: buttonSize }]}
          onPress={onPause}
          testID="timer-pause"
        >
          <Pause size={iconSize} color="#fff" fill="#fff" />
        </TouchableOpacity>
      )}

      {status === 'paused' && (
        <>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton, { width: buttonSize, height: buttonSize }]}
            onPress={onResume}
            testID="timer-resume"
          >
            <Play size={iconSize} color="#fff" fill="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton, { width: buttonSize, height: buttonSize }]}
            onPress={onReset}
            testID="timer-reset"
          >
            <RotateCcw size={iconSize} color="#666" />
          </TouchableOpacity>
        </>
      )}

      {status === 'completed' && (
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton, { width: buttonSize, height: buttonSize }]}
          onPress={onReset}
          testID="timer-reset"
        >
          <RotateCcw size={iconSize} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  warningButton: {
    backgroundColor: '#FF9500',
  },
  secondaryButton: {
    backgroundColor: '#F2F2F7',
  },
});