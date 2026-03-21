The current fonts.css loads Playfair Display and DM Sans 
via Google Fonts URL. This will NOT work in React Native.

Make these changes to prepare for React Native export:

STEP 1: Update src/styles/fonts.css

Replace the @import Google Fonts URL line with a comment 
block that says exactly this:

/* 
  REACT NATIVE FONT LOADING INSTRUCTIONS
  ========================================
  Do NOT use Google Fonts URL in React Native.
  
  Required font files to download and add to 
  assets/fonts/ directory:
  
  Playfair Display:
  - PlayfairDisplay-Regular.ttf
  - PlayfairDisplay-SemiBold.ttf  
  - PlayfairDisplay-Bold.ttf
  - PlayfairDisplay-Italic.ttf
  
  DM Sans:
  - DMSans-Regular.ttf
  - DMSans-Medium.ttf
  - DMSans-SemiBold.ttf
  
  Download from: fonts.google.com
  
  In app/_layout.tsx use:
  
  import { useFonts } from 'expo-font';
  
  const [fontsLoaded] = useFonts({
    'PlayfairDisplay-Regular': 
      require('../assets/fonts/PlayfairDisplay-Regular.ttf'),
    'PlayfairDisplay-SemiBold': 
      require('../assets/fonts/PlayfairDisplay-SemiBold.ttf'),
    'PlayfairDisplay-Bold': 
      require('../assets/fonts/PlayfairDisplay-Bold.ttf'),
    'PlayfairDisplay-Italic': 
      require('../assets/fonts/PlayfairDisplay-Italic.ttf'),
    'DMSans-Regular': 
      require('../assets/fonts/DMSans-Regular.ttf'),
    'DMSans-Medium': 
      require('../assets/fonts/DMSans-Medium.ttf'),
    'DMSans-SemiBold': 
      require('../assets/fonts/DMSans-SemiBold.ttf'),
  });
  
  if (!fontsLoaded) return null;
  
  Then in StyleSheet, use these font family names:
  fontFamily: 'PlayfairDisplay-Bold'
  fontFamily: 'DMSans-Regular'
  etc.
  
  IMPORTANT: In React Native, fontStyle: 'italic' only 
  works if the italic variant font file is loaded.
  Always load PlayfairDisplay-Italic.ttf separately.
*/

Keep the Google Fonts @import below the comment so 
the Figma/browser preview still works:
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap');

STEP 2: Add a FONTS constant file.
Create: src/app/constants/fonts.ts

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

STEP 3: Rename the 3 asset PNG files.
In src/assets/, rename:
  35f760095b7ec0e7f2f8193910c32d87fbed5934.png 
  → logo-light.png
  
  9ddc68491eabfd68e11094833e9264a1b5435503.png 
  → logo-dark.png
  
  f90ceb00702b22ff209113e464599d98455b80c7.png 
  → logo-icon.png

Update all import references in:
  App.tsx (3 imports)
  SplashScreen.tsx (1 import)
  AdminDashboard.tsx (check for logo import)
  AdminOrdersPage.tsx (check for logo import)
  AdminManagementPage.tsx (check for logo import)