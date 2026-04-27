import React, { createContext, useContext, useState, useCallback } from 'react';

export type ColorScheme = 'light' | 'dark';

// ─── Light palette ────────────────────────────────────────────────────────────
export const LightColors = {
  primary: '#F97316',
  primaryLight: '#FFEDD5',
  accent: '#FF4D4D',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  card: '#FAFAFA',
  bubbleIncoming: '#FFE8DF',
  bubbleOutgoing: '#FFCABB',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textOnPrimary: '#FFFFFF',
  border: '#E5E7EB',
  icon: '#8E8E93',
  iconActive: '#FF4D4D',
  shadow: 'rgba(0,0,0,0.08)',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// ─── Dark palette ─────────────────────────────────────────────────────────────
export const DarkColors = {
  primary: '#F97316',
  primaryLight: '#431407',
  accent: '#FF6B6B',
  background: '#0F0F0F',
  surface: '#1C1C1E',
  card: '#1C1C1E',
  bubbleIncoming: '#2C1A14',
  bubbleOutgoing: '#3D1F10',
  textPrimary: '#F2F2F7',
  textSecondary: '#8E8E93',
  textMuted: '#636366',
  textOnPrimary: '#FFFFFF',
  border: '#2C2C2E',
  icon: '#636366',
  iconActive: '#FF6B6B',
  shadow: 'rgba(0,0,0,0.4)',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export type AppColors = typeof LightColors;

// ─── Context ──────────────────────────────────────────────────────────────────
interface ThemeContextValue {
  scheme: ColorScheme;
  colors: AppColors;
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  scheme: 'light',
  colors: LightColors,
  isDark: false,
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [scheme, setScheme] = useState<ColorScheme>('light');

  const toggle = useCallback(() => {
    setScheme((s) => (s === 'light' ? 'dark' : 'light'));
  }, []);

  const colors = scheme === 'dark' ? DarkColors : LightColors;

  return (
    <ThemeContext.Provider value={{ scheme, colors, isDark: scheme === 'dark', toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
