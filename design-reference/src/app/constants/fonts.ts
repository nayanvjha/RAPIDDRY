export const FONTS = {
  display: {
    regular: 'PlayfairDisplay-Regular',
    semibold: 'PlayfairDisplay-SemiBold',
    bold: 'PlayfairDisplay-Bold',
    italic: 'PlayfairDisplay-Italic',
  },
  body: {
    regular: 'DMSans-Regular',
    medium: 'DMSans-Medium',
    semibold: 'DMSans-SemiBold',
  },
} as const;

// Web/Figma preview fallbacks (CSS variables still work)
export const FONT_FAMILIES = {
  display: 'var(--font-display)',
  body: 'var(--font-body)',
} as const;
