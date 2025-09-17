import React from "react";
import { View, Text, StyleSheet } from "react-native";
import HamburgerHeader from "@/components/HamburgerHeader";
import { colors } from "@/constants/colors";
import { useRouter } from 'expo-router';

export default function FriendsScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <HamburgerHeader title="Friends" />
      <View style={styles.content}>
        <Text style={styles.title}>Friends</Text>
        <Text style={styles.subtitle}>Connect and compete with friends</Text>
      </View>
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
    justifyContent: "center",
    alignItems: "center",
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