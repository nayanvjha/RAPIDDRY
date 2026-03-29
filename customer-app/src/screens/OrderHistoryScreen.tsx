import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';

import { BottomNavBar } from '../components/shared/BottomNavBar';
import { Button, BodyM, Heading1, LabelL, StatusBadge, Status } from '../components/ui';
import { COLORS, FONTS, LAYOUT, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../constants';
import api from '../services/api';

type OrderStatus =
  | 'placed'
  | 'agent_assigned'
  | 'picked_up'
  | 'processing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

type OrderItem = {
  id: string;
  order_number: string;
  status: OrderStatus;
  item_count: number | string;
  total: number | string;
  created_at: string;
};

type ApiSuccessResponse<T> = {
  success: boolean;
  data: T;
};

type OrdersTab = 'Active' | 'Past';

const PAST_STATUSES: OrderStatus[] = ['delivered', 'cancelled'];

const formatCurrency = (value: number | string) => {
  const parsed = Number(value);
  const safeValue = Number.isFinite(parsed) ? parsed : 0;
  return `\u20B9${Math.round(safeValue)}`;
};

const formatOrderDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const getBadgeConfig = (status: OrderStatus): { badgeStatus: Status; label: string } => {
  const statusMap: Record<OrderStatus, { badgeStatus: Status; label: string }> = {
    placed: { badgeStatus: 'pending', label: 'Placed' },
    agent_assigned: { badgeStatus: 'info', label: 'Agent Assigned' },
    picked_up: { badgeStatus: 'info', label: 'Picked Up' },
    processing: { badgeStatus: 'warning', label: 'Processing' },
    ready: { badgeStatus: 'info', label: 'Ready' },
    out_for_delivery: { badgeStatus: 'pending', label: 'Out for Delivery' },
    delivered: { badgeStatus: 'success', label: 'Delivered' },
    cancelled: { badgeStatus: 'error', label: 'Cancelled' },
  };

  return statusMap[status] ?? { badgeStatus: 'pending', label: 'Placed' };
};

const OrdersSkeleton = () => {
  return (
    <View style={styles.skeletonWrap}>
      {Array.from({ length: 4 }).map((_, index) => (
        <View key={`order-skeleton-${index}`} style={styles.skeletonCard}>
          <View style={styles.skeletonTopRow}>
            <View style={styles.skeletonOrderId} />
            <View style={styles.skeletonBadge} />
          </View>
          <View style={styles.skeletonBodyLine} />
          <View style={styles.skeletonBodyLineShort} />
        </View>
      ))}
    </View>
  );
};

export const OrderHistoryScreen = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const [selectedTab, setSelectedTab] = useState<OrdersTab>('Active');
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get<ApiSuccessResponse<OrderItem[]>>('/orders');

        if (!isMounted) {
          return;
        }

        setOrders(response.data?.data ?? []);
        setError(null);
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }

        setOrders([]);
        setError('Unable to load orders');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeOrders = useMemo(() => {
    return orders.filter((order) => !PAST_STATUSES.includes(order.status));
  }, [orders]);

  const pastOrders = useMemo(() => {
    return orders.filter((order) => PAST_STATUSES.includes(order.status));
  }, [orders]);

  const visibleOrders = selectedTab === 'Active' ? activeOrders : pastOrders;
  const hasNoOrders = !loading && orders.length === 0;

  const handleOrderPress = (orderId: string) => {
    navigation.navigate('OrderTracking', { orderId });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Heading1 style={styles.title}>My Orders</Heading1>
        </View>

        <View style={styles.tabsWrap}>
          {(['Active', 'Past'] as OrdersTab[]).map((tab) => {
            const isActive = selectedTab === tab;

            return (
              <Pressable key={tab} onPress={() => setSelectedTab(tab)} style={styles.tabButton}>
                <LabelL style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab}</LabelL>
                <View style={[styles.tabUnderline, isActive && styles.tabUnderlineActive]} />
              </Pressable>
            );
          })}
        </View>

        {loading ? (
          <OrdersSkeleton />
        ) : hasNoOrders ? (
          <View style={styles.emptyStateWrap}>
            <View style={styles.emptyIconWrap}>
              <Feather name="inbox" size={36} color={COLORS.gold} />
            </View>
            <Heading1 style={styles.emptyTitle}>No orders yet</Heading1>
            <BodyM style={styles.emptySubtitle}>Start by choosing a service to place your first order.</BodyM>
            <View style={styles.emptyCtaWrap}>
              <Button onPress={() => navigation.navigate('Home')} variant="primary">
                Browse Services
              </Button>
            </View>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={styles.listContent}
            data={visibleOrders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const badge = getBadgeConfig(item.status);
              const parsedItemCount = Number(item.item_count);
              const itemCount = Number.isFinite(parsedItemCount) ? parsedItemCount : 0;

              return (
                <Pressable
                  onPress={() => handleOrderPress(item.id)}
                  style={({ pressed }) => [styles.orderCard, pressed && styles.orderCardPressed]}
                >
                  <View style={styles.orderTopRow}>
                    <LabelL style={styles.orderNumber}>{item.order_number}</LabelL>
                    <StatusBadge label={badge.label} status={badge.badgeStatus} />
                  </View>

                  <View style={styles.orderMetaRow}>
                    <BodyM style={styles.orderMetaText}>{`${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}</BodyM>
                    <BodyM style={styles.orderMetaText}>•</BodyM>
                    <BodyM style={styles.orderMetaText}>{formatOrderDate(item.created_at)}</BodyM>
                  </View>

                  <View style={styles.orderBottomRow}>
                    <LabelL style={styles.totalText}>{formatCurrency(item.total)}</LabelL>

                    {PAST_STATUSES.includes(item.status) ? (
                      <Pressable
                        onPress={() => Alert.alert('Reorder', 'Coming soon')}
                        style={styles.reorderButton}
                      >
                        <BodyM style={styles.reorderText}>Reorder</BodyM>
                      </Pressable>
                    ) : null}
                  </View>
                </Pressable>
              );
            }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyListWrap}>
                <BodyM style={styles.emptyListText}>{`No ${selectedTab.toLowerCase()} orders right now`}</BodyM>
              </View>
            }
          />
        )}

        {error ? <BodyM style={styles.errorText}>{error}</BodyM> : null}

        <BottomNavBar activeTab="Orders" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.cream,
    flex: 1,
  },
  container: {
    backgroundColor: COLORS.cream,
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.cream,
    borderBottomColor: 'rgba(15,46,42,0.08)',
    borderBottomWidth: 1,
    minHeight: 56,
    justifyContent: 'center',
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingVertical: 8,
  },
  title: {
    color: COLORS.forestDark,
  },
  tabsWrap: {
    backgroundColor: COLORS.cream,
    borderBottomColor: COLORS.creamDark,
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
  },
  tabButton: {
    alignItems: 'center',
    paddingBottom: SPACING.sm,
    paddingTop: SPACING.base,
    width: 110,
  },
  tabLabel: {
    color: COLORS.textMuted,
    fontFamily: FONTS.bodyMedium,
  },
  tabLabelActive: {
    color: COLORS.forestDark,
    fontFamily: FONTS.bodySemiBold,
  },
  tabUnderline: {
    borderRadius: RADIUS.pill,
    height: 3,
    marginTop: SPACING.xs,
    width: 42,
  },
  tabUnderlineActive: {
    backgroundColor: COLORS.forestDark,
  },
  listContent: {
    paddingBottom: 92,
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingTop: SPACING.base,
  },
  orderCard: {
    ...SHADOWS.elevation1,
    backgroundColor: COLORS.white,
    borderColor: COLORS.creamDark,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    marginBottom: SPACING.base,
    padding: SPACING.base,
  },
  orderCardPressed: {
    opacity: 0.95,
  },
  orderTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  orderNumber: {
    color: COLORS.forestDark,
    fontFamily: FONTS.displaySemiBold,
    fontSize: TYPOGRAPHY.heading2.fontSize,
    lineHeight: TYPOGRAPHY.heading2.lineHeight,
  },
  orderMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: SPACING.md,
  },
  orderMetaText: {
    color: COLORS.textSecondary,
  },
  orderBottomRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalText: {
    color: COLORS.forestDark,
  },
  reorderButton: {
    backgroundColor: COLORS.goldPale,
    borderColor: COLORS.gold,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    minHeight: 34,
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
  },
  reorderText: {
    color: COLORS.forestDark,
    fontFamily: FONTS.bodySemiBold,
  },
  skeletonWrap: {
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingTop: SPACING.base,
  },
  skeletonCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.creamDark,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    marginBottom: SPACING.base,
    padding: SPACING.base,
  },
  skeletonTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  skeletonOrderId: {
    backgroundColor: COLORS.creamDark,
    borderRadius: 6,
    height: 18,
    width: '34%',
  },
  skeletonBadge: {
    backgroundColor: COLORS.creamDark,
    borderRadius: RADIUS.pill,
    height: 28,
    width: 92,
  },
  skeletonBodyLine: {
    backgroundColor: COLORS.creamDark,
    borderRadius: 6,
    height: 14,
    marginBottom: SPACING.sm,
    width: '64%',
  },
  skeletonBodyLineShort: {
    backgroundColor: COLORS.creamDark,
    borderRadius: 6,
    height: 14,
    width: '42%',
  },
  emptyStateWrap: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 84,
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
  },
  emptyIconWrap: {
    alignItems: 'center',
    backgroundColor: COLORS.goldPale,
    borderRadius: RADIUS.pill,
    height: 84,
    justifyContent: 'center',
    marginBottom: SPACING.base,
    width: 84,
  },
  emptyTitle: {
    color: COLORS.forestDark,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  emptyCtaWrap: {
    marginTop: SPACING.xl,
    width: '100%',
  },
  emptyListWrap: {
    alignItems: 'center',
    paddingVertical: SPACING['2xl'],
  },
  emptyListText: {
    color: COLORS.textSecondary,
  },
  errorText: {
    color: COLORS.statusError,
    paddingBottom: SPACING.sm,
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
  },
});
