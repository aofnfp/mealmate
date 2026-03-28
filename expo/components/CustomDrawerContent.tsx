import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
  Building2, 
  Trophy, 
  Clock3, 
  Tag, 
  Users, 
  Award, 
  ShoppingBag, 
  Heart,
  Newspaper, 
  Settings,
  Circle
} from "lucide-react-native";
import { useTheme } from "@/store/theme-context";
import { router, usePathname } from "expo-router";
import { DrawerContentComponentProps } from '@react-navigation/drawer';

interface DrawerItem {
  label: string;
  icon: (color: string) => React.ReactNode;
  route: string;
  tabName?: string;
  badge?: string;
}

const ITEMS: DrawerItem[] = [
  { label: "City Builder", icon: (color) => <Building2 size={18} color={color} strokeWidth={1.5} />, route: "(tabs)", tabName: "index" },
  { label: "Focus Challenge", icon: (color) => <Trophy size={18} color={color} strokeWidth={1.5} />, route: "challenge" },
  { label: "Timeline", icon: (color) => <Clock3 size={18} color={color} strokeWidth={1.5} />, route: "timeline" },
  { label: "Tags", icon: (color) => <Tag size={18} color={color} strokeWidth={1.5} />, route: "tags" },
  { label: "Friends", icon: (color) => <Users size={18} color={color} strokeWidth={1.5} />, route: "friends" },
  { label: "Achievements", icon: (color) => <Award size={18} color={color} strokeWidth={1.5} />, route: "(tabs)", tabName: "achievements" },
  { label: "Store", icon: (color) => <ShoppingBag size={18} color={color} strokeWidth={1.5} />, route: "store" },
  { label: "Impact Forest", icon: (color) => <Heart size={18} color={color} strokeWidth={1.5} />, route: "(tabs)", tabName: "donate" },
  { label: "News", icon: (color) => <Newspaper size={18} color={color} strokeWidth={1.5} />, route: "news", badge: "•" },
  { label: "Settings", icon: (color) => <Settings size={18} color={color} strokeWidth={1.5} />, route: "(tabs)", tabName: "settings" },
];

interface CustomDrawerContentProps extends DrawerContentComponentProps {
  onNavigate?: () => void;
}

export default function CustomDrawerContent(props: CustomDrawerContentProps) {
  const { onNavigate, navigation } = props;
  const { colors } = useTheme();
  const pathname = usePathname();

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Items */}
        <View style={styles.itemsContainer}>
          {ITEMS.map((item) => {
            // Check if this item is active based on pathname
            let isActive = false;
            if (item.tabName) {
              // For tab items, check if the specific tab is active
              isActive = pathname.includes(`/${item.tabName}`) || (item.tabName === 'index' && pathname === '/');
            } else if (item.route === '(tabs)') {
              // For default tab (City Builder)
              isActive = pathname === '/' || pathname === '/index';
            } else {
              // For non-tab routes
              isActive = pathname.includes(`/${item.route}`);
            }
            const color = isActive ? colors.primary : colors.textSecondary;
            return (
              <TouchableOpacity
                key={item.label}
                onPress={() => {
                  if (item.tabName) {
                    // Navigate to specific tab within (tabs) route
                    router.push(`/(tabs)/${item.tabName}`);
                  } else if (item.route === '(tabs)') {
                    // Navigate to the default tab (index)
                    router.push('/');
                  } else {
                    router.push(`/${item.route}`);
                  }
                  // Close the drawer after navigation
                  navigation?.closeDrawer?.();
                  onNavigate?.();
                }}
                activeOpacity={0.8}
                style={[
                  styles.item, 
                  isActive && { 
                    backgroundColor: `${colors.primary}14`,
                    borderWidth: 1,
                    borderColor: colors.primary,
                  },
                  !isActive && {
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.outline,
                  }
                ]}
                accessibilityLabel={`Navigate to ${item.label}`}
              >
                <View style={styles.row}>
                  <View style={styles.iconContainer}>
                    {item.icon(color)}
                  </View>
                  <Text style={[
                    styles.itemLabel, 
                    { color: isActive ? colors.primary : colors.textPrimary }
                  ]}>
                    {item.label}
                  </Text>
                </View>
                {!!item.badge && <View style={[styles.badge, { backgroundColor: colors.danger }]} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer brand */}
      <View style={[styles.footer, { borderTopColor: colors.outline }]}>
        <Circle size={18} color={colors.textSecondary} strokeWidth={2} />
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>AOFTech</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#004D40',
  },
  scrollContent: {
    paddingVertical: 20,
  },
  itemsContainer: {
    paddingHorizontal: 16,
    marginTop: 0,
  },

  item: {
    height: 56,
    minHeight: 56,
    maxHeight: 56,
    borderRadius: 14,
    paddingHorizontal: 16,
    marginVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },

  row: { 
    flex: 1,
    flexDirection: "row", 
    alignItems: "center", 
    gap: 12,
    height: "100%",
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  itemLabel: { 
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "600" as const,
    includeFontPadding: false,
  },

  badge: { 
    position: "absolute" as const,
    right: 16,
    top: "50%" as const,
    marginTop: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "transparent",
  },

  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  footerText: { 
    fontWeight: "600" as const,
    fontSize: 15,
    letterSpacing: 0.5,
  },
});