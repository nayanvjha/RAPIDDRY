import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { BodyM, DisplayL, Heading2, LabelM } from '../components/ui';
import { AgentBottomNav } from '../components/shared/AgentBottomNav';
import { COLORS, LAYOUT, RADIUS, SPACING } from '../constants';
import api from '../services/api';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'AgentEarnings'>;

type EarningsPeriod = 'today' | 'week' | 'month';

type EarningBreakdownRow = {
  day: string;
  delivery_count: number;
  earnings: number;
};

type EarningsResponse = {
  period: EarningsPeriod;
  total_earnings: number;
  delivery_count: number;
  breakdown_by_day: EarningBreakdownRow[];
};

const PERIOD_OPTIONS: Array<{ label: string; value: EarningsPeriod }> = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
];

const formatCurrency = (amount: number) => `₹${Math.max(0, amount).toLocaleString('en-IN')}`;

const toDayName = (dayValue: string) => {
  const date = new Date(`${dayValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return dayValue;
  }

  return date.toLocaleDateString('en-IN', { weekday: 'short' });
};

const getNextFridayLabel = () => {
  const now = new Date();
  const currentDay = now.getDay();
  const daysUntilFriday = (5 - currentDay + 7) % 7 || 7;
  const nextFriday = new Date(now);
  nextFriday.setDate(now.getDate() + daysUntilFriday);

  return nextFriday.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });
};

export const AgentEarningsScreen = ({ navigation }: Props) => {
  const [period, setPeriod] = useState<EarningsPeriod>('today');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<EarningsResponse>({
    period: 'today',
    total_earnings: 0,
    delivery_count: 0,
    breakdown_by_day: [],
  });

  const loadEarnings = useCallback(async (nextPeriod: EarningsPeriod) => {
    setIsLoading(true);
    try {
      const response = await api.get<{ success: boolean; data: EarningsResponse }>('/earnings', {
        params: { period: nextPeriod },
      });

      setStats(response.data.data);
    } catch {
      Alert.alert('Earnings Error', 'Unable to load earnings right now.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEarnings(period);
  }, [period, loadEarnings]);

  const payoutAmount = useMemo(() => {
    const projected = stats.total_earnings * 0.9;
    return formatCurrency(projected);
  }, [stats.total_earnings]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screenWrap}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerRow}>
            <DisplayL>My Earnings</DisplayL>
            <Pressable onPress={() => navigation.goBack()} style={styles.backChip}>
              <BodyM style={styles.backChipText}>Back</BodyM>
            </Pressable>
          </View>

          <View style={styles.periodRow}>
            {PERIOD_OPTIONS.map((option) => {
              const selected = option.value === period;

              return (
                <Pressable
                  key={option.value}
                  onPress={() => setPeriod(option.value)}
                  style={[styles.periodChip, selected && styles.periodChipSelected]}
                >
                  <BodyM style={[styles.periodChipText, selected && styles.periodChipTextSelected]}>{option.label}</BodyM>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.heroCard}>
            {isLoading ? (
              <ActivityIndicator color={COLORS.gold} size="small" />
            ) : (
              <>
                <Heading2 style={styles.heroAmount}>{formatCurrency(stats.total_earnings)}</Heading2>
                <BodyM style={styles.heroSubText}>{`${stats.delivery_count} deliveries`}</BodyM>
              </>
            )}
          </View>

          <View style={styles.card}>
            <LabelM style={styles.kicker}>Breakdown</LabelM>

            {isLoading ? (
              <BodyM style={styles.mutedText}>Loading breakdown...</BodyM>
            ) : stats.breakdown_by_day.length === 0 ? (
              <BodyM style={styles.mutedText}>No earnings recorded for this period.</BodyM>
            ) : (
              <View style={styles.breakdownList}>
                {stats.breakdown_by_day.map((row) => (
                  <View key={`${row.day}-${row.delivery_count}`} style={styles.breakdownRow}>
                    <BodyM style={styles.breakdownDay}>{toDayName(row.day)}</BodyM>
                    <BodyM style={styles.breakdownAmount}>{`${formatCurrency(row.earnings)} (${row.delivery_count} deliveries)`}</BodyM>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.payoutCard}>
            <LabelM style={styles.kicker}>Payout</LabelM>
            <BodyM style={styles.payoutTitle}>{`Next payout: ${payoutAmount} on ${getNextFridayLabel()}`}</BodyM>
            <BodyM style={styles.mutedText}>Final payout amount is processed after weekly reconciliation.</BodyM>
          </View>
        </ScrollView>
        <AgentBottomNav activeTab="earnings" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.forestDark,
    flex: 1,
  },
  screenWrap: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: SPACING.lg,
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingVertical: SPACING.xl,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backChip: {
    backgroundColor: COLORS.forestMid,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
  },
  backChipText: {
    color: COLORS.cream,
  },
  periodRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  periodChip: {
    backgroundColor: COLORS.forestMid,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
  },
  periodChipSelected: {
    backgroundColor: COLORS.gold,
  },
  periodChipText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  periodChipTextSelected: {
    color: COLORS.forestDark,
  },
  heroCard: {
    alignItems: 'center',
    backgroundColor: COLORS.forestMid,
    borderRadius: RADIUS.xl,
    minHeight: 150,
    justifyContent: 'center',
    padding: LAYOUT.cardPaddingLarge,
  },
  heroAmount: {
    color: COLORS.gold,
    fontSize: 52,
    lineHeight: 58,
  },
  heroSubText: {
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  card: {
    backgroundColor: COLORS.forestMid,
    borderRadius: RADIUS.xl,
    gap: SPACING.sm,
    padding: LAYOUT.cardPaddingLarge,
  },
  kicker: {
    color: COLORS.gold,
  },
  mutedText: {
    color: COLORS.textMuted,
  },
  breakdownList: {
    gap: SPACING.sm,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownDay: {
    color: COLORS.cream,
  },
  breakdownAmount: {
    color: COLORS.gold,
  },
  payoutCard: {
    backgroundColor: 'rgba(24,63,58,0.8)',
    borderColor: COLORS.forestLight,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.sm,
    padding: LAYOUT.cardPaddingLarge,
  },
  payoutTitle: {
    color: COLORS.cream,
  },
});
