import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flame, Clock, Target, TrendingUp } from 'lucide-react-native';
import { useTheme } from '@/store/theme-context';
import { useTimerStore } from '@/store/timer-store';
import AdBanner from '@/components/AdBanner';

function formatHours(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function StatsScreen() {
  const { colors } = useTheme();
  const { sessions, streak, tags } = useTimerStore();

  const todayStr = new Date().toISOString().split('T')[0];

  const todaySessions = useMemo(() =>
    sessions.filter(s => s.phase === 'work' && s.startedAt.startsWith(todayStr)),
    [sessions, todayStr]
  );

  const todayFocusMs = useMemo(() =>
    todaySessions.reduce((sum, s) => sum + s.durationMs, 0),
    [todaySessions]
  );

  const totalFocusMs = useMemo(() =>
    sessions.filter(s => s.phase === 'work').reduce((sum, s) => sum + s.durationMs, 0),
    [sessions]
  );

  const totalSessions = sessions.filter(s => s.phase === 'work').length;

  // Weekly data (last 7 days)
  const weekData = useMemo(() => {
    const days: { label: string; ms: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000);
      const dateStr = date.toISOString().split('T')[0];
      const dayLabel = date.toLocaleDateString('en', { weekday: 'short' });
      const dayMs = sessions
        .filter(s => s.phase === 'work' && s.startedAt.startsWith(dateStr))
        .reduce((sum, s) => sum + s.durationMs, 0);
      days.push({ label: dayLabel, ms: dayMs });
    }
    return days;
  }, [sessions]);

  const maxWeekMs = Math.max(...weekData.map(d => d.ms), 1);

  // Tag breakdown
  const tagStats = useMemo(() => {
    const map = new Map<string, { name: string; color: string; count: number; ms: number }>();
    sessions.filter(s => s.phase === 'work' && s.tagId).forEach(s => {
      const existing = map.get(s.tagId!);
      if (existing) {
        existing.count++;
        existing.ms += s.durationMs;
      } else {
        const tag = tags.find(t => t.id === s.tagId);
        map.set(s.tagId!, {
          name: s.tagName || tag?.name || 'Unknown',
          color: tag?.color || '#999',
          count: 1,
          ms: s.durationMs,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.ms - a.ms);
  }, [sessions, tags]);

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { paddingHorizontal: 20, paddingBottom: 32 },
    title: { fontSize: 28, fontWeight: '700', color: colors.textPrimary, marginTop: 16, marginBottom: 24 },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
    statCard: {
      flex: 1, minWidth: '45%', backgroundColor: colors.surface, borderRadius: 16,
      padding: 16, borderWidth: 1, borderColor: colors.outline,
    },
    statIcon: { marginBottom: 10 },
    statValue: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
    statLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 2, fontWeight: '500' },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 14 },
    weekChart: {
      backgroundColor: colors.surface, borderRadius: 16, padding: 16,
      borderWidth: 1, borderColor: colors.outline, marginBottom: 28,
    },
    barRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 100, marginBottom: 8 },
    barCol: { alignItems: 'center', flex: 1 },
    bar: { width: 24, borderRadius: 4, backgroundColor: colors.primary, minHeight: 4 },
    barLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 6 },
    tagRow: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
      borderRadius: 12, padding: 14, marginBottom: 8,
      borderWidth: 1, borderColor: colors.outline,
    },
    tagDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
    tagName: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.textPrimary },
    tagInfo: { fontSize: 13, color: colors.textSecondary },
    empty: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', paddingVertical: 40 },
  }), [colors]);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>Stats</Text>

          {/* Summary cards */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Clock size={20} color={colors.primary} style={styles.statIcon} />
              <Text style={styles.statValue}>{formatHours(todayFocusMs)}</Text>
              <Text style={styles.statLabel}>Today</Text>
            </View>
            <View style={styles.statCard}>
              <Target size={20} color={colors.primary} style={styles.statIcon} />
              <Text style={styles.statValue}>{todaySessions.length}</Text>
              <Text style={styles.statLabel}>Sessions today</Text>
            </View>
            <View style={styles.statCard}>
              <Flame size={20} color="#E07A5F" style={styles.statIcon} />
              <Text style={styles.statValue}>{streak}</Text>
              <Text style={styles.statLabel}>Day streak</Text>
            </View>
            <View style={styles.statCard}>
              <TrendingUp size={20} color={colors.primary} style={styles.statIcon} />
              <Text style={styles.statValue}>{formatHours(totalFocusMs)}</Text>
              <Text style={styles.statLabel}>All time ({totalSessions} sessions)</Text>
            </View>
          </View>

          {/* Weekly chart */}
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.weekChart}>
            <View style={styles.barRow}>
              {weekData.map((day, i) => (
                <View key={i} style={styles.barCol}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: Math.max(4, (day.ms / maxWeekMs) * 80),
                        opacity: day.ms > 0 ? 1 : 0.2,
                      },
                    ]}
                  />
                  <Text style={styles.barLabel}>{day.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Tag breakdown */}
          {tagStats.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>By Activity</Text>
              {tagStats.map(tag => (
                <View key={tag.name} style={styles.tagRow}>
                  <View style={[styles.tagDot, { backgroundColor: tag.color }]} />
                  <Text style={styles.tagName}>{tag.name}</Text>
                  <Text style={styles.tagInfo}>{tag.count} sessions / {formatHours(tag.ms)}</Text>
                </View>
              ))}
            </>
          )}

          {sessions.length === 0 && (
            <Text style={styles.empty}>Complete your first focus session to see stats</Text>
          )}
        </ScrollView>

        <AdBanner />
      </SafeAreaView>
    </View>
  );
}
