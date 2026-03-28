import { Theme } from '@/types';

interface ThemeMeta {
  is_dark: boolean;
}

export interface ThemeWithMeta extends Theme {
  meta?: ThemeMeta;
}

export const THEMES: ThemeWithMeta[] = [
  {
    id: 'modern_teal',
    name: 'Modern Teal',
    meta: { is_dark: false },
    colors: {
      primary: '#2E86AB',
      onPrimary: '#FFFFFF',
      secondary: '#1E5F78',
      onSecondary: '#FFFFFF',
      background: '#F7F9FB',
      surface: '#FFFFFF',
      textPrimary: '#111827',
      textSecondary: '#6B7280',
      accent: '#F18F01',
      success: '#16A34A',
      warning: '#F59E0B',
      danger: '#DC2626',
      outline: '#E5E7EB'
    }
  },
  {
    id: 'forest_green',
    name: 'Forest Green',
    meta: { is_dark: false },
    colors: {
      primary: '#2E8B57',
      onPrimary: '#FFFFFF',
      secondary: '#1F6C45',
      onSecondary: '#FFFFFF',
      background: '#F1FBF5',
      surface: '#FFFFFF',
      textPrimary: '#10271C',
      textSecondary: '#476458',
      accent: '#C3E88D',
      success: '#2E8B57',
      warning: '#D97706',
      danger: '#B91C1C',
      outline: '#DDEEE4'
    }
  },
  {
    id: 'ocean_blue',
    name: 'Ocean Blue',
    meta: { is_dark: false },
    colors: {
      primary: '#1368CE',
      onPrimary: '#FFFFFF',
      secondary: '#0C4DA2',
      onSecondary: '#FFFFFF',
      background: '#F4F8FF',
      surface: '#FFFFFF',
      textPrimary: '#0F2138',
      textSecondary: '#4B6280',
      accent: '#22D3EE',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      outline: '#E5EDFF'
    }
  },
  {
    id: 'sky_blue',
    name: 'Sky Blue',
    meta: { is_dark: false },
    colors: {
      primary: '#1E88E5',
      onPrimary: '#FFFFFF',
      secondary: '#43A5F5',
      onSecondary: '#FFFFFF',
      background: '#F6FAFF',
      surface: '#FFFFFF',
      textPrimary: '#10273F',
      textSecondary: '#5B7188',
      accent: '#7C3AED',
      success: '#16A34A',
      warning: '#F59E0B',
      danger: '#DC2626',
      outline: '#E6EEF8'
    }
  },
  {
    id: 'steel_blue',
    name: 'Steel Blue',
    meta: { is_dark: false },
    colors: {
      primary: '#366A8C',
      onPrimary: '#FFFFFF',
      secondary: '#2A526C',
      onSecondary: '#FFFFFF',
      background: '#F5F7FA',
      surface: '#FFFFFF',
      textPrimary: '#1D2B36',
      textSecondary: '#5C6E7F',
      accent: '#FFB020',
      success: '#22C55E',
      warning: '#F59E0B',
      danger: '#EF4444',
      outline: '#E5E9F2'
    }
  },
  {
    id: 'deep_navy',
    name: 'Deep Navy',
    meta: { is_dark: true },
    colors: {
      primary: '#0B3C5D',
      onPrimary: '#FFFFFF',
      secondary: '#072C44',
      onSecondary: '#FFFFFF',
      background: '#0F2336',
      surface: '#13293D',
      textPrimary: '#EAF2F8',
      textSecondary: '#9EB3C7',
      accent: '#F18F01',
      success: '#34D399',
      warning: '#FBBF24',
      danger: '#F87171',
      outline: '#1E3A56'
    }
  },
  {
    id: 'midnight',
    name: 'Midnight (True Dark)',
    meta: { is_dark: true },
    colors: {
      primary: '#1F2937',
      onPrimary: '#FFFFFF',
      secondary: '#111827',
      onSecondary: '#FFFFFF',
      background: '#0B0F14',
      surface: '#121821',
      textPrimary: '#E5E7EB',
      textSecondary: '#9CA3AF',
      accent: '#22D3EE',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      outline: '#1F2937'
    }
  },
  {
    id: 'tech_gray',
    name: 'Tech Gray',
    meta: { is_dark: false },
    colors: {
      primary: '#4B5563',
      onPrimary: '#FFFFFF',
      secondary: '#374151',
      onSecondary: '#FFFFFF',
      background: '#F7F7F8',
      surface: '#FFFFFF',
      textPrimary: '#111827',
      textSecondary: '#6B7280',
      accent: '#22C55E',
      success: '#16A34A',
      warning: '#F59E0B',
      danger: '#DC2626',
      outline: '#E5E7EB'
    }
  },
  {
    id: 'arctic_white',
    name: 'Arctic White (Improved)',
    meta: { is_dark: false },
    colors: {
      primary: '#3A7DFF',
      onPrimary: '#FFFFFF',
      secondary: '#CBD5E0',
      onSecondary: '#0B1116',
      background: '#F5F7FA',
      surface: '#FFFFFF',
      textPrimary: '#111827',
      textSecondary: '#4B5563',
      accent: '#10B981',
      success: '#16A34A',
      warning: '#D97706',
      danger: '#B91C1C',
      outline: '#E5E7EB'
    }
  },
  {
    id: 'pastel_blush',
    name: 'Pastel Blush',
    meta: { is_dark: false },
    colors: {
      primary: '#FF8FAB',
      onPrimary: '#3B0B17',
      secondary: '#FFD6E0',
      onSecondary: '#3B0B17',
      background: '#FFF7FA',
      surface: '#FFFFFF',
      textPrimary: '#301124',
      textSecondary: '#7A5B6B',
      accent: '#8B5CF6',
      success: '#22C55E',
      warning: '#F59E0B',
      danger: '#DC2626',
      outline: '#F7D6E6'
    }
  },
  {
    id: 'lavender_dreams',
    name: 'Lavender Dreams',
    meta: { is_dark: false },
    colors: {
      primary: '#7C4DFF',
      onPrimary: '#FFFFFF',
      secondary: '#6D28D9',
      onSecondary: '#FFFFFF',
      background: '#F7F5FF',
      surface: '#FFFFFF',
      textPrimary: '#2B1B4B',
      textSecondary: '#6B5A8E',
      accent: '#F472B6',
      success: '#22C55E',
      warning: '#F59E0B',
      danger: '#EF4444',
      outline: '#E8E3FF'
    }
  },
  {
    id: 'mint_fresh',
    name: 'Mint Fresh',
    meta: { is_dark: false },
    colors: {
      primary: '#10B981',
      onPrimary: '#0A1A14',
      secondary: '#059669',
      onSecondary: '#FFFFFF',
      background: '#F1FFF8',
      surface: '#FFFFFF',
      textPrimary: '#0A1A14',
      textSecondary: '#3B7A62',
      accent: '#22D3EE',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      outline: '#D8F5EA'
    }
  },
  {
    id: 'sage',
    name: 'Sage',
    meta: { is_dark: false },
    colors: {
      primary: '#7BAE7F',
      onPrimary: '#0E1A10',
      secondary: '#5E8E63',
      onSecondary: '#FFFFFF',
      background: '#F4FBF5',
      surface: '#FFFFFF',
      textPrimary: '#142017',
      textSecondary: '#506757',
      accent: '#FFC857',
      success: '#2FA36B',
      warning: '#E0A106',
      danger: '#B33939',
      outline: '#E3F0E5'
    }
  },
  {
    id: 'desert_sand',
    name: 'Desert Sand',
    meta: { is_dark: false },
    colors: {
      primary: '#C19A6B',
      onPrimary: '#23180E',
      secondary: '#A47E56',
      onSecondary: '#FFFFFF',
      background: '#FFF8F0',
      surface: '#FFFFFF',
      textPrimary: '#2B2016',
      textSecondary: '#6F5A47',
      accent: '#F59E0B',
      success: '#16A34A',
      warning: '#E7B10A',
      danger: '#B91C1C',
      outline: '#F0E1D0'
    }
  },
  {
    id: 'clay_terracotta',
    name: 'Clay Terracotta',
    meta: { is_dark: false },
    colors: {
      primary: '#D16A5A',
      onPrimary: '#3C1512',
      secondary: '#B25446',
      onSecondary: '#FFFFFF',
      background: '#FFF4F2',
      surface: '#FFFFFF',
      textPrimary: '#391915',
      textSecondary: '#7B4B44',
      accent: '#F4B400',
      success: '#2ECC71',
      warning: '#F59E0B',
      danger: '#B91C1C',
      outline: '#F4DEDA'
    }
  },
  {
    id: 'earth_brown',
    name: 'Earth Brown',
    meta: { is_dark: false },
    colors: {
      primary: '#6B4F3A',
      onPrimary: '#FFFFFF',
      secondary: '#4E3726',
      onSecondary: '#FFFFFF',
      background: '#FBF7F2',
      surface: '#FFFFFF',
      textPrimary: '#2D241C',
      textSecondary: '#7A6B5D',
      accent: '#D2B48C',
      success: '#16A34A',
      warning: '#E0A106',
      danger: '#B91C1C',
      outline: '#EDE2D6'
    }
  },
  {
    id: 'coral_reef',
    name: 'Coral Reef',
    meta: { is_dark: false },
    colors: {
      primary: '#FF6F61',
      onPrimary: '#3A0E0B',
      secondary: '#E45446',
      onSecondary: '#FFFFFF',
      background: '#FFF6F5',
      surface: '#FFFFFF',
      textPrimary: '#3A0E0B',
      textSecondary: '#8A524B',
      accent: '#00C4CC',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#DC2626',
      outline: '#F9D9D6'
    }
  },
  {
    id: 'sunset_orange',
    name: 'Sunset Orange',
    meta: { is_dark: false },
    colors: {
      primary: '#F97316',
      onPrimary: '#290E02',
      secondary: '#EA580C',
      onSecondary: '#FFFFFF',
      background: '#FFF7F2',
      surface: '#FFFFFF',
      textPrimary: '#2B160B',
      textSecondary: '#885B3A',
      accent: '#0EA5E9',
      success: '#16A34A',
      warning: '#D97706',
      danger: '#B91C1C',
      outline: '#F7E1D6'
    }
  },
  {
    id: 'sunshine_yellow',
    name: 'Sunshine Yellow',
    meta: { is_dark: false },
    colors: {
      primary: '#F4C542',
      onPrimary: '#231A05',
      secondary: '#D9A821',
      onSecondary: '#231A05',
      background: '#FFFDF2',
      surface: '#FFFFFF',
      textPrimary: '#2B1F06',
      textSecondary: '#7A6B3A',
      accent: '#2563EB',
      success: '#16A34A',
      warning: '#D97706',
      danger: '#B91C1C',
      outline: '#F4E9C6'
    }
  },
  {
    id: 'golden_hour',
    name: 'Golden Hour',
    meta: { is_dark: false },
    colors: {
      primary: '#FFB020',
      onPrimary: '#231803',
      secondary: '#DA8A00',
      onSecondary: '#FFFFFF',
      background: '#FFF9ED',
      surface: '#FFFFFF',
      textPrimary: '#241A06',
      textSecondary: '#8C6A2A',
      accent: '#2563EB',
      success: '#10B981',
      warning: '#D97706',
      danger: '#B91C1C',
      outline: '#FFE7BF'
    }
  },
  {
    id: 'rose_red',
    name: 'Rose Red',
    meta: { is_dark: false },
    colors: {
      primary: '#E11D48',
      onPrimary: '#FFFFFF',
      secondary: '#BE123C',
      onSecondary: '#FFFFFF',
      background: '#FFF5F7',
      surface: '#FFFFFF',
      textPrimary: '#3F0A17',
      textSecondary: '#8C4A5A',
      accent: '#FB7185',
      success: '#22C55E',
      warning: '#F59E0B',
      danger: '#B91C1C',
      outline: '#FAD1DA'
    }
  },
  {
    id: 'volcano',
    name: 'Volcano',
    meta: { is_dark: false },
    colors: {
      primary: '#D63031',
      onPrimary: '#FFFFFF',
      secondary: '#A61B1C',
      onSecondary: '#FFFFFF',
      background: '#FFF6F6',
      surface: '#FFFFFF',
      textPrimary: '#3A0A0A',
      textSecondary: '#8C4B4B',
      accent: '#FFB020',
      success: '#22C55E',
      warning: '#FB923C',
      danger: '#B91C1C',
      outline: '#F6D0D0'
    }
  },
  {
    id: 'cyber_purple',
    name: 'Cyber Purple',
    meta: { is_dark: false },
    colors: {
      primary: '#6D28D9',
      onPrimary: '#FFFFFF',
      secondary: '#4C1D95',
      onSecondary: '#FFFFFF',
      background: '#F7F5FF',
      surface: '#FFFFFF',
      textPrimary: '#22124A',
      textSecondary: '#6B5A8E',
      accent: '#22D3EE',
      success: '#22C55E',
      warning: '#F59E0B',
      danger: '#EF4444',
      outline: '#E8E3FF'
    }
  },
  {
    id: 'neon_pop',
    name: 'Neon Pop',
    meta: { is_dark: false },
    colors: {
      primary: '#00E5A8',
      onPrimary: '#00231C',
      secondary: '#00B894',
      onSecondary: '#00231C',
      background: '#F3FFFB',
      surface: '#FFFFFF',
      textPrimary: '#05241D',
      textSecondary: '#2E6E5D',
      accent: '#FF3D71',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#DC2626',
      outline: '#DAF7EE'
    }
  },
  {
    id: 'emerald_city',
    name: 'Emerald City',
    meta: { is_dark: false },
    colors: {
      primary: '#1F9D55',
      onPrimary: '#06140E',
      secondary: '#157347',
      onSecondary: '#FFFFFF',
      background: '#F0FFF7',
      surface: '#FFFFFF',
      textPrimary: '#0A1C14',
      textSecondary: '#3E6B56',
      accent: '#FFC857',
      success: '#1F9D55',
      warning: '#E0A106',
      danger: '#B91C1C',
      outline: '#D9F3E6'
    }
  }
];

export const DEFAULT_THEME_ID = 'modern_teal';

export const getThemeById = (id: string): ThemeWithMeta => {
  return THEMES.find(theme => theme.id === id) || THEMES[0];
};