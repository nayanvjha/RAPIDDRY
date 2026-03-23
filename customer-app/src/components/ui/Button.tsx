import React, { useRef } from 'react';
import {
  Animated,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { COLORS } from '../../constants/colors';
import { LAYOUT, RADIUS, SHADOWS } from '../../constants/spacing';
import { FONTS } from '../../constants/typography';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  disabled?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  children: React.ReactNode;
};

export const Button = ({
  variant = 'primary',
  fullWidth = true,
  disabled = false,
  onPress,
  children,
}: ButtonProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) {
      return;
    }

    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  const variantStyle = stylesByVariant[variant];

  return (
    <Animated.View
      style={[
        styles.container,
        fullWidth && styles.fullWidth,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <Pressable
        disabled={disabled}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.button,
          variantStyle.button,
          disabled && styles.disabled,
          pressed && !disabled && styles.pressed,
        ]}
      >
        <Text style={[styles.text, variantStyle.text]}>{children}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: LAYOUT.minTouchTarget,
  },
  fullWidth: {
    width: '100%',
  },
  button: {
    alignItems: 'center',
    borderRadius: RADIUS.pill,
    height: LAYOUT.buttonHeight,
    justifyContent: 'center',
    minHeight: LAYOUT.minTouchTarget,
    paddingHorizontal: 24,
  },
  pressed: {
    opacity: 0.96,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 15,
    letterSpacing: 0.2,
    lineHeight: 21,
  },
});

const stylesByVariant: Record<ButtonVariant, { button: ViewStyle; text: TextStyle }> = {
  primary: {
    button: {
      ...SHADOWS.elevationGold,
      backgroundColor: COLORS.gold,
    },
    text: {
      color: COLORS.forestDark,
    },
  },
  secondary: {
    button: {
      backgroundColor: 'transparent',
      borderColor: COLORS.forestDark,
      borderWidth: 1.5,
    },
    text: {
      color: COLORS.forestDark,
    },
  },
  ghost: {
    button: {
      backgroundColor: 'transparent',
      paddingHorizontal: 12,
    },
    text: {
      color: COLORS.gold,
    },
  },
};
