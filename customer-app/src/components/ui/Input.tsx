import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { COLORS } from '../../constants/colors';
import { FONTS, TYPOGRAPHY } from '../../constants/typography';

type InputProps = TextInputProps & {
  label: string;
  errorMessage?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

export const Input = ({
  label,
  errorMessage,
  value,
  defaultValue,
  onFocus,
  onBlur,
  onChangeText,
  containerStyle,
  inputStyle,
  ...rest
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');

  const resolvedValue = useMemo(() => {
    if (typeof value === 'string') {
      return value;
    }

    return internalValue;
  }, [internalValue, value]);

  const isFloating = isFocused || resolvedValue.length > 0;
  const hasError = Boolean(errorMessage);
  const labelAnim = useRef(new Animated.Value(isFloating ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isFloating ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [isFloating, labelAnim]);

  const handleFocus: TextInputProps['onFocus'] = (event) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur: TextInputProps['onBlur'] = (event) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  const handleChangeText = (text: string) => {
    if (typeof value !== 'string') {
      setInternalValue(text);
    }

    onChangeText?.(text);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.inputWrap,
          {
            borderBottomColor: hasError
              ? COLORS.statusError
              : isFocused
                ? COLORS.gold
                : COLORS.forestMid,
          },
        ]}
      >
        <Animated.Text
          style={[
            styles.label,
            {
              color: hasError
                ? COLORS.statusError
                : isFocused
                  ? COLORS.gold
                  : COLORS.textSecondary,
              fontFamily: isFloating ? FONTS.displayItalic : FONTS.body,
              fontSize: labelAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [15, 12],
              }) as unknown as number,
              top: labelAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [18, 4],
              }) as unknown as number,
            },
          ]}
        >
          {label}
        </Animated.Text>

        <TextInput
          value={resolvedValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleChangeText}
          style={[styles.input, inputStyle]}
          placeholder=""
          placeholderTextColor="transparent"
          {...rest}
        />
      </View>

      {hasError && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputWrap: {
    borderBottomWidth: 1.5,
    minHeight: 60,
    paddingTop: 16,
    position: 'relative',
  },
  label: {
    left: 0,
    position: 'absolute',
  },
  input: {
    ...TYPOGRAPHY.bodyL,
    color: COLORS.textPrimary,
    paddingBottom: 8,
    paddingTop: 20,
  },
  errorText: {
    color: COLORS.statusError,
    fontFamily: FONTS.body,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 6,
  },
});
