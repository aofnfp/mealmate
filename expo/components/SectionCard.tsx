import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { components, typography, space, colors } from "@/constants/tokens";

interface SectionCardProps {
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
  noPadding?: boolean;
}

export default function SectionCard({ title, children, style, noPadding }: SectionCardProps) {
  return (
    <View style={[styles.card, noPadding && styles.noPadding, style]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...components.card,
    marginBottom: space.md,
  },
  noPadding: {
    padding: 0,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: space.sm,
  },
});