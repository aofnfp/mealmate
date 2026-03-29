import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useMealStore } from '@/store/meal-store';
import { getRecipeById } from '@/lib/plan-generator';
import { DAY_NAMES, MealType, Recipe } from '@/types';
import SwapSheet from '@/components/SwapSheet';

const MEAL_LABELS: Record<MealType, { label: string; color: string }> = {
  breakfast: { label: 'BREAKFAST', color: Colors.accent },
  lunch: { label: 'LUNCH', color: Colors.success },
  dinner: { label: 'DINNER', color: Colors.warning },
};

export default function PlanScreen() {
  const router = useRouter();
  const { currentPlan, selectedDay, setSelectedDay, generateNewPlan, favorites, toggleFavorite } = useMealStore();
  const [swapTarget, setSwapTarget] = useState<{ dayOfWeek: number; mealType: MealType; recipeId: string } | null>(null);

  const today = new Date();
  const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1; // Mon=0

  // Get Monday of current week
  const monday = useMemo(() => {
    const d = new Date(today);
    const diff = d.getDate() - (d.getDay() === 0 ? 6 : d.getDay() - 1);
    d.setDate(diff);
    return d;
  }, []);

  const dayDates = useMemo(() => {
    return DAY_NAMES.map((_, i) => {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      return d.getDate();
    });
  }, [monday]);

  const mealsForDay = useMemo(() => {
    if (!currentPlan) return [];
    return currentPlan.items
      .filter((item) => item.dayOfWeek === selectedDay)
      .map((item) => ({
        ...item,
        recipe: getRecipeById(item.recipeId),
      }))
      .filter((item) => item.recipe);
  }, [currentPlan, selectedDay]);

  const dailyTotals = useMemo(() => {
    let calories = 0, protein = 0, carbs = 0, fat = 0;
    mealsForDay.forEach((m) => {
      if (m.recipe) {
        calories += m.recipe.calories;
        protein += m.recipe.protein;
        carbs += m.recipe.carbs;
        fat += m.recipe.fat;
      }
    });
    return { calories, protein, carbs, fat };
  }, [mealsForDay]);

  const dateLabel = today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase();

  if (!currentPlan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No meal plan yet</Text>
          <Text style={styles.emptySubtitle}>Generate your first weekly plan to get started.</Text>
          <TouchableOpacity style={styles.generateButton} onPress={generateNewPlan} accessibilityLabel="Generate meal plan" accessibilityRole="button">
            <Text style={styles.generateButtonText}>Generate Plan</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.dateLabel}>{dateLabel}</Text>
            <Text style={styles.headerTitle}>Today</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton} onPress={generateNewPlan} accessibilityLabel="Refresh meal plan" accessibilityRole="button" accessibilityHint="Generate a new weekly plan">
              <Ionicons name="refresh-outline" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} accessibilityLabel="View favorite meals" accessibilityRole="button">
              <Ionicons name="star" size={22} color={Colors.accent} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Day Selector */}
        <View style={styles.daySelector}>
          {DAY_NAMES.map((name, i) => (
            <TouchableOpacity
              key={name}
              style={[styles.dayItem, selectedDay === i && styles.dayItemActive]}
              onPress={() => setSelectedDay(i)}
              accessibilityLabel={`${name}, ${dayDates[i]}`}
              accessibilityRole="radio"
              accessibilityState={{ selected: selectedDay === i }}
            >
              <Text style={[styles.dayName, selectedDay === i && styles.dayNameActive]}>{name}</Text>
              <Text style={[styles.dayDate, selectedDay === i && styles.dayDateActive]}>{dayDates[i]}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Meal Cards */}
        <View style={styles.mealList}>
          {mealsForDay.map((meal) => {
            const recipe = meal.recipe as Recipe;
            const mealMeta = MEAL_LABELS[meal.mealType];
            return (
              <TouchableOpacity
                key={`${meal.dayOfWeek}-${meal.mealType}`}
                style={styles.mealCard}
                onPress={() => router.push(`/recipe/${recipe.id}`)}
                activeOpacity={0.7}
                accessibilityLabel={`${mealMeta.label}: ${recipe.name}`}
                accessibilityRole="button"
                accessibilityHint="View recipe details"
              >
                <View style={styles.mealCardThumb}>
                  <Text style={styles.mealCardEmoji}>
                    {meal.mealType === 'breakfast' ? '🍳' : meal.mealType === 'lunch' ? '🥗' : '🍽️'}
                  </Text>
                </View>
                <View style={styles.mealCardContent}>
                  <Text style={[styles.mealCardLabel, { color: mealMeta.color }]}>{mealMeta.label}</Text>
                  <Text style={styles.mealCardTitle} numberOfLines={2}>{recipe.name}</Text>
                  <Text style={styles.mealCardMeta}>
                    {recipe.calories} cal  |  {recipe.totalTimeMinutes} min
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.swapIconButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    setSwapTarget({ dayOfWeek: meal.dayOfWeek, mealType: meal.mealType, recipeId: recipe.id });
                  }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityLabel={`Swap ${mealMeta.label.toLowerCase()}`}
                  accessibilityRole="button"
                  accessibilityHint="Replace this meal with an alternative"
                >
                  <Ionicons name="swap-horizontal-outline" size={18} color={Colors.textTertiary} />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Daily Macro Summary */}
        <View style={styles.macroBar}>
          <View>
            <Text style={styles.macroLabel}>Daily total</Text>
            <Text style={styles.macroCalories}>{dailyTotals.calories.toLocaleString()} cal</Text>
          </View>
          <View style={styles.macroValues}>
            <Text style={styles.macroValue}>
              <Text style={{ color: Colors.accent, fontWeight: '700' }}>{dailyTotals.protein}g</Text>
              {'\n'}Protein
            </Text>
            <Text style={styles.macroValue}>
              <Text style={{ color: Colors.success, fontWeight: '700' }}>{dailyTotals.carbs}g</Text>
              {'\n'}Carbs
            </Text>
            <Text style={styles.macroValue}>
              <Text style={{ color: Colors.warning, fontWeight: '700' }}>{dailyTotals.fat}g</Text>
              {'\n'}Fat
            </Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {swapTarget && (
        <SwapSheet
          visible={!!swapTarget}
          onClose={() => setSwapTarget(null)}
          dayOfWeek={swapTarget.dayOfWeek}
          mealType={swapTarget.mealType}
          currentRecipeId={swapTarget.recipeId}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12,
  },
  dateLabel: {
    fontFamily: 'DM Sans', fontSize: 11, fontWeight: '600', letterSpacing: 0.8,
    color: Colors.textTertiary, marginBottom: 2,
  },
  headerTitle: {
    fontFamily: 'DM Serif Display', fontSize: 32, letterSpacing: -0.64, color: Colors.textPrimary,
  },
  headerActions: { flexDirection: 'row', gap: 8, paddingTop: 8 },
  iconButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  // Day selector
  daySelector: {
    flexDirection: 'row', paddingHorizontal: 16, marginBottom: 20, gap: 4,
  },
  dayItem: {
    flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 12,
  },
  dayItemActive: {
    backgroundColor: Colors.accent,
  },
  dayName: {
    fontFamily: 'DM Sans', fontSize: 11, fontWeight: '600', color: Colors.textTertiary, marginBottom: 4,
  },
  dayNameActive: { color: '#fff' },
  dayDate: {
    fontFamily: 'DM Sans', fontSize: 16, fontWeight: '700', color: Colors.textPrimary,
  },
  dayDateActive: { color: '#fff' },
  // Meal cards
  mealList: { paddingHorizontal: 20, gap: 12 },
  mealCard: {
    flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: 16,
    padding: 14, borderWidth: 1, borderColor: Colors.border,
  },
  mealCardThumb: {
    width: 64, height: 64, borderRadius: 12, backgroundColor: Colors.accentLight,
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  mealCardEmoji: { fontSize: 28 },
  mealCardContent: { flex: 1, justifyContent: 'center' },
  mealCardLabel: {
    fontFamily: 'DM Sans', fontSize: 11, fontWeight: '700', letterSpacing: 0.8, marginBottom: 4,
  },
  mealCardTitle: {
    fontFamily: 'DM Sans', fontSize: 16, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4,
  },
  mealCardMeta: { fontFamily: 'DM Sans', fontSize: 13, color: Colors.textTertiary },
  swapIconButton: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center',
  },
  // Macro bar
  macroBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginHorizontal: 20, marginTop: 24, paddingVertical: 16,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  macroLabel: { fontFamily: 'DM Sans', fontSize: 13, color: Colors.textTertiary },
  macroCalories: { fontFamily: 'DM Serif Display', fontSize: 24, color: Colors.textPrimary },
  macroValues: { flexDirection: 'row', gap: 16 },
  macroValue: { fontFamily: 'DM Sans', fontSize: 12, color: Colors.textTertiary, textAlign: 'center', lineHeight: 18 },
  // Empty state
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: { fontFamily: 'DM Serif Display', fontSize: 24, color: Colors.textPrimary, marginBottom: 8 },
  emptySubtitle: { fontFamily: 'DM Sans', fontSize: 15, color: Colors.textSecondary, textAlign: 'center', marginBottom: 32 },
  generateButton: { backgroundColor: Colors.accent, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 48 },
  generateButtonText: { fontFamily: 'DM Sans', fontSize: 16, fontWeight: '700', color: '#fff' },
});
