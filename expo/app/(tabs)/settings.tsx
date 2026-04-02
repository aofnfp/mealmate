import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useUserStore } from '@/store/user-store';
import { useMealStore } from '@/store/meal-store';
import { DietType, Allergen } from '@/types';

const DIET_OPTIONS: { type: DietType; label: string }[] = [
  { type: 'omnivore', label: 'Omnivore' },
  { type: 'vegetarian', label: 'Vegetarian' },
  { type: 'vegan', label: 'Vegan' },
  { type: 'keto', label: 'Keto' },
  { type: 'pescatarian', label: 'Pescatarian' },
  { type: 'paleo', label: 'Paleo' },
  { type: 'gluten-free', label: 'Gluten-Free' },
];

const ALLERGEN_OPTIONS: { type: Allergen; label: string }[] = [
  { type: 'nuts', label: 'Nuts' },
  { type: 'dairy', label: 'Dairy' },
  { type: 'eggs', label: 'Eggs' },
  { type: 'shellfish', label: 'Shellfish' },
  { type: 'soy', label: 'Soy' },
  { type: 'gluten', label: 'Gluten' },
  { type: 'fish', label: 'Fish' },
  { type: 'sesame', label: 'Sesame' },
];

const DIET_LABELS: Record<string, string> = Object.fromEntries(
  DIET_OPTIONS.map((o) => [o.type, o.label])
);

export default function SettingsScreen() {
  const router = useRouter();
  const { dietType, allergies, calorieTarget, setDietType, toggleAllergy, setCalorieTarget, resetProfile } = useUserStore();
  const { deleteAllData } = useMealStore();
  const [showCalorieModal, setShowCalorieModal] = useState(false);
  const [calorieInput, setCalorieInput] = useState('');

  const handleChangeDiet = () => {
    Alert.alert(
      'Dietary Preference',
      'Select your diet type.',
      DIET_OPTIONS.map((opt) => ({
        text: `${opt.label}${dietType === opt.type ? ' ✓' : ''}`,
        onPress: () => setDietType(opt.type),
      }))
    );
  };

  const handleChangeAllergies = () => {
    Alert.alert(
      'Allergies',
      `Current: ${allergies.length > 0 ? allergies.map((a) => a.charAt(0).toUpperCase() + a.slice(1)).join(', ') : 'None'}\n\nSelect an allergen to toggle it on or off.`,
      [
        ...ALLERGEN_OPTIONS.map((opt) => ({
          text: `${opt.label}${allergies.includes(opt.type) ? ' ✓' : ''}`,
          onPress: () => toggleAllergy(opt.type),
        })),
        { text: 'Done', style: 'cancel' as const },
      ]
    );
  };

  const handleChangeCalorie = () => {
    setCalorieInput(calorieTarget ? String(calorieTarget) : '');
    setShowCalorieModal(true);
  };

  const handleSaveCalorie = () => {
    const val = parseInt(calorieInput, 10);
    if (calorieInput.trim() === '') {
      setCalorieTarget(null);
    } else if (!isNaN(val) && val >= 800 && val <= 6000) {
      setCalorieTarget(val);
    } else {
      Alert.alert('Invalid Value', 'Enter a number between 800 and 6,000.');
      return;
    }
    setShowCalorieModal(false);
  };

  const handleNotifications = () => {
    Alert.alert(
      'Notifications',
      'Notification preferences will open your device settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
      ]
    );
  };

  const handleExportData = () => {
    const profile = useUserStore.getState();
    const meals = useMealStore.getState();
    const summary = [
      `Diet: ${DIET_LABELS[profile.dietType] || profile.dietType}`,
      `Allergies: ${profile.allergies.length > 0 ? profile.allergies.join(', ') : 'None'}`,
      `Calorie Target: ${profile.calorieTarget ?? 'Not set'}`,
      `Favorites: ${meals.favorites.length} recipes`,
      `Plan History: ${meals.planHistory.length} plans`,
      `Grocery Items: ${meals.groceryItems.length} items`,
    ].join('\n');
    Alert.alert('Your Data', summary);
  };

  const handlePremium = () => {
    Alert.alert('Coming Soon', 'Premium features are not yet available. Stay tuned!');
  };

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
        <TouchableOpacity style={styles.premiumCard} onPress={handlePremium} accessibilityLabel="Go Premium: coming soon" accessibilityRole="button">
          <View style={styles.premiumContent}>
            <Text style={styles.premiumTitle}>Go Premium</Text>
            <Text style={styles.premiumSubtitle}>AI plans, pantry tracking, no ads. Coming soon.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Diet & Nutrition */}
        <Text style={styles.sectionLabel}>DIET & NUTRITION</Text>
        <View style={styles.settingsGroup}>
          <SettingRow label="Dietary Preference" value={DIET_LABELS[dietType] || dietType} onPress={handleChangeDiet} />
          <SettingRow label="Allergies" value={allergies.length > 0 ? allergies.map((a) => a.charAt(0).toUpperCase() + a.slice(1)).join(', ') : 'None'} onPress={handleChangeAllergies} />
          <SettingRow label="Calorie Target" value={calorieTarget ? `${calorieTarget.toLocaleString()}/day` : 'Not set'} onPress={handleChangeCalorie} />
          <SettingRow label="Measurement Units" value="US" onPress={() => Alert.alert('Measurement Units', 'US units are currently the only supported format.')} isLast />
        </View>

        {/* App */}
        <Text style={styles.sectionLabel}>APP</Text>
        <View style={styles.settingsGroup}>
          <SettingRow label="Notifications" onPress={handleNotifications} />
          <SettingRow label="Plan History" onPress={() => router.push('/history')} />
          <SettingRow label="Export My Data" onPress={handleExportData} isLast />
        </View>

        {/* About */}
        <Text style={styles.sectionLabel}>ABOUT</Text>
        <View style={styles.settingsGroup}>
          <SettingRow label="Privacy Policy" onPress={() => router.push('/privacy')} isLast />
        </View>

        {/* Delete */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAll} accessibilityLabel="Delete all data" accessibilityRole="button" accessibilityHint="Permanently removes all meal plans, grocery lists, and preferences">
          <Text style={styles.deleteButtonText}>Delete All Data</Text>
        </TouchableOpacity>

        <Text style={styles.brandingText}>App by aoftech</Text>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Calorie Target Modal */}
      <Modal visible={showCalorieModal} transparent animationType="fade" onRequestClose={() => setShowCalorieModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Calorie Target</Text>
            <Text style={styles.modalSubtitle}>Enter your daily calorie goal (800–6,000), or leave blank to clear.</Text>
            <TextInput
              style={styles.modalInput}
              value={calorieInput}
              onChangeText={setCalorieInput}
              keyboardType="number-pad"
              placeholder="e.g. 2000"
              placeholderTextColor={Colors.textTertiary}
              autoFocus
              maxLength={5}
              accessibilityLabel="Calorie target input"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowCalorieModal(false)} accessibilityLabel="Cancel" accessibilityRole="button">
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={handleSaveCalorie} accessibilityLabel="Save calorie target" accessibilityRole="button">
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function SettingRow({ label, value, isLast, onPress }: { label: string; value?: string; isLast?: boolean; onPress?: () => void }) {
  return (
    <TouchableOpacity style={[styles.settingRow, !isLast && styles.settingRowBorder]} onPress={onPress} accessibilityLabel={value ? `${label}: ${value}` : label} accessibilityRole="button">
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
  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center', justifyContent: 'center', padding: 32,
  },
  modalContent: {
    width: '100%', backgroundColor: Colors.surface, borderRadius: 20, padding: 24,
  },
  modalTitle: {
    fontFamily: 'DM Serif Display', fontSize: 22, color: Colors.textPrimary, marginBottom: 6,
  },
  modalSubtitle: {
    fontFamily: 'DM Sans', fontSize: 14, color: Colors.textSecondary, lineHeight: 20, marginBottom: 20,
  },
  modalInput: {
    height: 48, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.background, paddingHorizontal: 14,
    fontFamily: 'DM Sans', fontSize: 16, color: Colors.textPrimary,
  },
  modalActions: {
    flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 20,
  },
  modalCancel: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  modalCancelText: { fontFamily: 'DM Sans', fontSize: 15, color: Colors.textSecondary },
  modalSave: {
    paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, backgroundColor: Colors.accent,
  },
  modalSaveText: { fontFamily: 'DM Sans', fontSize: 15, fontWeight: '600', color: '#fff' },
  brandingText: {
    fontFamily: 'DM Sans', fontSize: 11, color: Colors.textTertiary,
    textAlign: 'center', marginTop: 24,
  },
});
