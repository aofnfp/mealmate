import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatDuration } from '@/lib/time';

interface TimerDisplayProps {
  milliseconds: number;
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export function TimerDisplay({ milliseconds, size = 'medium', color = '#000' }: TimerDisplayProps) {
  const fontSize = size === 'small' ? 24 : size === 'medium' ? 48 : 72;
  
  return (
    <View style={styles.container}>
      <Text 
        style={[
          styles.time, 
          { fontSize, color }
        ]}
        testID="timer-display"
      >
        {formatDuration(milliseconds)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    letterSpacing: 2,
  },
});