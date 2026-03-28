import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useFocusFlow } from '@/store/focusflow-context';
import { TOWER_METADATA } from '@/types';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import StatCard from '@/components/StatCard';
import ProgressBar from '@/components/ProgressBar';
import { router } from 'expo-router';

export default function CityScreen() {
  const { userProfile, towers, isLoading } = useFocusFlow();

  if (isLoading || !towers) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your city...</Text>
      </View>
    );
  }

  const totalEnergy = userProfile?.totalEnergy || 1240;
  const currentStreak = userProfile?.currentStreak || 7;
  const weekSessions = 9;
  const totalDonated = 12.40;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      {/* Header */}
      <Text style={styles.title}>Your Life City</Text>
      <Text style={typography.subtitle}>See your progress across all areas</Text>

      {/* Isometric "skyline" placeholder */}
      <View style={styles.skyline}>
        <Text style={typography.subtitle}>[ Isometric City Illustration ]</Text>
        <View style={styles.legend}>
          {["Career", "Health", "Learning", "Creativity", "Relationships", "Personal"].map((t) => (
            <View key={t} style={styles.legendPill}>
              <Text style={styles.legendText}>{t}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Stats bottom sheet mimic */}
      <View style={styles.statsRow}>
        <StatCard label="Total Focus Energy" value={`${totalEnergy.toLocaleString()} ⚡`} />
        <StatCard label="Current Streak" value={`${currentStreak} days`} />
      </View>
      <View style={styles.statsRow}>
        <StatCard label="This Week" value={`${weekSessions} sessions`} />
        <StatCard label="Impact Donations" value={`${totalDonated.toFixed(2)}`} />
      </View>

      {/* Quick actions */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: colors.primary }]} 
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.actionText}>Start Session</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: colors.secondary }]} 
          onPress={() => router.push('/(tabs)/achievements')}
        >
          <Text style={styles.actionText}>View Achievements</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: colors.accent }]} 
          onPress={() => router.push('/(tabs)/donate')}
        >
          <Text style={styles.actionText}>Donate Energy</Text>
        </TouchableOpacity>
      </View>

      {/* Unlocked decor carousel placeholder */}
      <View style={styles.carousel}>
        <Text style={styles.sectionTitle}>Unlocked Elements</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={styles.decorCard}>
              <View style={styles.decorThumb} />
              <Text style={styles.decorLabel}>Banner #{i}</Text>
              <ProgressBar progress={(i * 0.15) % 1} />
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background, 
    padding: 16 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  title: { 
    fontSize: 22, 
    fontWeight: "800" as const, 
    color: colors.textPrimary, 
    marginBottom: 4 
  },
  skyline: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    height: 220,
    marginVertical: 12,
    padding: 12,
  },
  legend: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "center", 
    marginTop: 12 
  },
  legendPill: {
    backgroundColor: "#EAF4FA",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    margin: 4,
  },
  legendText: { 
    fontSize: 12, 
    color: colors.primary, 
    fontWeight: "600" as const 
  },
  statsRow: { 
    flexDirection: "row", 
    marginTop: 8 
  },
  actions: { 
    flexDirection: "row", 
    marginTop: 16, 
    justifyContent: "space-between" 
  },
  actionBtn: { 
    flex: 1, 
    padding: 12, 
    borderRadius: 12, 
    marginHorizontal: 4 
  },
  actionText: { 
    color: "white", 
    textAlign: "center", 
    fontWeight: "700" as const 
  },
  carousel: { 
    marginTop: 20 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: "700" as const, 
    color: colors.textPrimary, 
    marginBottom: 8 
  },
  decorCard: {
    width: 160,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
  },
  decorThumb: { 
    height: 80, 
    backgroundColor: "#EDEFF1", 
    borderRadius: 8, 
    marginBottom: 8 
  },
  decorLabel: { 
    color: colors.textPrimary, 
    fontWeight: "600" as const, 
    marginBottom: 6 
  },
});