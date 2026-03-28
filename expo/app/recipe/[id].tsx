import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useMealStore } from '@/store/meal-store';
import { getRecipeById } from '@/lib/plan-generator';

const DIFFICULTY_COLORS = {
  easy: Colors.success,
  medium: Colors.warning,
  hard: '#D94040',
};

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { favorites, toggleFavorite } = useMealStore();
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [cookingMode, setCookingMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const recipe = useMemo(() => getRecipeById(id), [id]);

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ padding: 20 }}>Recipe not found</Text>
      </SafeAreaView>
    );
  }

  const isFavorite = favorites.includes(recipe.id);

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with back + favorite */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.favButton} onPress={() => toggleFavorite(recipe.id)}>
              <Ionicons
                name={isFavorite ? 'star' : 'star-outline'}
                size={20}
                color={isFavorite ? Colors.accent : Colors.textTertiary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Image Placeholder */}
        <View style={styles.heroImage}>
          <Text style={styles.heroEmoji}>
            {recipe.mealType === 'breakfast' ? '🍳' : recipe.mealType === 'lunch' ? '🥗' : '🍽️'}
          </Text>
        </View>

        {/* Recipe Info */}
        <View style={styles.infoSection}>
          <View style={styles.tagRow}>
            <Text style={[styles.mealTypeTag, { color: Colors.accent }]}>
              {recipe.mealType.toUpperCase()}
            </Text>
            <Text style={styles.tagDivider}>·</Text>
            <Text style={[styles.difficultyTag, { color: DIFFICULTY_COLORS[recipe.difficulty] }]}>
              {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
            </Text>
          </View>

          <Text style={styles.recipeName}>{recipe.name}</Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{recipe.calories}</Text>
              <Text style={styles.statLabel}>CALORIES</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{recipe.totalTimeMinutes}</Text>
              <Text style={styles.statLabel}>MINUTES</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{recipe.servings}</Text>
              <Text style={styles.statLabel}>SERVINGS</Text>
            </View>
          </View>

          {/* Macro Pills */}
          <View style={styles.macroPills}>
            <View style={[styles.macroPill, { backgroundColor: Colors.accentLight }]}>
              <Text style={[styles.macroPillText, { color: Colors.accent }]}>{recipe.protein}g protein</Text>
            </View>
            <View style={[styles.macroPill, { backgroundColor: Colors.successLight }]}>
              <Text style={[styles.macroPillText, { color: Colors.success }]}>{recipe.carbs}g carbs</Text>
            </View>
            <View style={[styles.macroPill, { backgroundColor: Colors.warningLight }]}>
              <Text style={[styles.macroPillText, { color: Colors.warning }]}>{recipe.fat}g fat</Text>
            </View>
          </View>
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {recipe.ingredients.map((ing, i) => {
            const isChecked = checkedIngredients.has(i);
            return (
              <TouchableOpacity
                key={i}
                style={styles.ingredientRow}
                onPress={() => toggleIngredient(i)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                  {isChecked && <Ionicons name="checkmark" size={14} color="#fff" />}
                </View>
                <Text style={[styles.ingredientText, isChecked && styles.ingredientTextChecked]}>
                  {ing.quantity > 0 ? `${ing.quantity} ${ing.unit} `.trim() + ' ' : ''}
                  {ing.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {recipe.instructions.map((step, i) => (
            <View key={i} style={styles.instructionRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepNumber}>{i + 1}</Text>
              </View>
              <Text style={styles.instructionText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Start Cooking Button */}
        <View style={styles.cookingButtonWrap}>
          <TouchableOpacity
            style={styles.cookingButton}
            onPress={() => { setCurrentStep(0); setCookingMode(true); }}
          >
            <Ionicons name="flame" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.cookingButtonText}>Start Cooking</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Cooking Mode Modal */}
      <Modal visible={cookingMode} animationType="slide" presentationStyle="fullScreen">
        <SafeAreaView style={styles.cookingContainer}>
          <View style={styles.cookingHeader}>
            <TouchableOpacity onPress={() => setCookingMode(false)} style={styles.cookingClose}>
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.cookingTitle} numberOfLines={1}>{recipe.name}</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.cookingBody}>
            <Text style={styles.cookingStepLabel}>
              STEP {currentStep + 1} OF {recipe.instructions.length}
            </Text>
            <Text style={styles.cookingStepText}>{recipe.instructions[currentStep]}</Text>
          </View>

          {/* Progress dots */}
          <View style={styles.cookingDots}>
            {recipe.instructions.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.cookingDot,
                  i === currentStep && styles.cookingDotActive,
                  i < currentStep && styles.cookingDotDone,
                ]}
              />
            ))}
          </View>

          <View style={styles.cookingNav}>
            <TouchableOpacity
              style={[styles.cookingNavBtn, currentStep === 0 && styles.cookingNavBtnDisabled]}
              onPress={() => setCurrentStep((s) => Math.max(0, s - 1))}
              disabled={currentStep === 0}
            >
              <Ionicons name="chevron-back" size={20} color={currentStep === 0 ? Colors.textTertiary : Colors.textPrimary} />
              <Text style={[styles.cookingNavBtnText, currentStep === 0 && { color: Colors.textTertiary }]}>Previous</Text>
            </TouchableOpacity>

            {currentStep < recipe.instructions.length - 1 ? (
              <TouchableOpacity
                style={[styles.cookingNavBtn, styles.cookingNavBtnPrimary]}
                onPress={() => setCurrentStep((s) => s + 1)}
              >
                <Text style={styles.cookingNavBtnPrimaryText}>Next</Text>
                <Ionicons name="chevron-forward" size={20} color="#fff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.cookingNavBtn, styles.cookingNavBtnPrimary]}
                onPress={() => setCookingMode(false)}
              >
                <Ionicons name="checkmark" size={20} color="#fff" />
                <Text style={styles.cookingNavBtnPrimaryText}>Done</Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 8, zIndex: 10,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  headerRight: { flexDirection: 'row', gap: 8 },
  favButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  // Hero
  heroImage: {
    height: 180, backgroundColor: Colors.accentLight, alignItems: 'center', justifyContent: 'center',
    marginHorizontal: 20, borderRadius: 20, marginBottom: 20,
  },
  heroEmoji: { fontSize: 56 },
  // Info
  infoSection: { paddingHorizontal: 20 },
  tagRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  mealTypeTag: { fontFamily: 'DM Sans', fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  tagDivider: { color: Colors.textTertiary },
  difficultyTag: { fontFamily: 'DM Sans', fontSize: 13, fontWeight: '600' },
  recipeName: {
    fontFamily: 'DM Serif Display', fontSize: 28, lineHeight: 34, letterSpacing: -0.56,
    color: Colors.textPrimary, marginBottom: 20,
  },
  // Stats
  statsRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.surface, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: Colors.border, marginBottom: 16,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: 'DM Sans', fontSize: 22, fontWeight: '700', color: Colors.textPrimary },
  statLabel: { fontFamily: 'DM Sans', fontSize: 10, fontWeight: '600', letterSpacing: 0.6, color: Colors.textTertiary, marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.border },
  // Macros
  macroPills: { flexDirection: 'row', gap: 8, marginBottom: 28 },
  macroPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  macroPillText: { fontFamily: 'DM Sans', fontSize: 13, fontWeight: '600' },
  // Sections
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontFamily: 'DM Sans', fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 14 },
  // Ingredients
  ingredientRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  checkboxChecked: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  ingredientText: { flex: 1, fontFamily: 'DM Sans', fontSize: 15, color: Colors.textPrimary },
  ingredientTextChecked: { textDecorationLine: 'line-through', color: Colors.textTertiary },
  // Instructions
  instructionRow: { flexDirection: 'row', marginBottom: 16 },
  stepBadge: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.accentLight,
    alignItems: 'center', justifyContent: 'center', marginRight: 12, marginTop: 2,
  },
  stepNumber: { fontFamily: 'DM Sans', fontSize: 13, fontWeight: '700', color: Colors.accent },
  instructionText: { flex: 1, fontFamily: 'DM Sans', fontSize: 15, lineHeight: 22, color: Colors.textPrimary },
  // Cooking Button
  cookingButtonWrap: { paddingHorizontal: 20, marginTop: 4 },
  cookingButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.accent, borderRadius: 14, paddingVertical: 16,
  },
  cookingButtonText: { fontFamily: 'DM Sans', fontSize: 16, fontWeight: '700', color: '#fff' },
  // Cooking Mode
  cookingContainer: { flex: 1, backgroundColor: Colors.background },
  cookingHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12,
  },
  cookingClose: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  cookingTitle: {
    flex: 1, fontFamily: 'DM Sans', fontSize: 16, fontWeight: '600',
    color: Colors.textPrimary, textAlign: 'center', marginHorizontal: 8,
  },
  cookingBody: { flex: 1, justifyContent: 'center', paddingHorizontal: 32 },
  cookingStepLabel: {
    fontFamily: 'DM Sans', fontSize: 12, fontWeight: '700', letterSpacing: 1,
    color: Colors.accent, marginBottom: 16, textAlign: 'center',
  },
  cookingStepText: {
    fontFamily: 'DM Serif Display', fontSize: 26, lineHeight: 36,
    color: Colors.textPrimary, textAlign: 'center',
  },
  cookingDots: {
    flexDirection: 'row', justifyContent: 'center', gap: 6, paddingVertical: 20,
  },
  cookingDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.border,
  },
  cookingDotActive: { backgroundColor: Colors.accent, width: 20 },
  cookingDotDone: { backgroundColor: Colors.success },
  cookingNav: {
    flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 20, gap: 12,
  },
  cookingNavBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.surface, gap: 6,
  },
  cookingNavBtnDisabled: { opacity: 0.4 },
  cookingNavBtnText: { fontFamily: 'DM Sans', fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  cookingNavBtnPrimary: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  cookingNavBtnPrimaryText: { fontFamily: 'DM Sans', fontSize: 15, fontWeight: '700', color: '#fff' },
});
