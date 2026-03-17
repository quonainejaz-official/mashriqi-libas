'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultThemeKey, getNextThemeKey, resolveThemeKey, themes } from '@/lib/themeConfig';

const ThemeContext = createContext(null);

const getInitialThemeKey = () => {
  if (typeof window === 'undefined') {
    return defaultThemeKey;
  }
  const stored = localStorage.getItem('theme');
  if (stored && themes[stored]) {
    return stored;
  }
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'light' : defaultThemeKey;
};

const applyTheme = (themeKey) => {
  if (typeof document === 'undefined') {
    return;
  }
  const root = document.documentElement;
  const theme = themes[themeKey] || themes[defaultThemeKey];
  root.setAttribute('data-theme', theme.key);
  root.classList.remove('theme-dark', 'theme-light', 'theme-gold');
  root.classList.add(`theme-${theme.key}`);
  Object.entries(theme.cssVars).forEach(([token, value]) => {
    root.style.setProperty(`--${token}`, value);
  });
  root.style.colorScheme = theme.colorScheme;
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', theme.colors.backgroundPage);
  }
};

export const ThemeProvider = ({ children }) => {
  const [themeKey, setThemeKey] = useState(getInitialThemeKey);
  const resolvedThemeKey = useMemo(() => resolveThemeKey(themeKey), [themeKey]);

  useEffect(() => {
    applyTheme(resolvedThemeKey);
    localStorage.setItem('theme', resolvedThemeKey);
  }, [resolvedThemeKey]);

  const theme = useMemo(() => themes[resolvedThemeKey], [resolvedThemeKey]);

  const setTheme = (nextKey) => {
    setThemeKey(resolveThemeKey(nextKey));
  };

  const cycleTheme = () => {
    setThemeKey((current) => getNextThemeKey(resolveThemeKey(current)));
  };

  const value = useMemo(
    () => ({
      theme,
      themeKey: theme.key,
      setTheme,
      cycleTheme,
      themes
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
