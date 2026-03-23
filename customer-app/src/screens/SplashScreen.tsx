import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';

import { Button } from '../components/ui';
import { COLORS, FONTS, LAYOUT, SPACING } from '../constants';

export const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.logoWrap}>
          <Text style={styles.logoText}>RAPIDRY</Text>
          <Text style={styles.subText}>EST. 2026</Text>
        </View>

        <View style={styles.bottomWrap}>
          <Button variant="primary" onPress={() => navigation.navigate('PhoneLogin')}>
            Get Started
          </Button>

          <Pressable onPress={() => navigation.navigate('PhoneLogin')} style={styles.signInWrap}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <Text style={styles.signInLink}>Sign In</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.forestDark,
    flex: 1,
  },
  container: {
    backgroundColor: COLORS.forestDark,
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
  },
  logoWrap: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logoText: {
    color: COLORS.gold,
    fontFamily: FONTS.displayBold,
    fontSize: 36,
    letterSpacing: 6,
  },
  subText: {
    color: COLORS.textMuted,
    fontFamily: FONTS.body,
    fontSize: 11,
    letterSpacing: 4,
    marginTop: 8,
  },
  bottomWrap: {
    paddingBottom: 32,
  },
  signInWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.base,
  },
  signInText: {
    color: COLORS.textMuted,
    fontFamily: FONTS.body,
    fontSize: 13,
  },
  signInLink: {
    color: COLORS.gold,
    fontFamily: FONTS.bodyMedium,
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});
