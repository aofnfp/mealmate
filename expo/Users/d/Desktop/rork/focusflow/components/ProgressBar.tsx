import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

interface ProgressBarProps {
  progress: number;
  height?: number;
}

export default function ProgressBar({ progress, height = 8 }: ProgressBarProps) {
  const percentage = Math.max(0, Math.min(progress, 1));

  return (
    <View style={[styles.track, { height }]}>
      <View style={[styles.fill, { width: `${percentage * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
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