import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { storage } from '@/lib/storage';
import { Theme, ThemeColors } from '@/types';
import { THEMES, DEFAULT_THEME_ID, getThemeById } from '@/constants/themes';

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(getThemeById(DEFAULT_THEME_ID));

  useEffect(() => {
    (async () => {
      const savedId = await storage.getThemeId();
      if (savedId) setCurrentTheme(getThemeById(savedId));
    })();
  }, []);

  const applyTheme = useCallback(async (themeId: string) => {
    const theme = getThemeById(themeId);
    setCurrentTheme(theme);
    await storage.saveThemeId(themeId);
  }, []);

  const colors: ThemeColors = currentTheme.colors;

  return useMemo(() => ({
    currentTheme,
    colors,
    themes: THEMES,
    applyTheme,
  }), [currentTheme, colors, applyTheme]);
});
