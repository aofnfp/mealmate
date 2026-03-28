import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TouchableOpacityProps } from "react-native";
import { colors } from "@/constants/colors";
import { radii } from "../constants/tokens";

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  tone?: "primary" | "secondary" | "accent" | "danger";
  style?: ViewStyle;
}

export default function Button({ label, tone = "primary", style, ...props }: ButtonProps) {
  const backgroundColors = {
    primary: colors.primary,
    secondary: colors.secondary,
    accent: colors.accent,
    danger: colors.error
  };
  
  const bg = backgroundColors[tone];
  
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.button, { backgroundColor: bg }, style]}
      accessibilityRole="button"
      accessibilityLabel={label}
      {...props}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16
  },
  label: {
    color: "white",
    fontWeight: "700" as const,
    fontSize: 16
  }
});