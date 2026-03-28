import { Theme } from '@/types';

export const THEMES: Theme[] = [
  {
    id: 'calm_slate',
    name: 'Calm Slate',
    colors: {
      primary: '#4A6FA5',
      onPrimary: '#FFFFFF',
      secondary: '#3B5998',
      onSecondary: '#FFFFFF',
      background: '#F5F6F8',
      surface: '#FFFFFF',
      textPrimary: '#1A1A2E',
      textSecondary: '#6B7280',
      accent: '#E07A5F',
      success: '#16A34A',
      warning: '#D97706',
      danger: '#DC2626',
      outline: '#E5E7EB',
    },
  },
  {
    id: 'warm_earth',
    name: 'Warm Earth',
    colors: {
      primary: '#8B6F47',
      onPrimary: '#FFFFFF',
      secondary: '#6B4F3A',
      onSecondary: '#FFFFFF',
      background: '#FAF8F5',
      surface: '#FFFFFF',
      textPrimary: '#2D241C',
      textSecondary: '#7A6B5D',
      accent: '#BC6C25',
      success: '#16A34A',
      warning: '#D97706',
      danger: '#B91C1C',
      outline: '#EDE2D6',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: {
      primary: '#3D6B4F',
      onPrimary: '#FFFFFF',
      secondary: '#2A5039',
      onSecondary: '#FFFFFF',
      background: '#F4F8F5',
      surface: '#FFFFFF',
      textPrimary: '#1A2E20',
      textSecondary: '#506757',
      accent: '#DDA15E',
      success: '#2FA36B',
      warning: '#D97706',
      danger: '#B33939',
      outline: '#DDE8E0',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    colors: {
      primary: '#6B8ACA',
      onPrimary: '#FFFFFF',
      secondary: '#4A6FA5',
      onSecondary: '#FFFFFF',
      background: '#0F1117',
      surface: '#1A1D27',
      textPrimary: '#E5E7EB',
      textSecondary: '#9CA3AF',
      accent: '#E07A5F',
      success: '#34D399',
      warning: '#FBBF24',
      danger: '#F87171',
      outline: '#2D3140',
    },
  },
];

export const DEFAULT_THEME_ID = 'calm_slate';

export function getThemeById(id: string): Theme {
  return THEMES.find(t => t.id === id) || THEMES[0];
}
