import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { storage } from '@/lib/storage';
import { Theme, ThemeColors } from '@/types';
import { THEMES, DEFAULT_THEME_ID, getThemeById } from '@/constants/themes';

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(getThemeById(DEFAULT_THEME_ID));
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme on mount
  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const savedThemeId = await storage.getThemeId();
      if (savedThemeId) {
        const theme = getThemeById(savedThemeId);
        setCurrentTheme(theme);
      }
    } catch (error) {
      console.error('Failed to load saved theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyTheme = useCallback(async (themeId: string) => {
    const theme = getThemeById(themeId);
    setCurrentTheme(theme);
    
    try {
      await storage.saveThemeId(themeId);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  }, []);

  const previewTheme = useCallback((themeId: string) => {
    const theme = getThemeById(themeId);
    setCurrentTheme(theme);
  }, []);

  const resetToDefault = useCallback(async () => {
    await applyTheme(DEFAULT_THEME_ID);
  }, [applyTheme]);

  const colors: ThemeColors = currentTheme.colors;

  return useMemo(() => ({
    currentTheme,
    colors,
    themes: THEMES,
    isLoading,
    applyTheme,
    previewTheme,
    resetToDefault,
  }), [currentTheme, colors, isLoading, applyTheme, previewTheme, resetToDefault]);
});