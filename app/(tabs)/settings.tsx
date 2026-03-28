import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trash2, Crown } from 'lucide-react-native';
import { useTheme } from '@/store/theme-context';
import { useTimerStore } from '@/store/timer-store';
import { storage } from '@/lib/storage';
import { usePremiumStore } from '@/store/premium-store';
import AdBanner from '@/components/AdBanner';
import Paywall from '@/components/Paywall';

export default function SettingsScreen() {
  const { colors, themes, currentTheme, applyTheme } = useTheme();
  const { config, setConfig } = useTimerStore();
  const { isPremium, restore } = usePremiumStore();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [autoBreaks, setAutoBreaks] = useState(config.autoStartBreaks);
  const [autoWork, setAutoWork] = useState(config.autoStartWork);
  const [paywallVisible, setPaywallVisible] = useState(false);

  const handleAutoBreaks = useCallback((val: boolean) => {
    setAutoBreaks(val);
    setConfig({ autoStartBreaks: val });
  }, [setConfig]);

  const handleAutoWork = useCallback((val: boolean) => {
    setAutoWork(val);
    setConfig({ autoStartWork: val });
  }, [setConfig]);

  const handleRestore = useCallback(async () => {
    const success = await restore();
    if (success) {
      Alert.alert('Restored!', 'Your premium access has been restored.');
    } else {
      Alert.alert('No Purchases Found', 'We could not find any previous purchases.');
    }
  }, [restore]);

  const handleClearData = useCallback(() => {
    Alert.alert(
      'Clear All Data',
      'This will reset all your progress, sessions, and settings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await storage.clearAll();
            await useTimerStore.getState().loadFromStorage();
            Alert.alert('Done', 'All data has been cleared.');
          },
        },
      ]
    );
  }, []);

  const workMin = Math.round(config.workDuration / 60);
  const shortMin = Math.round(config.shortBreakDuration / 60);
  const longMin = Math.round(config.longBreakDuration / 60);

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { paddingHorizontal: 20, paddingBottom: 40 },
    title: { fontSize: 28, fontWeight: '700', color: colors.textPrimary, marginTop: 16, marginBottom: 24 },
    section: {
      backgroundColor: colors.surface, borderRadius: 16, paddingHorizontal: 16,
      marginBottom: 20, borderWidth: 1, borderColor: colors.outline,
    },
    sectionTitle: {
      fontSize: 12, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase',
      color: colors.textSecondary, marginBottom: 12, marginTop: 20, marginLeft: 4,
    },
    row: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.outline,
    },
    rowLast: { borderBottomWidth: 0 },
    rowLabel: { fontSize: 15, fontWeight: '500', color: colors.textPrimary },
    pills: { flexDirection: 'row', gap: 8 },
    pill: {
      paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16,
      borderWidth: 1.5, borderColor: colors.outline,
    },
    pillActive: { borderColor: colors.primary, backgroundColor: `${colors.primary}10` },
    pillText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
    pillTextActive: { color: colors.primary },
    themeRow: {
      flexDirection: 'row', alignItems: 'center', gap: 10,
      paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.outline,
    },
    themeRowLast: { borderBottomWidth: 0 },
    themeDot: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: 'transparent' },
    themeDotActive: { borderColor: colors.textPrimary },
    themeName: { flex: 1, fontSize: 14, fontWeight: '500', color: colors.textPrimary },
    themeCheck: { fontSize: 14, color: colors.primary, fontWeight: '700' },
    premiumBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
      paddingVertical: 16, borderRadius: 16, marginBottom: 20,
      backgroundColor: colors.primary,
    },
    premiumBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
    premiumActiveCard: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
      paddingVertical: 16, borderRadius: 16, marginBottom: 20,
      backgroundColor: `${colors.accent}15`, borderWidth: 1, borderColor: colors.accent,
    },
    premiumActiveText: { fontSize: 15, fontWeight: '600', color: colors.accent },
    restoreRow: {
      flexDirection: 'row', justifyContent: 'center', marginBottom: 16,
    },
    restoreText: { fontSize: 13, fontWeight: '500', color: colors.textSecondary, textDecorationLine: 'underline' },
    dangerBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
      paddingVertical: 14, borderRadius: 12, backgroundColor: `${colors.danger}10`, marginVertical: 12,
    },
    dangerText: { fontSize: 14, fontWeight: '600', color: colors.danger },
    version: { textAlign: 'center', fontSize: 12, color: colors.textSecondary, marginTop: 24 },
  }), [colors]);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>Settings</Text>

          {/* Premium section */}
          {isPremium ? (
            <View style={styles.premiumActiveCard}>
              <Crown size={20} color={colors.accent} />
              <Text style={styles.premiumActiveText}>Premium Active</Text>
            </View>
          ) : (
            <>
              <TouchableOpacity style={styles.premiumBtn} onPress={() => setPaywallVisible(true)} activeOpacity={0.8}>
                <Crown size={20} color="#FFFFFF" />
                <Text style={styles.premiumBtnText}>Upgrade to Premium</Text>
              </TouchableOpacity>
              <View style={styles.restoreRow}>
                <TouchableOpacity onPress={handleRestore}>
                  <Text style={styles.restoreText}>Restore purchases</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <Text style={styles.sectionTitle}>Timer</Text>
          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Work</Text>
              <View style={styles.pills}>
                {[15, 25, 45, 50].map(m => (
                  <TouchableOpacity key={m} style={[styles.pill, workMin === m && styles.pillActive]} onPress={() => setConfig({ workDuration: m * 60 })}>
                    <Text style={[styles.pillText, workMin === m && styles.pillTextActive]}>{m}m</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Short Break</Text>
              <View style={styles.pills}>
                {[3, 5, 10].map(m => (
                  <TouchableOpacity key={m} style={[styles.pill, shortMin === m && styles.pillActive]} onPress={() => setConfig({ shortBreakDuration: m * 60 })}>
                    <Text style={[styles.pillText, shortMin === m && styles.pillTextActive]}>{m}m</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={[styles.row, styles.rowLast]}>
              <Text style={styles.rowLabel}>Long Break</Text>
              <View style={styles.pills}>
                {[15, 20, 30].map(m => (
                  <TouchableOpacity key={m} style={[styles.pill, longMin === m && styles.pillActive]} onPress={() => setConfig({ longBreakDuration: m * 60 })}>
                    <Text style={[styles.pillText, longMin === m && styles.pillTextActive]}>{m}m</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Behavior</Text>
          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Auto-start breaks</Text>
              <Switch value={autoBreaks} onValueChange={handleAutoBreaks} />
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Auto-start work</Text>
              <Switch value={autoWork} onValueChange={handleAutoWork} />
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Sound</Text>
              <Switch value={soundEnabled} onValueChange={setSoundEnabled} />
            </View>
            <View style={[styles.row, styles.rowLast]}>
              <Text style={styles.rowLabel}>Haptics</Text>
              <Switch value={hapticsEnabled} onValueChange={setHapticsEnabled} />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Theme</Text>
          <View style={styles.section}>
            {themes.map((theme, i) => (
              <TouchableOpacity
                key={theme.id}
                style={[styles.themeRow, i === themes.length - 1 && styles.themeRowLast]}
                onPress={() => applyTheme(theme.id)}
              >
                <View style={[styles.themeDot, { backgroundColor: theme.colors.primary }, currentTheme.id === theme.id && styles.themeDotActive]} />
                <Text style={styles.themeName}>{theme.name}</Text>
                {currentTheme.id === theme.id && <Text style={styles.themeCheck}>Active</Text>}
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Data</Text>
          <View style={styles.section}>
            <TouchableOpacity style={styles.dangerBtn} onPress={handleClearData}>
              <Trash2 size={16} color={colors.danger} />
              <Text style={styles.dangerText}>Clear All Data</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.version}>FocusFlow v1.0.0</Text>
        </ScrollView>

        <AdBanner />
      </SafeAreaView>

      <Paywall visible={paywallVisible} onClose={() => setPaywallVisible(false)} />
    </View>
  );
}
