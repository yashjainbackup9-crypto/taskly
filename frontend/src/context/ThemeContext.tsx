'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode, ColorMode } from '../types/user';

interface ThemeContextType {
  theme: ThemeMode;
  colorMode: ColorMode;
  setTheme: (theme: ThemeMode) => void;
  setColorMode: (colorMode: ColorMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [colorMode, setColorModeState] = useState<ColorMode>('blue');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = (localStorage.getItem('taskly_theme') as ThemeMode) || 'light';
    const savedColor = (localStorage.getItem('taskly_color_mode') as ColorMode) || 'blue';
    
    setThemeState(savedTheme);
    setColorModeState(savedColor);
    applyTheme(savedTheme, savedColor);
    setMounted(true);
  }, []);

  const applyTheme = (t: ThemeMode, c: ColorMode) => {
    const root = document.documentElement;
    if (t === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.setAttribute('data-color', c);
  };

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    localStorage.setItem('taskly_theme', t);
    applyTheme(t, colorMode);
  };

  const setColorMode = (c: ColorMode) => {
    setColorModeState(c);
    localStorage.setItem('taskly_color_mode', c);
    applyTheme(theme, c);
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, colorMode, setTheme, setColorMode, toggleTheme }}>
      <div className={mounted ? '' : 'invisible'}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
