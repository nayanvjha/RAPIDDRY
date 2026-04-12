import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { BodyM, Button, DisplayL, LabelM } from '../components/ui';
import { COLORS, LAYOUT, RADIUS, SPACING } from '../constants';
import api from '../services/api';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'AgentTaskDetail'>;

type AgentOrder = {
  delivery_id: string;
  order_id: string;
  delivery_type: string;
  delivery_status: string;
  order_number: string;
  order_status: string;
  total: number | string;
  customer_name: string | null;
  customer_phone: string | null;
  full_address: string | null;
  items_count: number | string;
};

type DeliveryStatusResponse = {
  status: string;
};

const formatCurrency = (amount: number) => `₹${Math.max(0, amount).toLocaleString('en-IN')}`;

export const AgentTaskDetailScreen = ({ navigation, route }: Props) => {
  const taskId = route.params?.taskId ?? 'task-pending';

  const [order, setOrder] = useState<AgentOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const loadTaskDetail = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get<{ success: boolean; data: AgentOrder[] }>('/orders');
      const deliveries = response.data?.data ?? [];
      const selected = deliveries.find((item) => item.delivery_id === taskId) ?? null;
      setOrder(selected);
    } catch {
      Alert.alert('Task Error', 'Unable to load task details right now.');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    loadTaskDetail();
  }, [loadTaskDetail]);

  const deliveryStatus = (order?.delivery_status || '').toLowerCase();
  const customerName = order?.customer_name?.trim() || 'Customer';
  const customerPhone = order?.customer_phone?.trim() || '';
  const addressText = order?.full_address?.trim() || 'Address not available';
  const itemCount = Number(order?.items_count ?? 0);
  const orderTotal = Number(order?.total ?? 0);

  const canCall = useMemo(() => customerPhone.length > 0, [customerPhone]);

  const handleCallCustomer = async () => {
    if (!canCall) {
      Alert.alert('Phone Missing', 'Customer phone is not available for this order.');
      return;
    }

    const telValue = customerPhone.startsWith('+') ? customerPhone : `+91${customerPhone}`;
    const telUrl = `tel:${telValue}`;

    const supported = await Linking.canOpenURL(telUrl);
    if (!supported) {
      Alert.alert('Call Failed', 'Unable to open the phone dialer on this device.');
      return;
    }

    await Linking.openURL(telUrl);
  };

  const handleAcceptPickup = async () => {
    if (!order || isActionLoading) {
      return;
    }

    setIsActionLoading(true);
    try {
      const response = await api.patch<{ success: boolean; data: DeliveryStatusResponse }>(
        `/orders/${order.delivery_id}/accept`
      );
      const nextStatus = response.data?.data?.status || 'accepted';
      setOrder((prev) => (prev ? { ...prev, delivery_status: nextStatus } : prev));
    } catch {
      Alert.alert('Action Failed', 'Could not accept this pickup. Please try again.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleArrivedAtLocation = async () => {
    if (!order || isActionLoading) {
      return;
    }

    setIsActionLoading(true);
    try {
      const response = await api.patch<{ success: boolean; data: DeliveryStatusResponse }>(
        `/orders/${order.delivery_id}/status`,
        { status: 'arrived' }
      );
      const nextStatus = response.data?.data?.status || 'arrived';
      setOrder((prev) => (prev ? { ...prev, delivery_status: nextStatus } : prev));
    } catch {
      Alert.alert('Action Failed', 'Could not update arrival status. Please try again.');
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>{'<'}</Text>
          </Pressable>
          <LabelM style={styles.headerTitle}>{`Pickup from ${customerName}`}</LabelM>
        </View>

        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={COLORS.gold} size="small" />
            <BodyM style={styles.loadingText}>Loading task details...</BodyM>
          </View>
        ) : !order ? (
          <View style={styles.card}>
            <BodyM style={styles.description}>Task not found. Please go back and try another order.</BodyM>
          </View>
        ) : (
          <>
            <View style={styles.mapPlaceholder}>
              <View style={styles.mapPinWrap}>
                <Text style={styles.mapPinText}>PIN</Text>
              </View>
              <DisplayL style={styles.mapAddress}>{addressText}</DisplayL>
              <BodyM style={styles.distanceText}>Distance: N/A</BodyM>
            </View>

            <View style={styles.card}>
              <LabelM style={styles.kicker}>Customer Info</LabelM>
              <Pressable onPress={handleCallCustomer} style={styles.phoneRow}>
                <Text style={styles.phoneIconText}>CALL</Text>
                <BodyM style={styles.phoneText}>{customerPhone || 'Phone unavailable'}</BodyM>
              </Pressable>
            </View>

            <View style={styles.card}>
              <LabelM style={styles.kicker}>Order Summary</LabelM>
              <View style={styles.summaryRow}>
                <BodyM style={styles.summaryLabel}>Item Count</BodyM>
                <BodyM>{itemCount}</BodyM>
              </View>
              <View style={styles.summaryRow}>
                <BodyM style={styles.summaryLabel}>Order Total</BodyM>
                <BodyM>{formatCurrency(orderTotal)}</BodyM>
              </View>
            </View>

            <View style={styles.actionWrap}>
              {deliveryStatus === 'assigned' ? (
                <Button disabled={isActionLoading} onPress={handleAcceptPickup}>
                  {isActionLoading ? 'Updating...' : 'Accept Pickup'}
                </Button>
              ) : null}

              {deliveryStatus === 'accepted' ? (
                <Button disabled={isActionLoading} onPress={handleArrivedAtLocation}>
                  {isActionLoading ? 'Updating...' : 'Arrived at Location'}
                </Button>
              ) : null}

              {deliveryStatus === 'arrived' ? (
                <Button onPress={() => navigation.navigate('AgentVerifyItems', { taskId: order.delivery_id })}>
                  Verify Items
                </Button>
              ) : null}

              {deliveryStatus === 'completed' ? (
                <View style={styles.completedBadge}>
                  <BodyM style={styles.completedBadgeText}>Completed ✓</BodyM>
                </View>
              ) : null}
            </View>
          </>
        )}

        <View style={styles.metaWrap}>
          <BodyM style={styles.metaText}>{`Order #${order?.order_number || 'N/A'}`}</BodyM>
          <BodyM style={styles.metaText}>{`Task ID: ${taskId}`}</BodyM>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.forestDark,
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
    gap: SPACING.sm,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: COLORS.forestMid,
    borderRadius: RADIUS.pill,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  backButtonText: {
    color: COLORS.cream,
    fontSize: 18,
    lineHeight: 22,
  },
  headerTitle: {
    color: COLORS.cream,
    flex: 1,
    fontSize: 17,
    lineHeight: 24,
  },
  loadingWrap: {
    alignItems: 'center',
    backgroundColor: COLORS.forestMid,
    borderRadius: RADIUS.xl,
    padding: LAYOUT.cardPaddingLarge,
  },
  loadingText: {
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
  },
  mapPlaceholder: {
    alignItems: 'flex-start',
    backgroundColor: '#2A3432',
    borderColor: '#3E4B47',
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.sm,
    minHeight: 196,
    padding: LAYOUT.cardPaddingLarge,
  },
  mapPinWrap: {
    alignItems: 'center',
    backgroundColor: COLORS.forestDark,
    borderRadius: RADIUS.pill,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  mapPinText: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  mapAddress: {
    color: COLORS.cream,
    fontSize: 24,
    lineHeight: 31,
  },
  distanceText: {
    color: COLORS.textMuted,
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
  description: {
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
  },
  phoneRow: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.forestLight,
    borderRadius: RADIUS.pill,
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  phoneText: {
    color: COLORS.cream,
    textDecorationLine: 'underline',
  },
  phoneIconText: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: COLORS.textMuted,
  },
  actionWrap: {
    minHeight: 56,
  },
  completedBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#2F8D61',
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  completedBadgeText: {
    color: COLORS.white,
  },
  metaWrap: {
    gap: 2,
    marginTop: SPACING.sm,
  },
  metaText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
});
