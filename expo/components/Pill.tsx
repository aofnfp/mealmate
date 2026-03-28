import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { colors, components, typography } from "@/constants/tokens";
import { Icons } from "@/constants/icons";

interface PillProps {
  text: string;
  tone?: "info" | "neutral" | "success" | "warning" | "error";
  icon?: keyof typeof Icons;
  onPress?: () => void;
  size?: "small" | "medium";
}

export default function Pill({ text, tone = "info", icon, onPress, size = "small" }: PillProps) {
  const Icon = icon ? Icons[icon] : null;
  
  const colorMap = {
    info: { bg: "rgba(46, 134, 171, 0.1)", fg: colors.primary },
    neutral: { bg: colors.muted, fg: colors.textSecondary },
    success: { bg: "rgba(46, 125, 50, 0.1)", fg: colors.success },
    warning: { bg: "rgba(241, 143, 1, 0.1)", fg: colors.accent },
    error: { bg: "rgba(199, 62, 29, 0.1)", fg: colors.error },
  };
  
  const sizeMap = {
    small: {
      paddingHorizontal: components.chip.paddingHorizontal,
      paddingVertical: components.chip.paddingVertical,
      iconSize: 14,
    },
    medium: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      iconSize: 16,
    },
  };
  
  const { bg, fg } = colorMap[tone];
  const currentSize = sizeMap[size];
  
  const content = (
    <View style={[
      styles.pill, 
      { 
        backgroundColor: bg,
        paddingHorizontal: currentSize.paddingHorizontal,
        paddingVertical: currentSize.paddingVertical,
      }
    ]}>
      {Icon && (
        <Icon 
          size={currentSize.iconSize} 
          color={fg}
          strokeWidth={1.75}
          style={styles.icon}
        />
      )}
      <Text style={[
        size === "small" ? typography.pill : { ...typography.pill, fontSize: 15 },
        { color: fg }
      ]}>
        {text}
      </Text>
    </View>
  );
  
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }
  
  return content;
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: components.chip.borderRadius,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 6,
  },
});