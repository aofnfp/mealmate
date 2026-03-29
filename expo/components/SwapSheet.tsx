import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { useMealStore } from '@/store/meal-store';
import { useUserStore } from '@/store/user-store';
import { getSwapAlternatives, getRecipeById } from '@/lib/plan-generator';
import { MealType, Recipe } from '@/types';

interface SwapSheetProps {
  visible: boolean;
  onClose: () => void;
  dayOfWeek: number;
  mealType: MealType;
  currentRecipeId: string;
}

const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

export default function SwapSheet({ visible, onClose, dayOfWeek, mealType, currentRecipeId }: SwapSheetProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { swapMeal } = useMealStore();
  const userProfile = useUserStore();

  const alternatives = useMemo(() => {
    return getSwapAlternatives(currentRecipeId, mealType, {
      dietType: userProfile.dietType,
      allergies: userProfile.allergies,
      calorieTarget: userProfile.calorieTarget,
      hasCompletedOnboarding: userProfile.hasCompletedOnboarding,
    });
  }, [currentRecipeId, mealType, userProfile.dietType, userProfile.allergies]);

  const handleSwap = () => {
    if (selectedId) {
      swapMeal(dayOfWeek, mealType, selectedId);
      setSelectedId(null);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedId(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose} accessibilityLabel="Close meal swap" accessibilityRole="button">
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()} accessibilityRole="none">
          {/* Handle */}
          <View style={styles.handle} />

          <Text style={styles.title}>Swap {MEAL_TYPE_LABELS[mealType]}</Text>
          <Text style={styles.subtitle}>
            Choose an alternative that matches your dietary profile
          </Text>

          <View style={styles.optionsList}>
            {alternatives.map((recipe) => {
              const isSelected = selectedId === recipe.id;
              return (
                <TouchableOpacity
                  key={recipe.id}
                  style={[styles.option, isSelected && styles.optionSelected]}
                  onPress={() => setSelectedId(recipe.id)}
                  activeOpacity={0.7}
                  accessibilityLabel={recipe.name}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                >
                  <View style={styles.optionThumb}>
                    <Text style={styles.optionEmoji}>
                      {recipe.mealType === 'breakfast' ? '🍳' : recipe.mealType === 'lunch' ? '🥗' : '🍽️'}
                    </Text>
                  </View>
                  <View style={styles.optionContent}>
                    <Text style={styles.optionName} numberOfLines={2}>{recipe.name}</Text>
                    <Text style={styles.optionMeta}>
                      {recipe.calories} cal · {recipe.totalTimeMinutes} min · {DIFFICULTY_LABELS[recipe.difficulty]}
                    </Text>
                  </View>
                  <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={[styles.swapButton, !selectedId && styles.swapButtonDisabled]}
            onPress={handleSwap}
            disabled={!selectedId}
            accessibilityLabel="Swap meal"
            accessibilityRole="button"
            accessibilityState={{ disabled: !selectedId }}
          >
            <Text style={styles.swapButtonText}>Swap Meal</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'DM Serif Display',
    fontSize: 24,
    letterSpacing: -0.48,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'DM Sans',
    fontSize: 14,
    color: Colors.textTertiary,
    marginBottom: 20,
  },
  optionsList: {
    gap: 10,
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  optionSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentLight,
  },
  optionThumb: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionEmoji: { fontSize: 22 },
  optionContent: { flex: 1 },
  optionName: {
    fontFamily: 'DM Sans',
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  optionMeta: {
    fontFamily: 'DM Sans',
    fontSize: 13,
    color: Colors.textTertiary,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  radioOuterSelected: {
    borderColor: Colors.accent,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.accent,
  },
  swapButton: {
    backgroundColor: Colors.accent,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  swapButtonDisabled: {
    opacity: 0.5,
  },
  swapButtonText: {
    fontFamily: 'DM Sans',
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
