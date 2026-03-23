import { useFonts } from 'expo-font';

export const useLoadFonts = () => {
  // Download the matching .ttf files and place them in assets/fonts before running the app.
  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay: require('../../assets/fonts/PlayfairDisplay-Regular.ttf'),
    'PlayfairDisplay-Bold': require('../../assets/fonts/PlayfairDisplay-Bold.ttf'),
    'PlayfairDisplay-SemiBold': require('../../assets/fonts/PlayfairDisplay-SemiBold.ttf'),
    'PlayfairDisplay-Italic': require('../../assets/fonts/PlayfairDisplay-Italic.ttf'),
    'DMSans-Regular': require('../../assets/fonts/DMSans-Regular.ttf'),
    'DMSans-Medium': require('../../assets/fonts/DMSans-Medium.ttf'),
    'DMSans-SemiBold': require('../../assets/fonts/DMSans-SemiBold.ttf'),
    'DMSans-Bold': require('../../assets/fonts/DMSans-Bold.ttf'),
  });

  return {
    fontsLoaded,
    fontError,
  };
};
