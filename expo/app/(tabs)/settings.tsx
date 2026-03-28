import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, Alert, Modal } from "react-native";

import { useFocusFlow } from "@/store/focusflow-context";
import { useTheme } from "@/store/theme-context";
import { storage } from "@/lib/storage";
import { ChevronRight } from "lucide-react-native";

export default function SettingsScreen() {
  const { settings, updateSettings, reloadData } = useFocusFlow();
  const { currentTheme, themes, applyTheme, previewTheme, colors: themeColors } = useTheme();
  const [constructionSounds, setConstructionSounds] = useState(settings?.constructionSounds ?? true);
  const [celebrationEffects, setCelebrationEffects] = useState(settings?.celebrationEffects ?? true);
  const [volume, setVolume] = useState(settings?.volume ?? 70);

  const [sessionReminders, setSessionReminders] = useState(settings?.sessionReminders ?? true);
  const [streakNotifications, setStreakNotifications] = useState(settings?.streakNotifications ?? true);
  const [impactUpdates, setImpactUpdates] = useState(settings?.impactUpdates ?? true);

  const [weatherEffects, setWeatherEffects] = useState(settings?.weatherEffects ?? true);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [previewThemeId, setPreviewThemeId] = useState<string | null>(null);

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]} contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={[styles.title, { color: themeColors.textPrimary }]}>Settings</Text>

      {/* Timer Settings */}
      <View style={[styles.section, { backgroundColor: themeColors.surface, borderColor: themeColors.outline }]}>
        <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Timer Settings</Text>
        <Row
          label="Construction Sounds"
          right={
            <Switch 
              value={constructionSounds} 
              onValueChange={(value) => {
                setConstructionSounds(value);
                updateSettings({ constructionSounds: value });
              }} 
            />
          }
        />
        <Row
          label="Celebration Effects"
          right={
            <Switch 
              value={celebrationEffects} 
              onValueChange={(value) => {
                setCelebrationEffects(value);
                updateSettings({ celebrationEffects: value });
              }} 
            />
          }
        />
        <View style={styles.sliderRow}>
          <Text style={[styles.rowLabel, { color: themeColors.textPrimary }]}>Volume: {volume}%</Text>
        </View>
      </View>

      {/* Notifications */}
      <View style={[styles.section, { backgroundColor: themeColors.surface, borderColor: themeColors.outline }]}>
        <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Notifications</Text>
        <Row 
          label="Session Reminders" 
          right={
            <Switch 
              value={sessionReminders} 
              onValueChange={(value) => {
                setSessionReminders(value);
                updateSettings({ sessionReminders: value });
              }} 
            />
          } 
        />
        <Row 
          label="Streak Notifications" 
          right={
            <Switch 
              value={streakNotifications} 
              onValueChange={(value) => {
                setStreakNotifications(value);
                updateSettings({ streakNotifications: value });
              }} 
            />
          } 
        />
        <Row 
          label="Impact Updates" 
          right={
            <Switch 
              value={impactUpdates} 
              onValueChange={(value) => {
                setImpactUpdates(value);
                updateSettings({ impactUpdates: value });
              }} 
            />
          } 
        />
      </View>

      {/* City Customization */}
      <View style={[styles.section, { backgroundColor: themeColors.surface, borderColor: themeColors.outline }]}>
        <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>City Customization</Text>
        <Row label="Building Style" right={<Text style={[styles.valuePill, { backgroundColor: `${themeColors.primary}22`, color: themeColors.primary }]}>Modern</Text>} />
        <Row 
          label="Weather Effects" 
          right={
            <Switch 
              value={weatherEffects} 
              onValueChange={(value) => {
                setWeatherEffects(value);
                updateSettings({ weatherEffects: value });
              }} 
            />
          } 
        />
      </View>

      {/* Theme / Privacy / About */}
      <View style={[styles.section, { backgroundColor: themeColors.surface, borderColor: themeColors.outline }]}>
        <TouchableOpacity onPress={() => setShowThemePicker(true)}>
          <Row 
            label="Theme" 
            right={
              <View style={styles.themeRow}>
                <Text style={[styles.valuePill, { backgroundColor: `${themeColors.primary}22`, color: themeColors.primary }]}>{currentTheme.name}</Text>
                <ChevronRight size={16} color={themeColors.textSecondary} />
              </View>
            } 
          />
        </TouchableOpacity>
        <Row label="Privacy" right={<Text style={[styles.valuePill, { backgroundColor: `${themeColors.primary}22`, color: themeColors.primary }]}>Standard</Text>} />
        <Row label="About & Version" right={<Text style={[styles.valuePill, { backgroundColor: `${themeColors.primary}22`, color: themeColors.primary }]}>v0.1.0</Text>} />
      </View>

      {/* Debug Section */}
      <View style={[styles.section, { backgroundColor: themeColors.surface, borderColor: themeColors.outline }]}>
        <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Debug & Reset</Text>
        <TouchableOpacity 
          style={[styles.debugButton, { backgroundColor: themeColors.secondary }]}
          onPress={async () => {
            Alert.alert(
              'Fix JSON Parse Error',
              'This will scan and remove any corrupted data from storage. Continue?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Fix',
                  onPress: async () => {
                    try {
                      console.log('Starting storage fix...');
                      const result = await storage.validateAndFixStorage();
                      
                      if (result.errors.length > 0) {
                        console.log('Storage errors found:', result.errors);
                      }
                      
                      // Reload data
                      await reloadData();
                      
                      Alert.alert(
                        'Success', 
                        result.fixed 
                          ? `Fixed ${result.errors.length} corrupted entries. App should work now.`
                          : 'No corrupted data found. Storage is clean.'
                      );
                    } catch (error) {
                      console.error('Debug error:', error);
                      Alert.alert('Error', 'Failed to fix storage: ' + (error as Error).message);
                    }
                  },
                },
              ]
            );
          }}
        >
          <Text style={[styles.debugButtonText, { color: themeColors.onSecondary }]}>Fix JSON Parse Error</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.debugButton, styles.debugButtonDanger, { backgroundColor: themeColors.danger }]}
          onPress={() => {
            Alert.alert(
              'Clear All Data',
              'This will reset all your progress, achievements, and settings. Are you sure?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Clear',
                  style: 'destructive',
                  onPress: async () => {
                    await storage.clearAll();
                    await reloadData();
                    Alert.alert('Success', 'All data has been cleared');
                  },
                },
              ]
            );
          }}
        >
          <Text style={[styles.debugButtonText, { color: '#FFFFFF' }]}>Clear All Data</Text>
        </TouchableOpacity>
      </View>

      {/* Theme Picker Modal */}
      <Modal
        visible={showThemePicker}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setShowThemePicker(false);
          if (previewThemeId) {
            applyTheme(currentTheme.id);
            setPreviewThemeId(null);
          }
        }}
      >
        <View style={[styles.modalContainer, { backgroundColor: themeColors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: themeColors.textPrimary }]}>Choose Theme</Text>
            <TouchableOpacity 
              onPress={() => {
                setShowThemePicker(false);
                if (previewThemeId) {
                  applyTheme(currentTheme.id);
                  setPreviewThemeId(null);
                }
              }}
            >
              <Text style={[styles.modalClose, { color: themeColors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.themeList}>
            {themes.map((theme) => (
              <TouchableOpacity
                key={theme.id}
                style={[
                  styles.themeItem,
                  { 
                    backgroundColor: themeColors.surface,
                    borderColor: theme.id === (previewThemeId || currentTheme.id) ? themeColors.primary : themeColors.outline,
                    borderWidth: theme.id === (previewThemeId || currentTheme.id) ? 2 : 1,
                  }
                ]}
                onPress={() => {
                  setPreviewThemeId(theme.id);
                  previewTheme(theme.id);
                }}
              >
                <View style={styles.themePreview}>
                  <View style={[styles.colorSwatch, { backgroundColor: theme.colors.primary }]} />
                  <View style={[styles.colorSwatch, { backgroundColor: theme.colors.secondary }]} />
                  <View style={[styles.colorSwatch, { backgroundColor: theme.colors.accent }]} />
                  <View style={[styles.colorSwatch, { backgroundColor: theme.colors.background }]} />
                </View>
                <Text style={[styles.themeName, { color: themeColors.textPrimary }]}>{theme.name}</Text>
                {theme.id === (previewThemeId || currentTheme.id) && (
                  <View style={[styles.selectedBadge, { backgroundColor: themeColors.primary }]}>
                    <Text style={[styles.selectedText, { color: themeColors.onPrimary }]}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <View style={[styles.modalFooter, { backgroundColor: themeColors.surface, borderTopColor: themeColors.outline }]}>
            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: themeColors.primary }]}
              onPress={() => {
                if (previewThemeId) {
                  applyTheme(previewThemeId);
                }
                setShowThemePicker(false);
                setPreviewThemeId(null);
              }}
            >
              <Text style={[styles.applyButtonText, { color: themeColors.onPrimary }]}>Apply Theme</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

interface RowProps {
  label: string;
  right: React.ReactNode;
}

function Row({ label, right }: RowProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>{label}</Text>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  modalClose: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  themeList: {
    flex: 1,
    padding: 16,
  },
  themeItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  themePreview: {
    flexDirection: 'row',
    gap: 8,
    marginRight: 16,
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  themeName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  selectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  applyButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  container: { 
    flex: 1, 
    padding: 16 
  },
  title: { 
    fontSize: 22, 
    fontWeight: "800" as const, 
    marginBottom: 8 
  },
  section: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  sectionTitle: { 
    fontWeight: "800" as const, 
    marginBottom: 8 
  },
  row: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingVertical: 10 
  },
  rowLabel: { 
    fontSize: 14, 
    fontWeight: "600" as const 
  },
  sliderRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 12, 
    paddingVertical: 12 
  },
  valuePill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    fontWeight: "700" as const,
  },
  debugButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  debugButtonDanger: {
    marginTop: 12,
  },
  debugButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
});