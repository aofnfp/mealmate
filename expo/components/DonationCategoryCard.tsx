import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";
import ProgressBar from "@/components/ProgressBar";

interface DonationCategoryCardProps {
  title: string;
  desc: string;
  project: string;
  progress: number;
  selected?: boolean;
}

export default function DonationCategoryCard({ 
  title, 
  desc, 
  project, 
  progress, 
  selected = false 
}: DonationCategoryCardProps) {
  return (
    <View style={[
      styles.card,
      selected && styles.cardSelected
    ]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{desc}</Text>
      <Text style={styles.project}>{project}</Text>
      <ProgressBar progress={progress} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#E7EBEF",
  },
  cardSelected: {
    borderColor: colors.primary,
  },
  title: {
    fontWeight: "800" as const,
    color: colors.textPrimary,
    marginBottom: 4,
    fontSize: 16,
  },
  desc: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 6,
  },
  project: {
    color: colors.primary,
    fontWeight: "700" as const,
    fontSize: 12,
    marginBottom: 8,
  },
});