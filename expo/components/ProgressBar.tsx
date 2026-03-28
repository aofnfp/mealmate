import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

interface ProgressBarProps {
  progress?: number;
}

export default function ProgressBar({ progress = 0 }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(progress, 1));
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${pct * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 10,
    backgroundColor: "#E6E9EB",
    borderRadius: 8,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
});