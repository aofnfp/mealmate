import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const typography = StyleSheet.create({
  timer: { 
    fontSize: 36, 
    fontWeight: "bold" as const, 
    color: colors.textPrimary 
  },
  label: { 
    fontSize: 18, 
    fontWeight: "600" as const, 
    color: colors.textPrimary 
  },
  subtitle: { 
    fontSize: 16, 
    fontWeight: "500" as const, 
    color: colors.textSecondary 
  },
  body: { 
    fontSize: 14, 
    fontWeight: "400" as const, 
    color: colors.textPrimary 
  },
});