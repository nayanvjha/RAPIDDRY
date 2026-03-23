import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { COLORS, FONTS, RADIUS, SHADOWS } from '../../constants';

export type ServiceCardSize = 'large' | 'small';
export type ServiceCardTone = 'dark' | 'light' | 'outlined';

export type ServiceCardData = {
  id: string;
  name: string;
  base_price: number | string | null;
  price_unit: string | null;
};

type ServiceCardProps = {
  service: ServiceCardData;
  size: ServiceCardSize;
  tone: ServiceCardTone;
  onPress?: (service: ServiceCardData) => void;
};

const iconByServiceName: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  'Wash & Fold': 'washing-machine',
  'Wash & Iron': 'iron',
  'Dry Clean': 'hanger',
  'Steam Iron': 'iron-board',
  'Shoe Cleaning': 'shoe-formal',
  'Shoe Care': 'shoe-formal',
  'Bag Cleaning': 'bag-personal',
};

const formatPrice = (service: ServiceCardData, size: ServiceCardSize) => {
  const raw = service.base_price;
  const value = raw === null ? null : Number(raw);

  if (value === null || Number.isNaN(value)) {
    return 'Price on request';
  }

  if (size === 'large') {
    if (service.price_unit === 'per_kg') {
      return `\u20B9${value} / kg`;
    }

    return `\u20B9${value} / item`;
  }

  if (service.name === 'Dry Clean') {
    return `From \u20B9${value}`;
  }

  if (service.price_unit === 'per_kg') {
    return `\u20B9${value}/kg`;
  }

  return `\u20B9${value}/item`;
};

export const ServiceCard = ({ service, size, tone, onPress }: ServiceCardProps) => {
  const iconName = iconByServiceName[service.name] ?? 'archive';
  const isDark = tone === 'dark';
  const isLarge = size === 'large';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        isLarge ? styles.large : styles.small,
        toneStyles[tone],
        pressed && styles.pressed,
      ]}
      onPress={() => onPress?.(service)}
    >
      <MaterialCommunityIcons
        name={iconName}
        size={isLarge ? 26 : 22}
        color={isDark ? COLORS.gold : COLORS.forestDark}
      />

      <View style={styles.footer}>
        <Text numberOfLines={1} style={[styles.name, isDark && styles.nameOnDark, isLarge ? styles.nameLarge : styles.nameSmall]}>
          {service.name}
        </Text>
        <Text style={[styles.price, isDark ? styles.priceOnDark : styles.priceOnLight]}>
          {formatPrice(service, size)}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    justifyContent: 'space-between',
    minHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  large: {
    flex: 1,
    height: 160,
    padding: 16,
  },
  small: {
    flex: 1,
    height: 100,
  },
  footer: {
    gap: 2,
  },
  name: {
    fontFamily: FONTS.bodySemiBold,
  },
  nameLarge: {
    fontSize: 14,
  },
  nameSmall: {
    fontSize: 13,
  },
  nameOnDark: {
    color: COLORS.white,
  },
  price: {
    color: COLORS.gold,
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
  },
  priceOnDark: {
    color: COLORS.gold,
  },
  priceOnLight: {
    color: COLORS.gold,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});

const toneStyles = StyleSheet.create({
  dark: {
    backgroundColor: COLORS.forestDark,
  },
  light: {
    ...SHADOWS.elevation2,
    backgroundColor: COLORS.white,
    borderColor: COLORS.creamDark,
    borderWidth: 1,
  },
  outlined: {
    ...SHADOWS.elevation1,
    backgroundColor: COLORS.white,
    borderColor: COLORS.goldLight,
    borderWidth: 1.5,
  },
});
