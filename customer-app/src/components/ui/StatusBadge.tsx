import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../constants/colors';
import { RADIUS } from '../../constants/spacing';
import { FONTS } from '../../constants/typography';

export type Status = 'success' | 'pending' | 'warning' | 'error' | 'info';

type StatusBadgeProps = {
  status: Status;
  label: string;
};

export const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <View style={[styles.container, { backgroundColor: config.backgroundColor }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.label, { color: config.color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: RADIUS.pill,
    flexDirection: 'row',
    gap: 8,
    minHeight: 28,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  dot: {
    borderRadius: RADIUS.pill,
    height: 8,
    width: 8,
  },
  label: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.15,
    lineHeight: 16,
  },
});

const statusConfig = {
  success: {
    backgroundColor: '#EAF8EE',
    color: COLORS.statusSuccess,
  },
  pending: {
    backgroundColor: COLORS.goldPale,
    color: COLORS.statusWarning,
  },
  warning: {
    backgroundColor: COLORS.goldPale,
    color: COLORS.statusWarning,
  },
  error: {
    backgroundColor: '#FDECEC',
    color: COLORS.statusError,
  },
  info: {
    backgroundColor: '#EAF1FA',
    color: COLORS.statusInfo,
  },
} as const;
