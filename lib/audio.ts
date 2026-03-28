import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SoundId } from '@/types';

let completionSound: Audio.Sound | null = null;
let ambientSound: Audio.Sound | null = null;
let currentAmbientId: SoundId | null = null;

const AMBIENT_SOURCES: Record<SoundId, string> = {
  rain: 'https://cdn.pixabay.com/audio/2022/05/16/audio_caa93d0b74.mp3',
  forest: 'https://cdn.pixabay.com/audio/2021/08/09/audio_5765af876d.mp3',
  ocean: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0c1ae2e0f.mp3',
  cafe: 'https://cdn.pixabay.com/audio/2024/11/01/audio_7d83f0e3ba.mp3',
  white_noise: 'https://cdn.pixabay.com/audio/2022/03/10/audio_262e92e7a9.mp3',
};

export async function initAudio() {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    });
  } catch (e) {
    console.warn('Audio init failed:', e);
  }
}

export async function playCompletionSound() {
  try {
    if (completionSound) {
      await completionSound.unloadAsync();
    }
    const { sound } = await Audio.Sound.createAsync(
      { uri: 'https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3' },
      { shouldPlay: true, volume: 0.8 }
    );
    completionSound = sound;
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
        completionSound = null;
      }
    });
  } catch (e) {
    console.warn('Completion sound failed:', e);
  }
}

export async function playAmbientSound(soundId: SoundId, volume: number = 0.5) {
  try {
    if (ambientSound && currentAmbientId !== soundId) {
      await stopAmbientSound();
    }
    if (ambientSound && currentAmbientId === soundId) {
      await ambientSound.setVolumeAsync(volume);
      return;
    }
    const uri = AMBIENT_SOURCES[soundId];
    if (!uri) return;
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true, volume, isLooping: true }
    );
    ambientSound = sound;
    currentAmbientId = soundId;
  } catch (e) {
    console.warn('Ambient sound failed:', e);
  }
}

export async function stopAmbientSound() {
  try {
    if (ambientSound) {
      await ambientSound.stopAsync();
      await ambientSound.unloadAsync();
      ambientSound = null;
      currentAmbientId = null;
    }
  } catch (e) {
    console.warn('Stop ambient failed:', e);
  }
}

export async function setAmbientVolume(volume: number) {
  try {
    if (ambientSound) {
      await ambientSound.setVolumeAsync(volume);
    }
  } catch (e) {
    console.warn('Set volume failed:', e);
  }
}

export function getPlayingAmbientId(): SoundId | null {
  return currentAmbientId;
}

export async function triggerHaptic() {
  try {
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  } catch (e) {
    console.warn('Haptic failed:', e);
  }
}

export async function cleanup() {
  if (completionSound) await completionSound.unloadAsync().catch(() => {});
  if (ambientSound) await ambientSound.unloadAsync().catch(() => {});
  completionSound = null;
  ambientSound = null;
  currentAmbientId = null;
}
