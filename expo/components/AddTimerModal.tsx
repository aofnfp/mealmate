import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { X } from 'lucide-react-native';
import { TimerPreset } from '@/types';
import { msFromParts, partsFromMs } from '@/lib/time';

interface AddTimerModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (preset: Omit<TimerPreset, 'id' | 'createdAt'>) => void;
  preset?: TimerPreset;
}

export function AddTimerModal({ visible, onClose, onSave, preset }: AddTimerModalProps) {
  const initialParts = preset ? partsFromMs(preset.durationMs) : { hours: 0, minutes: 5, seconds: 0 };
  
  const [label, setLabel] = useState(preset?.label || '');
  const [hours, setHours] = useState(initialParts.hours.toString());
  const [minutes, setMinutes] = useState(initialParts.minutes.toString());
  const [seconds, setSeconds] = useState(initialParts.seconds.toString());

  const handleSave = () => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    
    if (!label.trim()) {
      return;
    }
    
    if (h === 0 && m === 0 && s === 0) {
      return;
    }
    
    onSave({
      label: label.trim(),
      durationMs: msFromParts(h, m, s),
    });
    
    // Reset form
    setLabel('');
    setHours('0');
    setMinutes('5');
    setSeconds('0');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{preset ? 'Edit Timer' : 'New Timer'}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Label</Text>
              <TextInput
                style={styles.input}
                value={label}
                onChangeText={setLabel}
                placeholder="Timer name"
                placeholderTextColor="#8E8E93"
                testID="timer-label-input"
              />
            </View>
            
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Duration</Text>
              <View style={styles.durationContainer}>
                <View style={styles.durationField}>
                  <TextInput
                    style={styles.durationInput}
                    value={hours}
                    onChangeText={setHours}
                    keyboardType="number-pad"
                    placeholder="0"
                    placeholderTextColor="#8E8E93"
                    maxLength={2}
                    testID="timer-hours-input"
                  />
                  <Text style={styles.durationLabel}>hours</Text>
                </View>
                
                <View style={styles.durationField}>
                  <TextInput
                    style={styles.durationInput}
                    value={minutes}
                    onChangeText={setMinutes}
                    keyboardType="number-pad"
                    placeholder="0"
                    placeholderTextColor="#8E8E93"
                    maxLength={2}
                    testID="timer-minutes-input"
                  />
                  <Text style={styles.durationLabel}>min</Text>
                </View>
                
                <View style={styles.durationField}>
                  <TextInput
                    style={styles.durationInput}
                    value={seconds}
                    onChangeText={setSeconds}
                    keyboardType="number-pad"
                    placeholder="0"
                    placeholderTextColor="#8E8E93"
                    maxLength={2}
                    testID="timer-seconds-input"
                  />
                  <Text style={styles.durationLabel}>sec</Text>
                </View>
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 400,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  field: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    color: '#000',
  },
  durationContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  durationField: {
    flex: 1,
  },
  durationInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 16,
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 4,
  },
  durationLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F2F2F7',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});