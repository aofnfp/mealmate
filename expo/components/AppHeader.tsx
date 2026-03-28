import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, components, typography } from "@/constants/tokens";
import { Icons, iconColors } from "@/constants/icons";

interface AppHeaderProps {
  title: string;
  leftIcon?: keyof typeof Icons;
  rightIcon?: keyof typeof Icons;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  showPill?: boolean;
  pillText?: string;
}

export default function AppHeader({ 
  title, 
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  showPill,
  pillText
}: AppHeaderProps) {
  const LeftIcon = leftIcon ? Icons[leftIcon] : null;
  const RightIcon = rightIcon ? Icons[rightIcon] : null;
  
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.header}>
        {LeftIcon && (
          <TouchableOpacity 
            onPress={onLeftPress}
            style={styles.iconButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <LeftIcon 
              size={components.header.iconSize} 
              color={components.header.iconColor}
              strokeWidth={1.75}
            />
          </TouchableOpacity>
        )}
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
        
        {showPill && pillText ? (
          <View style={styles.pill}>
            <Text style={styles.pillText}>{pillText}</Text>
          </View>
        ) : RightIcon ? (
          <TouchableOpacity 
            onPress={onRightPress}
            style={styles.iconButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <RightIcon 
              size={components.header.iconSize} 
              color={components.header.iconColor}
              strokeWidth={1.75}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconButton} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: components.header.backgroundColor,
  },
  header: {
    height: components.header.height,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    ...typography.h2,
    color: components.header.titleColor,
  },
  pill: {
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillText: {
    ...typography.pill,
    color: "#FFFFFF",
  },
});