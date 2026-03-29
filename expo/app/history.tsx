import React, { useMemo } from 'react';
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
import { MealPlan } from '@/types';

export default function HistoryScreen() {
  const router = useRouter();
  const { planHistory } = useMealStore();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} accessibilityLabel="Go back" accessibilityRole="button">
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plan History</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {planHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No history yet</Text>
            <Text style={styles.emptySubtitle}>
              Your past meal plans will appear here after you generate a new one.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {planHistory.map((plan, index) => (
              <PlanCard key={plan.id} plan={plan} isCurrent={index === 0} />
            ))}
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function PlanCard({ plan, isCurrent }: { plan: MealPlan; isCurrent: boolean }) {
  const router = useRouter();

  const summary = useMemo(() => {
    let totalCalories = 0;
    let recipeCount = 0;
    const uniqueRecipes = new Set<string>();

    plan.items.forEach((item) => {
      const recipe = getRecipeById(item.recipeId);
      if (recipe) {
        totalCalories += recipe.calories;
        uniqueRecipes.add(recipe.id);
      }
      recipeCount++;
    });

    return {
      totalCalories,
      mealsPerDay: Math.round(recipeCount / 7),
      uniqueRecipes: uniqueRecipes.size,
      avgDaily: Math.round(totalCalories / 7),
    };
  }, [plan]);

  const weekLabel = useMemo(() => {
    const start = new Date(plan.weekStartDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    const fmt = (d: Date) =>
      d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${fmt(start)} – ${fmt(end)}`;
  }, [plan.weekStartDate]);

  const createdLabel = useMemo(() => {
    const d = new Date(plan.createdAt);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }, [plan.createdAt]);

  // Show a sample of 3 recipe names
  const sampleRecipes = useMemo(() => {
    const seen = new Set<string>();
    const names: string[] = [];
    for (const item of plan.items) {
      if (names.length >= 3) break;
      if (seen.has(item.recipeId)) continue;
      seen.add(item.recipeId);
      const recipe = getRecipeById(item.recipeId);
      if (recipe) names.push(recipe.name);
    }
    return names;
  }, [plan]);

  return (
    <View style={[styles.card, isCurrent && styles.cardCurrent]}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardWeek}>{weekLabel}</Text>
          {isCurrent && <Text style={styles.currentBadge}>CURRENT</Text>}
        </View>
        <Text style={styles.cardCreated}>{createdLabel}</Text>
      </View>

      {/* Stats */}
      <View style={styles.cardStats}>
        <View style={styles.cardStat}>
          <Text style={styles.cardStatValue}>{summary.avgDaily.toLocaleString()}</Text>
          <Text style={styles.cardStatLabel}>cal/day</Text>
        </View>
        <View style={styles.cardStatDivider} />
        <View style={styles.cardStat}>
          <Text style={styles.cardStatValue}>{summary.uniqueRecipes}</Text>
          <Text style={styles.cardStatLabel}>recipes</Text>
        </View>
        <View style={styles.cardStatDivider} />
        <View style={styles.cardStat}>
          <Text style={styles.cardStatValue}>{summary.mealsPerDay}</Text>
          <Text style={styles.cardStatLabel}>meals/day</Text>
        </View>
      </View>

      {/* Sample recipes */}
      <View style={styles.sampleRecipes}>
        {sampleRecipes.map((name, i) => (
          <Text key={i} style={styles.sampleRecipe} numberOfLines={1}>
            {name}
          </Text>
        ))}
        {summary.uniqueRecipes > 3 && (
          <Text style={styles.sampleMore}>
            +{summary.uniqueRecipes - 3} more
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 8,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  headerTitle: {
    fontFamily: 'DM Serif Display', fontSize: 20, color: Colors.textPrimary,
  },
  // Empty
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 60 },
  emptyTitle: {
    fontFamily: 'DM Serif Display', fontSize: 22, color: Colors.textPrimary, marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'DM Sans', fontSize: 15, color: Colors.textSecondary, textAlign: 'center',
  },
  // List
  list: { paddingHorizontal: 20, gap: 14, paddingTop: 8 },
  // Card
  card: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: Colors.border,
  },
  cardCurrent: { borderColor: Colors.accent },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: 14,
  },
  cardWeek: {
    fontFamily: 'DM Sans', fontSize: 16, fontWeight: '700', color: Colors.textPrimary,
  },
  currentBadge: {
    fontFamily: 'DM Sans', fontSize: 10, fontWeight: '700', letterSpacing: 0.6,
    color: Colors.accent, marginTop: 2,
  },
  cardCreated: {
    fontFamily: 'DM Sans', fontSize: 12, color: Colors.textTertiary,
  },
  // Stats
  cardStats: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background,
    borderRadius: 10, padding: 12, marginBottom: 14,
  },
  cardStat: { flex: 1, alignItems: 'center' },
  cardStatValue: {
    fontFamily: 'DM Sans', fontSize: 18, fontWeight: '700', color: Colors.textPrimary,
  },
  cardStatLabel: {
    fontFamily: 'DM Sans', fontSize: 11, color: Colors.textTertiary, marginTop: 1,
  },
  cardStatDivider: { width: 1, height: 24, backgroundColor: Colors.border },
  // Sample recipes
  sampleRecipes: { gap: 4 },
  sampleRecipe: {
    fontFamily: 'DM Sans', fontSize: 13, color: Colors.textSecondary,
  },
  sampleMore: {
    fontFamily: 'DM Sans', fontSize: 12, fontWeight: '600', color: Colors.accent, marginTop: 2,
  },
});
