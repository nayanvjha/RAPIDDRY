import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS, FONTS, RADIUS, SHADOWS, TYPOGRAPHY } from '../../constants';

type HeroBannerProps = {
  onBookNowPress?: () => void;
};

export const HeroBanner = ({ onBookNowPress }: HeroBannerProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Same-day pickup available</Text>
      </View>

      <Text style={styles.heading}>
        Fresh clothes,{`\n`}delivered.
      </Text>

      <Pressable style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaPressed]} onPress={onBookNowPress}>
        <Text style={styles.ctaText}>Book Now {'\u2192'}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...SHADOWS.elevation3,
    backgroundColor: COLORS.forestDark,
    borderRadius: 18,
    height: 200,
    overflow: 'hidden',
    padding: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(214, 185, 123, 0.15)',
    borderColor: 'rgba(214, 185, 123, 0.25)',
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: COLORS.gold,
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    lineHeight: 16,
  },
  heading: {
    ...TYPOGRAPHY.displayL,
    color: COLORS.white,
    marginTop: 10,
    maxWidth: 220,
  },
  ctaButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.gold,
    borderRadius: RADIUS.pill,
    height: 34,
    justifyContent: 'center',
    marginTop: 12,
    minWidth: 106,
    paddingHorizontal: 16,
  },
  ctaPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.97 }],
  },
  ctaText: {
    color: COLORS.forestDark,
    fontFamily: FONTS.bodySemiBold,
    fontSize: 12,
    lineHeight: 16,
  },
});
