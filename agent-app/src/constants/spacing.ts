/**
 * Rapidry Design System — Spacing & Layout Tokens
 * Extracted from Figma design system (theme.css)
 * 
 * Based on a 4px grid system
 */

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  section: 64,
} as const;

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 28,
  pill: 999,
} as const;

export const SHADOWS = {
  elevation1: {
    shadowColor: '#0F2E2A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  elevation2: {
    shadowColor: '#0F2E2A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  elevation3: {
    shadowColor: '#0F2E2A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 5,
  },
  elevationGold: {
    shadowColor: '#D6B97B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 5,
  },
} as const;

/**
 * Layout constants
 * Screen width: 390px (iPhone 14 Pro reference)
 */
export const LAYOUT = {
  screenPaddingHorizontal: 20,
  webPaddingHorizontal: 24,
  cardPadding: 16,
  cardPaddingLarge: 20,
  cardGap: 12,
  minTouchTarget: 44,
  bottomNavHeight: 80,
  buttonHeight: 56,
  safeAreaTop: 47,
} as const;
