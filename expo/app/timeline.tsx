import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import HamburgerHeader from "@/components/HamburgerHeader";
import { colors } from "@/constants/colors";
export default function TimelineScreen() {
  return (
    <View style={styles.container}>
      <HamburgerHeader title="Timeline" />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Your Focus Timeline</Text>
        <Text style={styles.subtitle}>Track your progress over time</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});