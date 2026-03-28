import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";
import { radii, space, elevation } from "../constants/tokens";

interface StatCardProps {
  label: string;
  value: string;
  icon?: string;
}

export default function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <View style={styles.card}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: space.md,
    borderRadius: radii.sm,
    margin: space.xs,
    ...elevation.card
  },
  icon: {
    fontSize: 20,
    marginBottom: space.xs
  },
  value: { 
    fontSize: 18, 
    fontWeight: "700" as const, 
    color: colors.textPrimary 
  },
  label: { 
    marginTop: 4, 
    fontSize: 12, 
    color: colors.textSecondary 
  },
});