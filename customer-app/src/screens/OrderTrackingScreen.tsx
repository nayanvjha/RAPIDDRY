import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';

import { BodyM, Heading1, LabelL } from '../components/ui';
import { COLORS, FONTS, LAYOUT, RADIUS, SPACING, TYPOGRAPHY } from '../constants';
import api from '../services/api';

type OrderTrackingRouteParams = {
  orderId: string;
};

type ApiSuccessResponse<T> = {
  success: boolean;
  data: T;
};

type OrderDetail = {
  id: string;
  order_number: string;
  status:
    | 'placed'
    | 'agent_assigned'
    | 'picked_up'
    | 'processing'
    | 'ready'
    | 'out_for_delivery'
    | 'delivered'
    | 'cancelled';
  created_at?: string;
  updated_at?: string;
};

type TimelineStep = {
  key: Exclude<OrderDetail['status'], 'cancelled'>;
  label: string;
};

const STATUS_STEPS: TimelineStep[] = [
  { key: 'placed', label: 'Placed' },
  { key: 'agent_assigned', label: 'Agent Assigned' },
  { key: 'picked_up', label: 'Picked Up' },
  { key: 'processing', label: 'Processing' },
  { key: 'ready', label: 'Ready' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
];

const TrackingSkeleton = () => {
  return (
    <View style={styles.skeletonWrap}>
      {Array.from({ length: STATUS_STEPS.length }).map((_, index) => (
        <View key={`skeleton-step-${index}`} style={styles.skeletonRow}>
          <View style={styles.skeletonDot} />
          <View style={styles.skeletonTextWrap}>
            <View style={styles.skeletonLabel} />
            <View style={styles.skeletonTime} />
          </View>
        </View>
      ))}
    </View>
  );
};

const formatTimestamp = (value?: string) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const OrderTrackingScreen = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, OrderTrackingRouteParams>, string>>();
  const pulseAnim = useRef(new Animated.Value(0.45)).current;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.45,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [pulseAnim]);

  useEffect(() => {
    let isMounted = true;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await api.get<ApiSuccessResponse<OrderDetail>>(`/orders/${route.params.orderId}`);

        if (!isMounted) {
          return;
        }

        setOrder(response.data?.data ?? null);
        setError(null);
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }

        setError('Unable to load tracking details');
        setOrder(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrder();

    return () => {
      isMounted = false;
    };
  }, [route.params.orderId]);

  const currentStatusIndex = useMemo(() => {
    const statusKey = order?.status ?? 'placed';
    const stepIndex = STATUS_STEPS.findIndex((step) => step.key === statusKey);

    return stepIndex === -1 ? 0 : stepIndex;
  }, [order?.status]);

  const headerOrderNumber = order?.order_number ?? `RD-${route.params.orderId.slice(0, 4).toUpperCase()}`;

  const getStepTimestamp = (stepKey: TimelineStep['key']) => {
    if (!order) {
      return null;
    }

    if (stepKey === 'placed') {
      return formatTimestamp(order.created_at);
    }

    if (stepKey === order.status) {
      return formatTimestamp(order.updated_at);
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={22} color={COLORS.forestDark} />
          </Pressable>

          <Heading1 style={styles.title}>{`Order #${headerOrderNumber}`}</Heading1>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {loading ? (
            <TrackingSkeleton />
          ) : (
            <View style={styles.timelineWrap}>
              {STATUS_STEPS.map((step, index) => {
                const isCompleted = index < currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                const isPending = index > currentStatusIndex;
                const timestamp = getStepTimestamp(step.key);

                return (
                  <View key={step.key} style={styles.timelineRow}>
                    <View style={styles.markerColumn}>
                      <View
                        style={[
                          styles.marker,
                          isCompleted && styles.markerCompleted,
                          isPending && styles.markerPending,
                          isCurrent && styles.markerCurrent,
                        ]}
                      >
                        {isCompleted ? (
                          <Feather name="check" size={12} color={COLORS.white} />
                        ) : isCurrent ? (
                          <Animated.View style={[styles.currentPulseDot, { opacity: pulseAnim }]} />
                        ) : null}
                      </View>

                      {index < STATUS_STEPS.length - 1 ? (
                        <View
                          style={[
                            styles.connector,
                            (isCompleted || isCurrent) && styles.connectorActive,
                          ]}
                        />
                      ) : null}
                    </View>

                    <View style={styles.stepContent}>
                      <LabelL
                        style={[
                          styles.stepLabel,
                          isPending && styles.stepLabelPending,
                          isCurrent && styles.stepLabelCurrent,
                        ]}
                      >
                        {step.label}
                      </LabelL>
                      {timestamp ? <BodyM style={styles.stepTimestamp}>{timestamp}</BodyM> : null}
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          <View style={styles.estimatedCard}>
            <LabelL style={styles.estimatedTitle}>Estimated delivery: Tomorrow by 6 PM</LabelL>
          </View>

          <View style={styles.agentCard}>
            <LabelL style={styles.agentTitle}>Agent Info</LabelL>
            <BodyM style={styles.agentText}>Agent will be assigned shortly</BodyM>
          </View>

          {error ? <BodyM style={styles.errorText}>{error}</BodyM> : null}

          <Pressable style={styles.helpLinkWrap}>
            <BodyM style={styles.helpLinkText}>Need Help?</BodyM>
          </Pressable>
        </ScrollView>
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
  content: {
    paddingBottom: SPACING['3xl'],
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingTop: SPACING.base,
  },
  header: {
    alignItems: 'center',
    backgroundColor: COLORS.cream,
    borderBottomColor: 'rgba(15,46,42,0.08)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 56,
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingVertical: 8,
  },
  backButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  title: {
    color: COLORS.forestDark,
    flex: 1,
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  skeletonWrap: {
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  skeletonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    minHeight: 50,
  },
  skeletonDot: {
    backgroundColor: COLORS.creamDark,
    borderRadius: RADIUS.pill,
    height: 20,
    marginTop: 4,
    width: 20,
  },
  skeletonTextWrap: {
    flex: 1,
    gap: 6,
  },
  skeletonLabel: {
    backgroundColor: COLORS.creamDark,
    borderRadius: 6,
    height: 16,
    width: '52%',
  },
  skeletonTime: {
    backgroundColor: COLORS.creamDark,
    borderRadius: 6,
    height: 14,
    width: '36%',
  },
  timelineWrap: {
    marginBottom: SPACING.xl,
  },
  timelineRow: {
    flexDirection: 'row',
    minHeight: 72,
  },
  markerColumn: {
    alignItems: 'center',
    width: 30,
  },
  marker: {
    alignItems: 'center',
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
    borderRadius: RADIUS.pill,
    borderWidth: 1.5,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  markerCompleted: {
    backgroundColor: COLORS.statusSuccess,
    borderColor: COLORS.statusSuccess,
  },
  markerCurrent: {
    backgroundColor: COLORS.goldPale,
    borderColor: COLORS.gold,
  },
  markerPending: {
    backgroundColor: COLORS.creamDark,
    borderColor: COLORS.textMuted,
  },
  currentPulseDot: {
    backgroundColor: COLORS.gold,
    borderRadius: RADIUS.pill,
    height: 9,
    width: 9,
  },
  connector: {
    backgroundColor: COLORS.textMuted,
    marginBottom: -2,
    marginTop: 4,
    minHeight: 48,
    width: 2,
  },
  connectorActive: {
    backgroundColor: COLORS.gold,
  },
  stepContent: {
    flex: 1,
    paddingBottom: SPACING.base,
    paddingLeft: SPACING.sm,
  },
  stepLabel: {
    color: COLORS.forestDark,
  },
  stepLabelCurrent: {
    color: COLORS.gold,
    fontFamily: FONTS.bodySemiBold,
  },
  stepLabelPending: {
    color: COLORS.textMuted,
    fontFamily: FONTS.bodyMedium,
  },
  stepTimestamp: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.caption.fontSize,
    lineHeight: TYPOGRAPHY.caption.lineHeight,
    marginTop: 2,
  },
  estimatedCard: {
    backgroundColor: COLORS.forestDark,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.base,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
  },
  estimatedTitle: {
    color: COLORS.textOnDark,
  },
  agentCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.creamDark,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: 2,
    marginBottom: SPACING.base,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
  },
  agentTitle: {
    color: COLORS.forestDark,
  },
  agentText: {
    color: COLORS.textSecondary,
  },
  errorText: {
    color: COLORS.statusError,
    marginBottom: SPACING.sm,
  },
  helpLinkWrap: {
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  helpLinkText: {
    color: COLORS.gold,
    fontFamily: FONTS.bodySemiBold,
    textDecorationLine: 'underline',
  },
});
