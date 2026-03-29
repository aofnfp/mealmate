import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useUserStore } from '@/store/user-store';
import { useMealStore } from '@/store/meal-store';

const DIET_LABELS: Record<string, string> = {
  omnivore: 'Omnivore',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  keto: 'Keto',
  pescatarian: 'Pescatarian',
  paleo: 'Paleo',
  'gluten-free': 'Gluten-Free',
};

export default function SettingsScreen() {
  const router = useRouter();
  const { dietType, allergies, calorieTarget, resetProfile } = useUserStore();
  const { deleteAllData } = useMealStore();

  const handleDeleteAll = () => {
    Alert.alert(
      'Delete All Data',
      'This will permanently remove all your meal plans, grocery lists, favorites, and preferences. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: () => {
            deleteAllData();
            resetProfile();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>

        {/* Premium CTA */}
        <TouchableOpacity style={styles.premiumCard}>
          <View style={styles.premiumContent}>
            <Text style={styles.premiumTitle}>Go Premium</Text>
            <Text style={styles.premiumSubtitle}>AI plans, pantry tracking, no ads. $4.99/mo</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Diet & Nutrition */}
        <Text style={styles.sectionLabel}>DIET & NUTRITION</Text>
        <View style={styles.settingsGroup}>
          <SettingRow label="Dietary Preference" value={DIET_LABELS[dietType] || dietType} />
          <SettingRow label="Allergies" value={allergies.length > 0 ? allergies.map((a) => a.charAt(0).toUpperCase() + a.slice(1)).join(', ') : 'None'} />
          <SettingRow label="Calorie Target" value={calorieTarget ? `${calorieTarget.toLocaleString()}/day` : 'Not set'} />
          <SettingRow label="Measurement Units" value="US" isLast />
        </View>

        {/* App */}
        <Text style={styles.sectionLabel}>APP</Text>
        <View style={styles.settingsGroup}>
          <SettingRow label="Notifications" />
          <SettingRow label="Plan History" onPress={() => router.push('/history')} />
          <SettingRow label="Export My Data" isLast />
        </View>

        {/* About */}
        <Text style={styles.sectionLabel}>ABOUT</Text>
        <View style={styles.settingsGroup}>
          <SettingRow label="Privacy Policy" onPress={() => router.push('/privacy')} isLast />
        </View>

        {/* Delete */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAll}>
          <Text style={styles.deleteButtonText}>Delete All Data</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({ label, value, isLast, onPress }: { label: string; value?: string; isLast?: boolean; onPress?: () => void }) {
  return (
    <TouchableOpacity style={[styles.settingRow, !isLast && styles.settingRowBorder]} onPress={onPress}>
      <Text style={styles.settingLabel}>{label}</Text>
      <View style={styles.settingRight}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  title: {
    fontFamily: 'DM Serif Display', fontSize: 28, letterSpacing: -0.56,
    color: Colors.textPrimary, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20,
  },
  // Premium
  premiumCard: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 20,
    backgroundColor: Colors.accent, borderRadius: 16, padding: 18, marginBottom: 28,
  },
  premiumContent: { flex: 1 },
  premiumTitle: { fontFamily: 'DM Sans', fontSize: 17, fontWeight: '700', color: '#fff', marginBottom: 2 },
  premiumSubtitle: { fontFamily: 'DM Sans', fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  // Sections
  sectionLabel: {
    fontFamily: 'DM Sans', fontSize: 11, fontWeight: '600', letterSpacing: 0.8,
    color: Colors.textTertiary, paddingHorizontal: 20, marginBottom: 8,
  },
  settingsGroup: {
    backgroundColor: Colors.surface, marginHorizontal: 20, borderRadius: 14,
    borderWidth: 1, borderColor: Colors.border, marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 15,
  },
  settingRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  settingLabel: { fontFamily: 'DM Sans', fontSize: 15, color: Colors.textPrimary },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  settingValue: { fontFamily: 'DM Sans', fontSize: 14, color: Colors.textTertiary },
  // Delete
  deleteButton: { alignItems: 'flex-start', paddingHorizontal: 20, paddingVertical: 8 },
  deleteButtonText: { fontFamily: 'DM Sans', fontSize: 15, color: '#D94040' },
});
