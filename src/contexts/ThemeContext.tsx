import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme } from '../types';
import { getOrCreateUserSettings, updateTheme } from '../services/userService';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  customTheme?: string;
  setCustomTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [customTheme, setCustomThemeState] = useState<string>('');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    getOrCreateUserSettings().then(settings => {
      setThemeState(settings.theme_preference);
      if (settings.custom_theme) {
        setCustomThemeState(settings.custom_theme);
      }
    });
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;

    const getSystemTheme = (): 'light' | 'dark' => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const applyTheme = (themeToApply: 'light' | 'dark') => {
      root.classList.remove('light', 'dark');
      root.classList.add(themeToApply);
      setActualTheme(themeToApply);
    };

    if (theme === 'system') {
      const systemTheme = getSystemTheme();
      applyTheme(systemTheme);

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    await updateTheme(newTheme);
  };

  const setCustomTheme = (newCustomTheme: string) => {
    setCustomThemeState(newCustomTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, actualTheme, setTheme, customTheme, setCustomTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
