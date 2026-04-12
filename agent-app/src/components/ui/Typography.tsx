import React from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';

import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

type TypographyProps = TextProps & {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

const createTypographyComponent = (baseStyle: TextStyle) => {
  return ({ children, style, ...rest }: TypographyProps) => {
    return (
      <Text style={[{ color: COLORS.textOnDark }, baseStyle, style]} {...rest}>
        {children}
      </Text>
    );
  };
};

export const DisplayXL = createTypographyComponent(TYPOGRAPHY.displayXL);
export const DisplayL = createTypographyComponent(TYPOGRAPHY.displayL);
export const Heading1 = createTypographyComponent(TYPOGRAPHY.heading1);
export const Heading2 = createTypographyComponent(TYPOGRAPHY.heading2);
export const LabelL = createTypographyComponent(TYPOGRAPHY.labelL);
export const LabelM = createTypographyComponent(TYPOGRAPHY.labelM);
export const LabelS = createTypographyComponent(TYPOGRAPHY.labelS);
export const BodyL = createTypographyComponent(TYPOGRAPHY.bodyL);
export const BodyM = createTypographyComponent(TYPOGRAPHY.bodyM);
export const Caption = createTypographyComponent(TYPOGRAPHY.caption);
