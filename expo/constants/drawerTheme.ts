import { colors } from "./colors";

export const drawerTheme = {
  bg: colors.drawerBg,                    // Light blue-gray background
  itemIcon: "rgba(44, 62, 80, 0.85)",    // Dark icons
  itemText: "rgba(44, 62, 80, 0.92)",    // Dark text
  itemTextDim: "rgba(44, 62, 80, 0.55)", // Dimmed dark text
  activeBg: "rgba(46, 134, 171, 0.12)",  // Blue tint for active
  activeIcon: colors.primary,
  activeText: colors.primary,
  divider: "rgba(44, 62, 80, 0.08)",
  badge: colors.error,                     // Red for notifications
} as const;