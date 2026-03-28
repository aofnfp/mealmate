import React from "react";
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ViewStyle, View } from "react-native";
import { colors, components, typography, elevation } from "@/constants/tokens";
import { Icons, iconColors, iconSizes } from "@/constants/icons";
import type { LucideIcon } from "lucide-react-native";

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: "primary" | "secondary" | "tertiary";
  size?: "large" | "medium" | "small";
  icon?: keyof typeof Icons;
  iconPosition?: "left" | "right";
  style?: ViewStyle;
}

export default function Button({ 
  label, 
  variant = "primary", 
  size = "large",
  icon,
  iconPosition = "left",
  style, 
  ...props 
}: ButtonProps) {
  const Icon = icon ? Icons[icon] : null;
  
  const variantStyles = {
    primary: {
      backgroundColor: colors.primary,
      textColor: '#FFFFFF',
    },
    secondary: {
      backgroundColor: colors.secondary,
      textColor: '#FFFFFF',
    },
    tertiary: {
      backgroundColor: colors.muted,
      textColor: colors.textPrimary,
    },
  };
  
  const sizeStyles = {
    large: {
      height: components.buttonPrimary.height,
      paddingHorizontal: 24,
      textStyle: typography.button,
      iconSize: iconSizes.m,
    },
    medium: {
      height: components.buttonSecondary.height,
      paddingHorizontal: 20,
      textStyle: { ...typography.button, fontSize: 16 },
      iconSize: iconSizes.m,
    },
    small: {
      height: 36,
      paddingHorizontal: 16,
      textStyle: { ...typography.body, fontWeight: '600' as const },
      iconSize: iconSizes.s,
    },
  };
  
  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];
  
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.button,
        { 
          backgroundColor: currentVariant.backgroundColor,
          height: currentSize.height,
          paddingHorizontal: currentSize.paddingHorizontal,
        },
        variant === "primary" && elevation.sm,
        style
      ]}
      {...props}
    >
      <View style={styles.content}>
        {Icon && iconPosition === "left" && (
          <Icon 
            size={currentSize.iconSize} 
            color={currentVariant.textColor}
            strokeWidth={1.75}
            style={styles.iconLeft}
          />
        )}
        <Text style={[
          currentSize.textStyle,
          { color: currentVariant.textColor }
        ]}>
          {label}
        </Text>
        {Icon && iconPosition === "right" && (
          <Icon 
            size={currentSize.iconSize} 
            color={currentVariant.textColor}
            strokeWidth={1.75}
            style={styles.iconRight}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: components.buttonPrimary.borderRadius,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});