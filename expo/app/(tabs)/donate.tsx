import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import ProgressBar from "@/components/ProgressBar";
import { useFocusFlow } from "@/store/focusflow-context";

const CATEGORIES = [
  { id: "education", title: "Education", desc: "Build schools and support learning", icon: "🎓", project: "School in Kenya", progress: 0.42 },
  { id: "environment", title: "Environment", desc: "Plant trees and protect nature", icon: "🌳", project: "Reforestation in Brazil", progress: 0.66 },
  { id: "health", title: "Health", desc: "Support medical research and care", icon: "🏥", project: "Clean Water Wells", progress: 0.28 },
];

export default function DonationScreen() {
  const { userProfile } = useFocusFlow();
  const [energy] = useState(userProfile?.totalEnergy || 1240);
  const [selected, setSelected] = useState("education");

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={styles.title}>Focus for Good</Text>
      <Text style={typography.subtitle}>Use your focus energy to support real causes</Text>

      <View style={styles.balance}>
        <Text style={styles.balanceLabel}>Available Focus Energy</Text>
        <Text style={styles.balanceValue}>{energy.toLocaleString()} ⚡</Text>
      </View>

      <Text style={styles.sectionTitle}>Categories</Text>
      <View style={styles.grid}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity key={c.id} onPress={() => setSelected(c.id)} style={[styles.card, selected === c.id && styles.cardSelected]}>
            <Text style={styles.icon}>{c.icon}</Text>
            <Text style={styles.cardTitle}>{c.title}</Text>
            <Text style={styles.cardDesc}>{c.desc}</Text>
            <Text style={styles.project}>{c.project}</Text>
            <ProgressBar progress={c.progress} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.convert}>
        <Text style={styles.convertText}>Conversion: 10 energy = $0.01</Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={[styles.cta, { backgroundColor: colors.accent }]}>
          <Text style={styles.ctaText}>Donate 100 ⚡ ($0.10)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.cta, { backgroundColor: colors.primary }]}>
          <Text style={styles.ctaText}>Donate 500 ⚡ ($0.50)</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 18 }}>
        <TouchableOpacity style={[styles.cta, { backgroundColor: colors.secondary }]}>
          <Text style={styles.ctaText}>Custom Amount…</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 24 }}>
        <Text style={styles.sectionTitle}>Impact Stories</Text>
        <View style={styles.story}>
          <Text style={styles.storyTitle}>Kenya School Foundation Reached 40%</Text>
          <Text style={styles.storyBody}>Your sessions helped fund 120 desks and 4 classrooms. Next milestone: library setup.</Text>
        </View>
        <View style={styles.story}>
          <Text style={styles.storyTitle}>Amazon Reforestation Hit 10k Trees</Text>
          <Text style={styles.storyBody}>Collective FocusFlow donors crossed 10,000 trees planted this month.</Text>
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
  balance: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 16,
  },
  balanceLabel: { 
    color: colors.textSecondary, 
    marginBottom: 6 
  },
  balanceValue: { 
    fontSize: 24, 
    fontWeight: "800" as const, 
    color: colors.textPrimary 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: "700" as const, 
    color: colors.textPrimary, 
    marginVertical: 10 
  },
  grid: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "space-between" 
  },
  card: {
    width: "48%",
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EEF2F5",
  },
  cardSelected: { 
    borderColor: colors.primary 
  },
  icon: { 
    fontSize: 24, 
    marginBottom: 6 
  },
  cardTitle: { 
    fontWeight: "700" as const, 
    color: colors.textPrimary 
  },
  cardDesc: { 
    fontSize: 12, 
    color: colors.textSecondary, 
    marginVertical: 6 
  },
  project: { 
    fontSize: 12, 
    color: colors.primary, 
    marginBottom: 8, 
    fontWeight: "600" as const 
  },
  convert: {
    backgroundColor: "#FFF6E9",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFE6C2",
    marginTop: 6,
  },
  convertText: { 
    color: colors.accent, 
    fontWeight: "700" as const 
  },
  actionsRow: { 
    flexDirection: "row", 
    marginTop: 16 
  },
  cta: { 
    flex: 1, 
    padding: 14, 
    borderRadius: 12, 
    marginHorizontal: 4 
  },
  ctaText: { 
    color: "white", 
    textAlign: "center", 
    fontWeight: "700" as const 
  },
  story: { 
    backgroundColor: colors.surface, 
    padding: 12, 
    borderRadius: 12, 
    marginTop: 8 
  },
  storyTitle: { 
    fontWeight: "700" as const, 
    color: colors.textPrimary 
  },
  storyBody: { 
    marginTop: 6, 
    color: colors.textSecondary 
  },
});