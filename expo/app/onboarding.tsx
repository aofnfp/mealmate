import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useUserStore } from '@/store/user-store';
import { useMealStore } from '@/store/meal-store';
import { DietType, Allergen } from '@/types';
import { Ionicons } from '@expo/vector-icons';

const DIET_OPTIONS: { type: DietType; label: string; desc: string }[] = [
  { type: 'omnivore', label: 'Omnivore', desc: 'Everything — no restrictions' },
  { type: 'vegetarian', label: 'Vegetarian', desc: 'No meat or fish' },
  { type: 'vegan', label: 'Vegan', desc: 'Plant-based only' },
  { type: 'keto', label: 'Keto', desc: 'Low carb, high fat' },
  { type: 'pescatarian', label: 'Pescatarian', desc: 'Fish and seafood, no meat' },
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

const CALORIE_PRESETS = [1500, 1800, 2000, 2200, 2500];

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const {
    dietType,
    allergies,
    calorieTarget,
    setDietType,
    toggleAllergy,
    setAllergies,
    setCalorieTarget,
    completeOnboarding,
  } = useUserStore();

  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customCalorieText, setCustomCalorieText] = useState('');

  const { generateNewPlan } = useMealStore();

  const handleCustomCalorie = () => {
    setShowCustomInput(true);
  };

  const handleCustomCalorieSubmit = () => {
    const val = parseInt(customCalorieText, 10);
    if (!isNaN(val) && val >= 800 && val <= 6000) {
      setCalorieTarget(val);
      setShowCustomInput(false);
      Keyboard.dismiss();
    } else {
      Alert.alert('Invalid Value', 'Enter a number between 800 and 6,000.');
    }
  };

  const handleFinish = () => {
    completeOnboarding();
    generateNewPlan();
    router.replace('/(tabs)');
  };

  const handleSkip = () => {
    handleFinish();
  };

  // Step 0: Welcome
  if (step === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.welcomeContent}>
          <View style={styles.illustrationCircle}>
            <Text style={styles.illustrationEmoji}>🫑🍄🥕</Text>
          </View>
          <Text style={styles.welcomeTitle}>
            Plan meals you'll{'\n'}actually cook
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Personalized weekly plans, auto-generated grocery lists, and recipes
            you'll love — all in 30 seconds.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => setStep(1)} accessibilityLabel="Get started" accessibilityRole="button">
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>
          <Text style={styles.fineprint}>
            No account required. Free forever with optional premium.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setStep(Math.max(0, step - 1))} accessibilityLabel="Go back" accessibilityRole="button">
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              style={[styles.progressDot, s <= step && styles.progressDotActive]}
            />
          ))}
        </View>
        <TouchableOpacity onPress={handleSkip} accessibilityLabel="Skip onboarding" accessibilityRole="button">
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Step 1: Dietary Profile */}
      {step === 1 && (
        <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.stepTitle}>What do you eat?</Text>
          <Text style={styles.stepSubtitle}>
            Select your dietary preference. You can change this later in settings.
          </Text>
          <View style={styles.optionsContainer}>
            {DIET_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.type}
                style={[
                  styles.dietOption,
                  dietType === opt.type && styles.dietOptionSelected,
                ]}
                onPress={() => setDietType(opt.type)}
                accessibilityLabel={`${opt.label}: ${opt.desc}`}
                accessibilityRole="radio"
                accessibilityState={{ selected: dietType === opt.type }}
              >
                <View style={styles.dietOptionLeft}>
                  <Text style={styles.dietOptionLabel}>{opt.label}</Text>
                  <Text style={styles.dietOptionDesc}>{opt.desc}</Text>
                </View>
                <View
                  style={[
                    styles.radioOuter,
                    dietType === opt.type && styles.radioOuterSelected,
                  ]}
                >
                  {dietType === opt.type && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.bottomAction}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => setStep(2)} accessibilityLabel="Continue to allergies" accessibilityRole="button">
              <Text style={styles.primaryButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Step 2: Allergies */}
      {step === 2 && (
        <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.stepTitle}>Any allergies?</Text>
          <Text style={styles.stepSubtitle}>
            We'll make sure these never appear in your meal plans. Select all that apply.
          </Text>
          <View style={styles.chipGrid}>
            {ALLERGEN_OPTIONS.map((opt) => {
              const isSelected = allergies.includes(opt.type);
              return (
                <TouchableOpacity
                  key={opt.type}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => toggleAllergy(opt.type)}
                  accessibilityLabel={opt.label}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isSelected }}
                >
                  {isSelected && (
                    <Ionicons name="checkmark" size={14} color="#fff" style={{ marginRight: 4 }} />
                  )}
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.disclaimer}>
            MealMate provides nutritional information for reference only. Always check ingredient labels.
          </Text>
          <View style={styles.bottomAction}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => setStep(3)} accessibilityLabel="Continue to calorie goals" accessibilityRole="button">
              <Text style={styles.primaryButtonText}>Continue</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryAction}
              onPress={() => { setAllergies([]); setStep(3); }}
              accessibilityLabel="No allergies, continue"
              accessibilityRole="button"
            >
              <Text style={styles.secondaryActionText}>No allergies</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Step 3: Calorie Target */}
      {step === 3 && (
        <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.stepTitle}>Daily calorie goal</Text>
          <Text style={styles.stepSubtitle}>
            Optional. We'll balance your meal plans around this target.
          </Text>
          <Text style={styles.calorieDisplay}>
            {calorieTarget ? calorieTarget.toLocaleString() : '—'}
          </Text>
          <Text style={styles.calorieLabel}>CALORIES PER DAY</Text>
          <View style={styles.presetGrid}>
            {CALORIE_PRESETS.map((cal) => (
              <TouchableOpacity
                key={cal}
                style={[
                  styles.presetChip,
                  calorieTarget === cal && styles.presetChipSelected,
                ]}
                onPress={() => setCalorieTarget(cal)}
                accessibilityLabel={`${cal.toLocaleString()} calories per day`}
                accessibilityRole="radio"
                accessibilityState={{ selected: calorieTarget === cal }}
              >
                <Text
                  style={[
                    styles.presetChipText,
                    calorieTarget === cal && styles.presetChipTextSelected,
                  ]}
                >
                  {cal.toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.presetChip} onPress={handleCustomCalorie} accessibilityLabel="Set custom calorie target" accessibilityRole="button">
              <Text style={styles.presetChipText}>Custom</Text>
            </TouchableOpacity>
          </View>
          {showCustomInput && (
            <View style={styles.customInputRow}>
              <TextInput
                style={styles.customInput}
                value={customCalorieText}
                onChangeText={setCustomCalorieText}
                keyboardType="number-pad"
                placeholder="e.g. 1700"
                placeholderTextColor={Colors.textTertiary}
                autoFocus
                maxLength={5}
                onSubmitEditing={handleCustomCalorieSubmit}
                returnKeyType="done"
                accessibilityLabel="Custom calorie amount"
              />
              <TouchableOpacity style={styles.customInputButton} onPress={handleCustomCalorieSubmit} accessibilityLabel="Confirm custom calories" accessibilityRole="button">
                <Ionicons name="checkmark" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.bottomAction}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleFinish} accessibilityLabel="Generate my meal plan" accessibilityRole="button">
              <Text style={styles.primaryButtonText}>Generate My Plan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryAction}
              onPress={() => { setCalorieTarget(null); handleFinish(); }}
              accessibilityLabel="Skip calorie target and generate plan"
              accessibilityRole="button"
            >
              <Text style={styles.secondaryActionText}>Skip — no calorie target</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  // Welcome
  welcomeContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  illustrationCircle: {
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: Colors.accentLight, alignItems: 'center', justifyContent: 'center', marginBottom: 48,
  },
  illustrationEmoji: { fontSize: 48 },
  welcomeTitle: {
    fontFamily: 'DM Serif Display', fontSize: 32, lineHeight: 40,
    letterSpacing: -0.64, color: Colors.textPrimary, textAlign: 'center', marginBottom: 16,
  },
  welcomeSubtitle: {
    fontFamily: 'DM Sans', fontSize: 16, lineHeight: 24,
    color: Colors.textSecondary, textAlign: 'center', marginBottom: 40,
  },
  fineprint: { fontFamily: 'DM Sans', fontSize: 13, color: Colors.textTertiary, marginTop: 16 },
  // Header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  progressBar: { flexDirection: 'row', gap: 8 },
  progressDot: { width: 32, height: 4, borderRadius: 2, backgroundColor: Colors.border },
  progressDotActive: { backgroundColor: Colors.accent },
  skipText: { fontFamily: 'DM Sans', fontSize: 15, color: Colors.textSecondary },
  // Steps
  stepContent: { flex: 1, paddingHorizontal: 20 },
  stepTitle: {
    fontFamily: 'DM Serif Display', fontSize: 28, lineHeight: 34,
    letterSpacing: -0.56, color: Colors.textPrimary, marginTop: 16, marginBottom: 8,
  },
  stepSubtitle: { fontFamily: 'DM Sans', fontSize: 15, lineHeight: 22, color: Colors.textSecondary, marginBottom: 28 },
  // Diet options
  optionsContainer: { gap: 10 },
  dietOption: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.surface, borderRadius: 14, padding: 16,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  dietOptionSelected: { borderColor: Colors.accent, backgroundColor: Colors.accentLight },
  dietOptionLeft: { flex: 1 },
  dietOptionLabel: { fontFamily: 'DM Sans', fontSize: 16, fontWeight: '600', color: Colors.textPrimary, marginBottom: 2 },
  dietOptionDesc: { fontFamily: 'DM Sans', fontSize: 13, color: Colors.textSecondary },
  radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  radioOuterSelected: { borderColor: Colors.accent },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.accent },
  // Chips
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14,
    borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface,
  },
  chipSelected: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  chipText: { fontFamily: 'DM Sans', fontSize: 14, fontWeight: '500', color: Colors.textPrimary },
  chipTextSelected: { color: '#fff' },
  disclaimer: { fontFamily: 'DM Sans', fontSize: 13, lineHeight: 18, color: Colors.textTertiary, marginTop: 24 },
  // Calories
  calorieDisplay: { fontFamily: 'DM Serif Display', fontSize: 56, color: Colors.accent, textAlign: 'center', marginTop: 40, marginBottom: 4 },
  calorieLabel: {
    fontFamily: 'DM Sans', fontSize: 11, fontWeight: '600', letterSpacing: 1.2,
    color: Colors.textTertiary, textAlign: 'center', marginBottom: 32,
  },
  presetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  presetChip: {
    paddingHorizontal: 22, paddingVertical: 14, borderRadius: 14,
    borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface, minWidth: 90, alignItems: 'center',
  },
  presetChipSelected: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  presetChipText: { fontFamily: 'DM Sans', fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  presetChipTextSelected: { color: '#fff' },
  // Custom calorie input
  customInputRow: {
    flexDirection: 'row', alignItems: 'center', marginTop: 20, gap: 10, justifyContent: 'center',
  },
  customInput: {
    width: 140, height: 48, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.surface, paddingHorizontal: 14, textAlign: 'center',
    fontFamily: 'DM Sans', fontSize: 16, color: Colors.textPrimary,
  },
  customInputButton: {
    width: 48, height: 48, borderRadius: 12, backgroundColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  // Actions
  bottomAction: { paddingVertical: 20, paddingBottom: 32 },
  primaryButton: { backgroundColor: Colors.accent, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  primaryButtonText: { fontFamily: 'DM Sans', fontSize: 16, fontWeight: '700', color: '#fff' },
  secondaryAction: { alignItems: 'center', paddingVertical: 14 },
  secondaryActionText: { fontFamily: 'DM Sans', fontSize: 14, color: Colors.textSecondary },
});
