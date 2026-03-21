/**
 * Rapidry Design System — Color Tokens
 * Extracted from Figma design system (theme.css)
 * 
 * Usage (React Native): import { COLORS } from '../constants/colors';
 * Usage (Web):          import { COLORS } from '../constants/colors';
 */

export const COLORS = {
  // Primary — Forest green palette
  forestDark: '#0F2E2A',
  forestMid: '#183F3A',
  forestLight: '#1E4D47',

  // Accent — Gold palette
  gold: '#D6B97B',
  goldLight: '#E8D4A8',
  goldPale: '#F5EDDA',

  // Surface
  cream: '#F3EFE6',
  creamDark: '#EAE4D8',
  white: '#FFFFFF',

  // Text
  textPrimary: '#0F2E2A',
  textSecondary: '#4A5568',
  textOnDark: '#F3EFE6',
  textGold: '#D6B97B',
  textMuted: '#9CAB9A',

  // Status
  statusSuccess: '#15803D',
  statusWarning: '#D6B97B',
  statusError: '#991B1B',
  statusInfo: '#1E3A5F',
} as const;

export type ColorKey = keyof typeof COLORS;
