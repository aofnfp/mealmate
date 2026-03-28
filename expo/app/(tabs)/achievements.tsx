import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { useFocusFlow } from "@/store/focusflow-context";

const CATEGORIES = [
  { title: "Builder Badges", items: ["First Tower", "City Planner", "Architect", "Master Builder"] },
  { title: "Focus Streaks", items: ["3 Day Streak", "Week Warrior", "Month Master", "Year Champion"] },
  { title: "Impact Awards", items: ["First Donation", "Generous Giver", "Change Maker", "World Changer"] },
];

export default function AchievementsScreen() {
  const { userProfile } = useFocusFlow();
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={styles.title}>Achievements</Text>
      <Text style={typography.subtitle}>Collect badges as your city grows</Text>

      {CATEGORIES.map((cat) => (
        <View key={cat.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{cat.title}</Text>
          <View style={styles.badgeGrid}>
            {cat.items.map((b) => (
              <View key={b} style={styles.badge}>
                <View style={styles.medal} />
                <Text style={styles.badgeText}>{b}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.metrics}>
        <Text style={styles.metricsTitle}>Your Progress</Text>
        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{userProfile?.lifetimeSessions || 124}</Text>
            <Text style={styles.metricLabel}>Total Sessions</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{Math.floor((userProfile?.totalFocusTime || 136800) / 3600)}h</Text>
            <Text style={styles.metricLabel}>Focus Hours</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{(userProfile?.totalEnergy || 2480).toLocaleString()}</Text>
            <Text style={styles.metricLabel}>Energy Earned</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>${((userProfile?.totalDonated || 1820) / 100).toFixed(2)}</Text>
            <Text style={styles.metricLabel}>Energy Donated</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background, 
    padding: 16 
  },
  title: { 
    fontSize: 22, 
    fontWeight: "800" as const, 
    color: colors.textPrimary, 
    marginBottom: 4 
  },
  section: { 
    marginTop: 14 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: "700" as const, 
    color: colors.textPrimary, 
    marginBottom: 8 
  },
  badgeGrid: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "space-between" 
  },
  badge: {
    width: "48%",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EEF2F5",
  },
  medal: { 
    height: 64, 
    borderRadius: 64, 
    backgroundColor: "#F4E7B3", 
    marginBottom: 10 
  },
  badgeText: { 
    color: colors.textPrimary, 
    fontWeight: "700" as const 
  },
  metrics: { 
    backgroundColor: colors.surface, 
    borderRadius: 12, 
    padding: 12, 
    marginTop: 8 
  },
  metricsTitle: { 
    fontWeight: "800" as const, 
    color: colors.textPrimary, 
    marginBottom: 8 
  },
  metricsRow: { 
    flexDirection: "row", 
    flexWrap: "wrap" 
  },
  metric: { 
    width: "50%", 
    padding: 6 
  },
  metricValue: { 
    fontSize: 18, 
    fontWeight: "800" as const, 
    color: colors.textPrimary 
  },
  metricLabel: { 
    color: colors.textSecondary, 
    marginTop: 2 
  },
});