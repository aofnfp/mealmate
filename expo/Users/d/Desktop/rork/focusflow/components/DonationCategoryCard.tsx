import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "@/constants/colors";
import ProgressBar from "./ProgressBar";
import { space } from "../constants/tokens";

interface DonationCategoryCardProps {
  title: string;
  desc: string;
  project: string;
  progress: number;
  icon: string;
  selected: boolean;
  onPress: () => void;
}

export default function DonationCategoryCard({ 
  title, 
  desc, 
  project, 
  progress, 
  icon,
  selected,
  onPress 
}: DonationCategoryCardProps) {
  return (
    <TouchableOpacity 
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`${title} category. ${project}. ${Math.round(progress * 100)}% complete`}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{desc}</Text>
      <Text style={styles.project}>{project}</Text>
      <ProgressBar progress={progress} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: space.md,
    marginBottom: space.md,
    borderWidth: 2,
    borderColor: "#E7EBEF"
  },
  cardSelected: {
    borderColor: colors.primary
  },
  icon: {
    fontSize: 24,
    marginBottom: space.xs
  },
  title: {
    fontWeight: "800" as const,
    color: colors.textPrimary,
    marginBottom: 4
  },
  desc: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 6
  },
  project: {
    color: colors.primary,
    fontWeight: "700" as const,
    fontSize: 12,
    marginBottom: 8
  }
});