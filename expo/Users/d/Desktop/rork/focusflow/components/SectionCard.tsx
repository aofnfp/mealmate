import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { colors } from "@/constants/colors";
import { radii, space, elevation } from "../constants/tokens";

interface SectionCardProps {
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function SectionCard({ title, children, style }: SectionCardProps) {
  return (
    <View style={[styles.card, style]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: "#E7EBEF",
    padding: space.md,
    marginBottom: space.md,
    ...elevation.card
  },
  title: {
    fontWeight: "800" as const,
    color: colors.textPrimary,
    marginBottom: space.sm
  }
});