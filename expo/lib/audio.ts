import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

// Sound URLs - using placeholder sounds for now
const SOUND_URLS: { [key: string]: string } = {
  bell: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
  chime: 'https://www.soundjay.com/misc/sounds/wind-chime-1.mp3',
  buzzer: 'https://www.soundjay.com/misc/sounds/buzzer-1.mp3',
  gentle: 'https://www.soundjay.com/misc/sounds/bell-ringing-04.mp3',
};

// Store audio sound objects for reuse
const soundObjects: { [key: string]: any | null } = {};

export async function initAudio() {
  try {
    if (Platform.OS !== 'web') {
      // expo-audio doesn't require setAudioModeAsync
      // Audio configuration is handled automatically
    }
    console.log('Audio initialized');
  } catch (error) {
    console.error('Failed to initialize audio:', error);
  }
}

export async function loadCompletionSound() {
  // Load default sound
  await loadSound('bell');
}

export async function loadSound(soundType: string) {
  try {
    if (soundObjects[soundType]) {
      return; // Already loaded
    }
    
    if (Platform.OS !== 'web') {
      // expo-audio uses hooks, so we'll load on demand during play
      soundObjects[soundType] = SOUND_URLS[soundType] || SOUND_URLS.bell;
    }
    
    console.log(`Sound ${soundType} loaded`);
  } catch (error) {
    console.error(`Failed to load ${soundType} sound:`, error);
  }
}

export async function playCompletionSound(soundType: string = 'bell', volume: number = 80) {
  try {
    if (soundType === 'silent') return;
    
    const url = SOUND_URLS[soundType] || SOUND_URLS.bell;
    
    // Use web Audio API for all platforms temporarily
    // This will work on web and provide basic functionality on mobile
    if (typeof window !== 'undefined' && (window as any).Audio) {
      const audio = new (window as any).Audio(url);
      audio.volume = volume / 100;
      await audio.play();
    } else {
      console.log('Audio playback not available, would play:', soundType);
    }
  } catch (error) {
    console.error('Failed to play completion sound:', error);
  }
}

export async function triggerHaptic() {
  try {
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  } catch (error) {
    console.error('Failed to trigger haptic:', error);
  }
}

export async function cleanup() {
  try {
    // Clean up audio resources
    for (const key in soundObjects) {
      soundObjects[key] = null;
    }
    console.log('Audio cleanup completed');
  } catch (error) {
    console.error('Failed to cleanup audio:', error);
  }
}