import React, { useState, useMemo } from 'react';
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
import { Colors } from '@/constants/colors';
import { useMealStore } from '@/store/meal-store';
import { getRecipeById } from '@/lib/plan-generator';
import { Recipe } from '@/types';

type SortMode = 'name' | 'calories' | 'time';

const SORT_LABELS: Record<SortMode, string> = {
  name: 'A–Z',
  calories: 'Calories',
  time: 'Cook Time',
};

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites } = useMealStore();
  const [sortMode, setSortMode] = useState<SortMode>('name');

  const favoriteRecipes = useMemo(() => {
    const recipes = favorites.map((id) => getRecipeById(id)).filter(Boolean) as Recipe[];
    return recipes.sort((a, b) => {
      if (sortMode === 'calories') return a.calories - b.calories;
      if (sortMode === 'time') return a.totalTimeMinutes - b.totalTimeMinutes;
      return a.name.localeCompare(b.name);
    });
  }, [favorites, sortMode]);

  if (favoriteRecipes.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Favorites</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap the heart icon on any recipe to save it here.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Sort By',
              undefined,
              (['name', 'calories', 'time'] as SortMode[]).map((mode) => ({
                text: `${SORT_LABELS[mode]}${sortMode === mode ? ' ✓' : ''}`,
                onPress: () => setSortMode(mode),
              }))
            );
          }}
          accessibilityLabel={`Sort recipes, current: ${SORT_LABELS[sortMode]}`}
          accessibilityRole="button"
        >
          <Text style={styles.sortButton}>{SORT_LABELS[sortMode]}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
        {favoriteRecipes.map((recipe) => {
          if (!recipe) return null;
          return (
            <TouchableOpacity
              key={recipe.id}
              style={styles.card}
              onPress={() => router.push(`/recipe/${recipe.id}`)}
              activeOpacity={0.7}
              accessibilityLabel={recipe.name}
              accessibilityRole="button"
              accessibilityHint="View recipe details"
            >
              <View style={styles.cardImage}>
                <Text style={styles.cardEmoji}>
                  {recipe.mealType === 'breakfast' ? '🍳' : recipe.mealType === 'lunch' ? '🥗' : '🍽️'}
                </Text>
              </View>
              <Text style={styles.cardTitle} numberOfLines={2}>{recipe.name}</Text>
              <Text style={styles.cardMeta}>{recipe.calories} cal · {recipe.totalTimeMinutes} min</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16,
  },
  title: { fontFamily: 'DM Serif Display', fontSize: 28, letterSpacing: -0.56, color: Colors.textPrimary },
  sortButton: { fontFamily: 'DM Sans', fontSize: 14, color: Colors.textSecondary },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12,
  },
  card: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardImage: {
    height: 120, backgroundColor: Colors.accentLight, alignItems: 'center', justifyContent: 'center',
  },
  cardEmoji: { fontSize: 40 },
  cardTitle: {
    fontFamily: 'DM Sans', fontSize: 14, fontWeight: '600', color: Colors.textPrimary,
    paddingHorizontal: 12, paddingTop: 10, marginBottom: 4,
  },
  cardMeta: {
    fontFamily: 'DM Sans', fontSize: 12, color: Colors.textTertiary,
    paddingHorizontal: 12, paddingBottom: 12,
  },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: { fontFamily: 'DM Serif Display', fontSize: 24, color: Colors.textPrimary, marginBottom: 8 },
  emptySubtitle: { fontFamily: 'DM Sans', fontSize: 15, color: Colors.textSecondary, textAlign: 'center' },
});
