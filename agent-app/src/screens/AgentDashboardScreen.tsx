import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { Button, BodyM, DisplayL, Heading2, LabelM } from '../components/ui';
import { AgentBottomNav } from '../components/shared/AgentBottomNav';
import { COLORS, LAYOUT, RADIUS, SPACING } from '../constants';
import api from '../services/api';
import { useAgentAuthStore } from '../store/authStore';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'AgentDashboard'>;

type EarningsResponse = {
  period: 'today' | 'week' | 'month';
  total_earnings: number;
  delivery_count: number;
};

type AgentOrder = {
  delivery_id: string;
  order_id: string;
  delivery_type: string;
  delivery_status: string;
  order_number: string;
  order_status: string;
  customer_name: string | null;
  full_address: string | null;
  items_count: number | string;
};

type AgentRecord = {
  is_online: boolean;
};

const truncateText = (value: string | null | undefined, maxLength = 46) => {
  if (!value) {
    return 'Address not available';
  }

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}...`;
};

const formatCurrency = (amount: number) => {
  return `₹${Math.max(0, amount).toLocaleString('en-IN')}`;
};

const getStatusBadgeColor = (status: string) => {
  const normalized = status.toLowerCase();

  if (normalized === 'arrived' || normalized === 'accepted') {
    return '#3FA37A';
  }

  if (normalized === 'pending') {
    return '#D49F31';
  }

  return COLORS.forestLight;
};

export const AgentDashboardScreen = ({ navigation }: Props) => {
  const user = useAgentAuthStore((state) => state.user);
  const [isOnline, setIsOnline] = useState(false);
  const [isAvailabilityUpdating, setIsAvailabilityUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deliveriesToday, setDeliveriesToday] = useState(0);
  const [earningsToday, setEarningsToday] = useState(0);
  const [orders, setOrders] = useState<AgentOrder[]>([]);

  const loadDashboardData = useCallback(async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const [earningsResponse, ordersResponse] = await Promise.all([
        api.get<{ success: boolean; data: EarningsResponse }>('/earnings', {
          params: { period: 'today' },
        }),
        api.get<{ success: boolean; data: AgentOrder[] }>('/orders'),
      ]);

      const earningsData = earningsResponse.data.data;
      const ordersData = ordersResponse.data.data ?? [];

      setDeliveriesToday(Number(earningsData?.delivery_count ?? 0));
      setEarningsToday(Number(earningsData?.total_earnings ?? 0));
      setOrders(ordersData);
    } catch {
      Alert.alert('Dashboard Error', 'Unable to load dashboard data right now.');
    } finally {
      if (refresh) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [loadDashboardData])
  );

  const activeOrderCards = useMemo(() => {
    return orders.map((order) => ({
      ...order,
      normalizedItemsCount: Number(order.items_count ?? 0),
      statusLabel: order.delivery_status || order.order_status,
    }));
  }, [orders]);

  const handleToggleAvailability = async (nextOnlineValue: boolean) => {
    if (isAvailabilityUpdating) {
      return;
    }

    const previousValue = isOnline;
    setIsOnline(nextOnlineValue);
    setIsAvailabilityUpdating(true);

    try {
      const response = await api.patch<{ success: boolean; data: AgentRecord }>('/availability', {
        is_online: nextOnlineValue,
      });

      setIsOnline(Boolean(response.data?.data?.is_online));
    } catch {
      setIsOnline(previousValue);
      Alert.alert('Update Failed', 'Could not update your availability. Please try again.');
    } finally {
      setIsAvailabilityUpdating(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screenWrap}>
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => loadDashboardData(true)} />}
        >
          <View style={styles.headerRow}>
            <View>
              <LabelM style={styles.kicker}>Rapidry Agent</LabelM>
              <DisplayL>{user?.name?.trim() || 'Agent Dashboard'}</DisplayL>
            </View>

            <View style={styles.statusWrap}>
              <View style={[styles.onlineDot, isOnline ? styles.onlineDotActive : styles.onlineDotInactive]} />
              <BodyM style={styles.statusText}>{isOnline ? 'Online' : 'Offline'}</BodyM>
              <Switch
                disabled={isAvailabilityUpdating}
                onValueChange={handleToggleAvailability}
                thumbColor={isOnline ? COLORS.gold : '#8A9B98'}
                trackColor={{ false: '#2E4B46', true: '#39635B' }}
                value={isOnline}
              />
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <LabelM style={styles.statLabel}>Deliveries</LabelM>
              <Heading2>{deliveriesToday}</Heading2>
              <BodyM style={styles.statFootnote}>Today</BodyM>
            </View>

            <View style={styles.statCard}>
              <LabelM style={styles.statLabel}>Earnings</LabelM>
              <Heading2>{formatCurrency(earningsToday)}</Heading2>
              <BodyM style={styles.statFootnote}>Today</BodyM>
            </View>

            <View style={styles.statCard}>
              <LabelM style={styles.statLabel}>Rating</LabelM>
              <Heading2>4.9 ⭐</Heading2>
              <BodyM style={styles.statFootnote}>This Week</BodyM>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Heading2>Active Orders</Heading2>
          </View>

          {isLoading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color={COLORS.gold} />
              <BodyM style={styles.loadingText}>Loading active orders...</BodyM>
            </View>
          ) : activeOrderCards.length === 0 ? (
            <View style={styles.emptyWrap}>
              <BodyM style={styles.emptyText}>No active orders. Go online to receive orders!</BodyM>
            </View>
          ) : (
            <View style={styles.ordersList}>
              {activeOrderCards.map((order) => (
                <View key={order.delivery_id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <LabelM style={styles.orderNumber}>{order.order_number || order.order_id}</LabelM>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusBadgeColor(order.statusLabel) }]}>
                      <BodyM style={styles.statusBadgeText}>{order.statusLabel}</BodyM>
                    </View>
                  </View>

                  <BodyM style={styles.orderMeta}>{order.customer_name || 'Customer unavailable'}</BodyM>
                  <BodyM style={styles.orderMeta}>{truncateText(order.full_address)}</BodyM>
                  <BodyM style={styles.orderMeta}>{`${order.normalizedItemsCount} items`}</BodyM>

                  <View style={styles.orderActionRow}>
                    <Button
                      fullWidth={false}
                      onPress={() => navigation.navigate('AgentTaskDetail', { taskId: order.delivery_id })}
                      variant="secondary"
                    >
                      View Details
                    </Button>
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={styles.bottomSpacer}>
            <Button onPress={() => navigation.navigate('AgentEarnings')} variant="ghost">
              View Full Earnings
            </Button>
          </View>
        </ScrollView>
        <AgentBottomNav activeTab="dashboard" />
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
    gap: SPACING.base,
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingVertical: SPACING.xl,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  kicker: {
    color: COLORS.gold,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
  },
  statusWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  onlineDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  onlineDotActive: {
    backgroundColor: '#34D399',
  },
  onlineDotInactive: {
    backgroundColor: '#64748B',
  },
  statusText: {
    color: COLORS.textOnDark,
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  statCard: {
    backgroundColor: COLORS.forestMid,
    borderRadius: RADIUS.xl,
    gap: SPACING.sm,
    minHeight: 108,
    padding: SPACING.md,
    width: '31.5%',
  },
  statLabel: {
    color: COLORS.gold,
    fontSize: 11,
  },
  statFootnote: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  sectionHeader: {
    marginTop: SPACING.lg,
  },
  loadingWrap: {
    alignItems: 'center',
    backgroundColor: COLORS.forestMid,
    borderRadius: RADIUS.lg,
    marginTop: SPACING.md,
    padding: SPACING.lg,
  },
  loadingText: {
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
  },
  emptyWrap: {
    backgroundColor: COLORS.forestMid,
    borderRadius: RADIUS.lg,
    marginTop: SPACING.md,
    padding: SPACING.lg,
  },
  emptyText: {
    color: COLORS.textMuted,
  },
  ordersList: {
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  orderCard: {
    backgroundColor: COLORS.forestMid,
    borderColor: COLORS.forestLight,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.sm,
    padding: SPACING.md,
  },
  orderHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderNumber: {
    color: COLORS.gold,
  },
  statusBadge: {
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  statusBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    lineHeight: 16,
  },
  orderMeta: {
    color: COLORS.textOnDark,
  },
  orderActionRow: {
    alignItems: 'flex-start',
    marginTop: SPACING.xs,
  },
  bottomSpacer: {
    marginTop: SPACING.md,
  },
});
