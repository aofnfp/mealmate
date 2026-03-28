import { Platform } from 'react-native';

// Typefaces
export const typefaces = {
  primary: Platform.select({
    ios: 'SF Pro Text',
    android: 'Roboto',
    default: 'System',
  }) as string,
  numeral: Platform.select({
    ios: 'SF Pro Text',
    android: 'Roboto',
    default: 'System',
  }) as string,
};

// Typography Scale
export const typography = {
  displayTimer: {
    fontSize: 56,
    fontWeight: '800' as const,
    lineHeight: 64,
    letterSpacing: 0,
    fontFamily: typefaces.numeral,
  },
  h1: {
    fontSize: 22,
    fontWeight: '800' as const,
    lineHeight: 28,
    letterSpacing: 0.1,
    fontFamily: typefaces.primary,
  },
  h2: {
    fontSize: 18,
    fontWeight: '700' as const,
    lineHeight: 24,
    letterSpacing: 0.1,
    fontFamily: typefaces.primary,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: 0,
    fontFamily: typefaces.primary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0.1,
    fontFamily: typefaces.primary,
  },
  pill: {
    fontSize: 14,
    fontWeight: '700' as const,
    lineHeight: 18,
    letterSpacing: 0,
    fontFamily: typefaces.primary,
  },
  button: {
    fontSize: 18,
    fontWeight: '700' as const,
    lineHeight: 22,
    letterSpacing: 0,
    fontFamily: typefaces.primary,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800' as const,
    lineHeight: 22,
    letterSpacing: 0,
    fontFamily: typefaces.numeral,
  },
};

// Colors
export const colors = {
  primary: '#2E86AB',
  secondary: '#A23B72',
  accent: '#F18F01',
  success: '#2E7D32',
  error: '#C73E1D',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  textPrimary: 'rgba(44, 62, 80, 0.98)',
  textSecondary: 'rgba(44, 62, 80, 0.65)',
  textTertiary: 'rgba(44, 62, 80, 0.45)',
  border: '#E7EBEF',
  outline: '#E7EBEF',
  muted: '#EDF0F3',
};

// Spacing
export const space = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
};

// Border Radius
export const radii = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  pill: 999,
};

// Touch
export const touch = {
  minTarget: 44,
};

// Iconography
export const iconography = {
  strokeWidth: 1.75,
  sizes: {
    s: 16,
    m: 20,
    l: 24,
    xl: 28,
  },
  colors: {
    default: 'rgba(44, 62, 80, 0.85)',
    active: '#2E86AB',
    muted: 'rgba(44, 62, 80, 0.55)',
    white: '#FFFFFF',
  },
  padding: 6,
  hitSlop: 8,
};

// Shadows/Elevation
export const elevation = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Component Defaults
export const components = {
  header: {
    height: 56,
    backgroundColor: colors.primary,
    titleColor: '#FFFFFF',
    iconColor: '#FFFFFF',
    iconSize: iconography.sizes.m,
  },
  buttonPrimary: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: radii.sm,
    textStyle: typography.button,
  },
  buttonSecondary: {
    height: 44,
    backgroundColor: colors.secondary,
    borderRadius: radii.sm,
    textStyle: typography.button,
  },
  buttonTertiary: {
    height: 44,
    backgroundColor: colors.muted,
    borderRadius: radii.sm,
    textStyle: typography.h2,
    textColor: colors.textPrimary,
  },
  chip: {
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    textStyle: typography.pill,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderColor: colors.outline,
    borderWidth: 1,
    padding: space.lg,
    ...elevation.card,
  },
  listItem: {
    height: 52,
    titleStyle: typography.body,
    subtitleStyle: typography.caption,
    iconSize: iconography.sizes.m,
    dividerColor: 'rgba(44, 62, 80, 0.08)',
  },
  progressRing: {
    strokeWidth: 14,
    trackColor: colors.outline,
    progressColor: colors.primary,
    strokeLinecap: 'round' as const,
  },
};