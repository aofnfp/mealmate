import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Play, Edit2, Trash2 } from 'lucide-react-native';
import { TimerPreset } from '@/types';
import { formatDurationLong } from '@/lib/time';

interface PresetCardProps {
  preset: TimerPreset;
  onStart: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function PresetCard({ preset, onStart, onEdit, onDelete }: PresetCardProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.content} onPress={onStart}>
        <View style={styles.info}>
          <Text style={styles.label} numberOfLines={1}>{preset.label}</Text>
          <Text style={styles.duration}>{formatDurationLong(preset.durationMs)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.actionButton, styles.playButton]}
          onPress={onStart}
        >
          <Play size={18} color="#fff" fill="#fff" />
        </TouchableOpacity>
      </TouchableOpacity>
      
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={onEdit}
        >
          <Edit2 size={16} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={onDelete}
        >
          <Trash2 size={16} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  duration: {
    fontSize: 14,
    color: '#8E8E93',
  },
  actions: {
    flexDirection: 'row',
    paddingRight: 12,
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    backgroundColor: '#007AFF',
  },
  editButton: {
    backgroundColor: '#F2F2F7',
  },
  deleteButton: {
    backgroundColor: '#FFF2F2',
  },
});