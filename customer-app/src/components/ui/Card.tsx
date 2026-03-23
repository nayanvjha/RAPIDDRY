import React from 'react';
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';

import { COLORS } from '../../constants/colors';
import { RADIUS, SHADOWS } from '../../constants/spacing';

export type CardVariant = 'default' | 'active' | 'glass';

type CardProps = ViewProps & {
  variant?: CardVariant;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const Card = ({ variant = 'default', children, style, ...rest }: CardProps) => {
  const variantStyle = variantStyles[variant];

  return (
    <View style={[styles.base, variantStyle, style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    ...SHADOWS.elevation2,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 16,
  },
});

const variantStyles = StyleSheet.create({
  default: {},
  active: {
    borderLeftColor: COLORS.gold,
    borderLeftWidth: 3,
  },
  glass: {
    backgroundColor: 'rgba(243, 239, 230, 0.8)',
    borderColor: 'rgba(214, 185, 123, 0.2)',
    borderWidth: 1,
  },
});
