import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useMealStore } from '@/store/meal-store';
import { getRecipeById } from '@/lib/plan-generator';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites } = useMealStore();

  const favoriteRecipes = favorites
    .map((id) => getRecipeById(id))
    .filter(Boolean);

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
        <TouchableOpacity accessibilityLabel="Sort recipes" accessibilityRole="button">
          <Text style={styles.sortButton}>Sort by</Text>
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
