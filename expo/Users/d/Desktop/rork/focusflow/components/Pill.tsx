import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

interface PillProps {
  text: string;
  tone?: "info" | "neutral" | "success" | "selected";
  selected?: boolean;
}

export default function Pill({ text, tone = "info", selected = false }: PillProps) {
  const colorMap = {
    info: { bg: "#EAF4FA", fg: colors.primary },
    neutral: { bg: "#EDF0F3", fg: "#4B5B66" },
    success: { bg: "#E7F4EA", fg: "#2E7D32" },
    selected: { bg: colors.primary, fg: "white" }
  };
  
  const actualTone = selected ? "selected" : tone;
  const { bg, fg } = colorMap[actualTone] || colorMap.info;
  
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: fg }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12
  },
  text: {
    fontWeight: "700" as const,
    fontSize: 14
  }
});