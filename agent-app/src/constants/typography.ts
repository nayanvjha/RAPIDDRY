/**
 * Rapidry Design System — Typography Tokens
 * Extracted from Figma design system
 * 
 * Fonts: Playfair Display (headings) + DM Sans (body)
 * Load these fonts using expo-font with bundled .ttf files
 */

export const FONTS = {
  display: 'PlayfairDisplay',
  displayBold: 'PlayfairDisplay-Bold',
  displaySemiBold: 'PlayfairDisplay-SemiBold',
  displayItalic: 'PlayfairDisplay-Italic',
  body: 'DMSans-Regular',
  bodyMedium: 'DMSans-Medium',
  bodySemiBold: 'DMSans-SemiBold',
  bodyBold: 'DMSans-Bold',
} as const;

/**
 * Typography scale — maps to the design system's type hierarchy
 * Usage: StyleSheet.create({ title: { ...TYPOGRAPHY.displayXL } })
 */
export const TYPOGRAPHY = {
  displayXL: {
    fontFamily: FONTS.displayBold,
    fontSize: 32,
    letterSpacing: -0.5,
    lineHeight: 38.4, // 1.2
  },
  displayL: {
    fontFamily: FONTS.displayBold,
    fontSize: 26,
    letterSpacing: -0.3,
    lineHeight: 32.5, // 1.25
  },
  heading1: {
    fontFamily: FONTS.displaySemiBold,
    fontSize: 22,
    letterSpacing: -0.2,
    lineHeight: 28.6, // 1.3
  },
  heading2: {
    fontFamily: FONTS.displaySemiBold,
    fontSize: 18,
    letterSpacing: 0,
    lineHeight: 24.3, // 1.35
  },
  labelL: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 15,
    letterSpacing: 0.2,
    lineHeight: 21, // 1.4
  },
  labelM: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 13,
    letterSpacing: 0.15,
    lineHeight: 18.2, // 1.4
  },
  labelS: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    letterSpacing: 0.4,
    lineHeight: 16.5, // 1.5
    textTransform: 'uppercase' as const,
  },
  bodyL: {
    fontFamily: FONTS.body,
    fontSize: 15,
    letterSpacing: 0,
    lineHeight: 24, // 1.6
  },
  bodyM: {
    fontFamily: FONTS.body,
    fontSize: 13,
    letterSpacing: 0,
    lineHeight: 20.15, // 1.55
  },
  caption: {
    fontFamily: FONTS.body,
    fontSize: 11,
    letterSpacing: 0.1,
    lineHeight: 16.5, // 1.5
  },
} as const;
