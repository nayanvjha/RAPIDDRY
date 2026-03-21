/**
 * Rapidry Design System — Color Tokens (Web)
 * Same values as mobile constants, exported as CSS-compatible values
 */

export const COLORS = {
  forestDark: '#0F2E2A',
  forestMid: '#183F3A',
  forestLight: '#1E4D47',
  gold: '#D6B97B',
  goldLight: '#E8D4A8',
  goldPale: '#F5EDDA',
  cream: '#F3EFE6',
  creamDark: '#EAE4D8',
  white: '#FFFFFF',
  textPrimary: '#0F2E2A',
  textSecondary: '#4A5568',
  textOnDark: '#F3EFE6',
  textGold: '#D6B97B',
  textMuted: '#9CAB9A',
  statusSuccess: '#15803D',
  statusWarning: '#D6B97B',
  statusError: '#991B1B',
  statusInfo: '#1E3A5F',
} as const;

export const FONTS = {
  display: "'Playfair Display', serif",
  body: "'DM Sans', sans-serif",
} as const;

export const SPACING = {
  xs: '4px', sm: '8px', md: '12px', base: '16px',
  lg: '20px', xl: '24px', '2xl': '32px', '3xl': '40px',
  '4xl': '48px', section: '64px',
} as const;

export const RADIUS = {
  xs: '4px', sm: '8px', md: '12px', lg: '16px',
  xl: '20px', '2xl': '28px', pill: '999px',
} as const;
