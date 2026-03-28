import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Menu } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useNavigation } from "expo-router";

interface HamburgerHeaderProps {
  title: string;
}

export default function HamburgerHeader({ title }: HamburgerHeaderProps) {
  const navigation = useNavigation();
  
  const handleOpenDrawer = () => {
    try {
      // For Expo Router with drawer, we can use the navigation dispatch
      if (navigation && 'dispatch' in navigation) {
        // Import DrawerActions dynamically to avoid conflicts
        import('@react-navigation/native').then(({ DrawerActions }) => {
          navigation.dispatch(DrawerActions.openDrawer());
        }).catch(() => {
          console.log('DrawerActions not available');
        });
      } else {
        console.log('Drawer navigation not available');
      }
    } catch (error) {
      console.log('Drawer navigation not available', error);
    }
  };
  
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleOpenDrawer}
          style={styles.menuButton}
          accessibilityLabel="Open menu"
        >
          <Menu size={24} color={colors.white} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  menuButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "600" as const,
    letterSpacing: 0.5,
  },
});