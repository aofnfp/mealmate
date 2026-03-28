import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CloudRain, Trees, Waves, Coffee, Radio, Volume2, VolumeX } from 'lucide-react-native';
import { useTheme } from '@/store/theme-context';
import { AMBIENT_SOUNDS, SoundId } from '@/types';
import { playAmbientSound, stopAmbientSound, getPlayingAmbientId } from '@/lib/audio';

const SOUND_ICONS: Record<SoundId, React.ComponentType<any>> = {
  rain: CloudRain,
  forest: Trees,
  ocean: Waves,
  cafe: Coffee,
  white_noise: Radio,
};

export default function SoundsScreen() {
  const { colors } = useTheme();
  const [playingId, setPlayingId] = useState<SoundId | null>(getPlayingAmbientId());
  const [volume] = useState(0.5);

  const handleToggle = async (soundId: SoundId) => {
    if (playingId === soundId) {
      await stopAmbientSound();
      setPlayingId(null);
    } else {
      await playAmbientSound(soundId, volume);
      setPlayingId(soundId);
    }
  };

  const handleStopAll = async () => {
    await stopAmbientSound();
    setPlayingId(null);
  };

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { paddingHorizontal: 20, paddingBottom: 32 },
    title: { fontSize: 28, fontWeight: '700', color: colors.textPrimary, marginTop: 16, marginBottom: 8 },
    subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 28 },
    grid: { gap: 12 },
    card: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
      borderRadius: 16, padding: 18, borderWidth: 1.5, borderColor: colors.outline,
    },
    cardPlaying: { borderColor: colors.primary, backgroundColor: `${colors.primary}08` },
    cardLocked: { opacity: 0.5 },
    iconWrap: {
      width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
      backgroundColor: colors.background, marginRight: 16,
    },
    iconWrapPlaying: { backgroundColor: `${colors.primary}15` },
    soundName: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.textPrimary },
    premiumBadge: {
      fontSize: 10, fontWeight: '700', color: colors.accent, backgroundColor: `${colors.accent}15`,
      paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, overflow: 'hidden', marginRight: 8,
    },
    playingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
    stopBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
      backgroundColor: colors.surface, borderRadius: 14, paddingVertical: 14, marginTop: 20,
      borderWidth: 1, borderColor: colors.outline,
    },
    stopText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
    nowPlaying: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      backgroundColor: `${colors.primary}10`, borderRadius: 12, padding: 14, marginBottom: 20,
    },
    nowPlayingText: { fontSize: 13, fontWeight: '600', color: colors.primary },
  }), [colors]);

  const playingSound = AMBIENT_SOUNDS.find(s => s.id === playingId);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>Sounds</Text>
          <Text style={styles.subtitle}>Ambient sounds for focus</Text>

          {playingSound && (
            <View style={styles.nowPlaying}>
              <Volume2 size={16} color={colors.primary} />
              <Text style={styles.nowPlayingText}>Now playing: {playingSound.name}</Text>
            </View>
          )}

          <View style={styles.grid}>
            {AMBIENT_SOUNDS.map(sound => {
              const Icon = SOUND_ICONS[sound.id];
              const isPlaying = playingId === sound.id;
              return (
                <TouchableOpacity
                  key={sound.id}
                  style={[styles.card, isPlaying && styles.cardPlaying]}
                  onPress={() => handleToggle(sound.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconWrap, isPlaying && styles.iconWrapPlaying]}>
                    <Icon size={22} color={isPlaying ? colors.primary : colors.textSecondary} />
                  </View>
                  <Text style={styles.soundName}>{sound.name}</Text>
                  {sound.premium && <Text style={styles.premiumBadge}>PRO</Text>}
                  {isPlaying && <View style={styles.playingDot} />}
                </TouchableOpacity>
              );
            })}
          </View>

          {playingId && (
            <TouchableOpacity style={styles.stopBtn} onPress={handleStopAll}>
              <VolumeX size={18} color={colors.textSecondary} />
              <Text style={styles.stopText}>Stop all sounds</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
