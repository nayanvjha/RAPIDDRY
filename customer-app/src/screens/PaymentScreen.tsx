import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { Button, BodyM, Heading1, LabelL } from '../components/ui';
import { COLORS, FONTS, LAYOUT, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../constants';
import api from '../services/api';
import { useCartStore } from '../store/cartStore';

type PaymentMethod = 'upi' | 'card' | 'cod';

type PaymentRouteParams = {
  addressId: string;
  pickupDate: string;
  pickupSlot: string;
  specialInstructions?: string;
  couponCode: string | null;
  total: number;
};

type ApiSuccessResponse<T> = {
  success: boolean;
  data: T;
};

type CreatedOrder = {
  id: string;
  order_number: string;
};

const PAYMENT_METHODS: Array<{
  id: PaymentMethod;
  title: string;
  icon: keyof typeof Feather.glyphMap;
  description: string;
}> = [
  {
    id: 'upi',
    title: 'UPI',
    icon: 'smartphone',
    description: 'Google Pay, PhonePe, BHIM',
  },
  {
    id: 'card',
    title: 'Credit/Debit Card',
    icon: 'credit-card',
    description: 'Visa, Mastercard, RuPay',
  },
  {
    id: 'cod',
    title: 'Cash on Delivery',
    icon: 'dollar-sign',
    description: 'Pay when your order arrives',
  },
];

const formatCurrency = (value: number) => {
  return `\u20B9${Math.round(value)}`;
};

const toApiDate = (pickupDate: string) => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(pickupDate)) {
    return pickupDate;
  }

  const date = new Date(pickupDate);
  if (Number.isNaN(date.getTime())) {
    return pickupDate;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const PaymentScreen = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, PaymentRouteParams>, string>>();

  const { addressId, pickupDate, pickupSlot, specialInstructions, couponCode, total } = route.params;

  const cartItemsMap = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cartLines = useMemo(() => {
    return Object.values(cartItemsMap);
  }, [cartItemsMap]);

  const handlePay = async () => {
    if (cartLines.length === 0) {
      Alert.alert('Cart Empty', 'Please add at least one item before placing an order.');
      return;
    }

    try {
      setIsSubmitting(true);

      const orderPayload = {
        address_id: addressId,
        pickup_date: toApiDate(pickupDate),
        pickup_slot: pickupSlot,
        special_instructions: specialInstructions?.trim() || '',
        payment_method: selectedMethod,
        coupon_code: couponCode || '',
        items: cartLines.map((line) => ({
          service_item_id: line.item.id,
          quantity: line.quantity,
        })),
      };

      const createOrderResponse = await api.post<ApiSuccessResponse<CreatedOrder>>('/orders', orderPayload);
      const createdOrder = createOrderResponse.data?.data;

      console.log('Created order:', createdOrder);

      if (!createdOrder?.id) {
        throw new Error('Order creation response missing order id');
      }

      if (selectedMethod === 'upi' || selectedMethod === 'card') {
        await api.post('/payments/create-order', {
          order_id: createdOrder.id,
        });

        clearCart();
        Alert.alert('Payment', 'Razorpay integration coming soon');
        return;
      }

      clearCart();
      navigation.navigate('OrderConfirmed', {
        orderId: createdOrder.id,
        orderNumber: createdOrder.order_number,
      });
    } catch (error) {
      Alert.alert('Order Failed', 'Unable to place your order right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={22} color={COLORS.forestDark} />
          </Pressable>

          <Heading1 style={styles.title}>Payment</Heading1>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.totalCard}>
            <BodyM style={styles.totalLabel}>Total Payable</BodyM>
            <LabelL style={styles.totalValue}>{formatCurrency(total)}</LabelL>
          </View>

          <View style={styles.methodsWrap}>
            {PAYMENT_METHODS.map((method) => {
              const isSelected = method.id === selectedMethod;

              return (
                <Pressable
                  key={method.id}
                  onPress={() => setSelectedMethod(method.id)}
                  style={[styles.methodCard, isSelected && styles.methodCardSelected]}
                >
                  <View style={styles.methodLeft}>
                    <View style={[styles.iconWrap, isSelected && styles.iconWrapSelected]}>
                      <Feather name={method.icon} size={18} color={COLORS.forestDark} />
                    </View>

                    <View style={styles.methodTextWrap}>
                      <LabelL style={styles.methodTitle}>{method.title}</LabelL>
                      <BodyM style={styles.methodDescription}>{method.description}</BodyM>
                    </View>
                  </View>

                  {isSelected ? (
                    <Feather name="check-circle" size={20} color={COLORS.gold} />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.securityRow}>
          <Feather name="lock" size={14} color={COLORS.textSecondary} />
          <BodyM style={styles.securityText}>100% Secure Payment</BodyM>
        </View>

        <View style={styles.footer}>
          <Button disabled={isSubmitting} onPress={handlePay} variant="primary">
            {isSubmitting ? 'Creating Order...' : `Pay ${formatCurrency(total)}`}
          </Button>
        </View>
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
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    gap: SPACING.base,
    paddingBottom: 164,
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingTop: SPACING.base,
  },
  totalCard: {
    ...SHADOWS.elevation1,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.creamDark,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.xl,
  },
  totalLabel: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  totalValue: {
    color: COLORS.forestDark,
    fontFamily: FONTS.displayBold,
    fontSize: 42,
    lineHeight: 46,
  },
  methodsWrap: {
    gap: SPACING.sm,
  },
  methodCard: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.creamDark,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 72,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
  },
  methodCardSelected: {
    borderColor: COLORS.gold,
    borderWidth: 2,
  },
  methodLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    gap: SPACING.sm,
    paddingRight: SPACING.base,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: COLORS.cream,
    borderRadius: RADIUS.pill,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  iconWrapSelected: {
    backgroundColor: COLORS.goldPale,
  },
  methodTextWrap: {
    flex: 1,
    gap: 2,
  },
  methodTitle: {
    color: COLORS.forestDark,
  },
  methodDescription: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.body,
    fontSize: TYPOGRAPHY.caption.fontSize,
    lineHeight: TYPOGRAPHY.caption.lineHeight,
  },
  securityRow: {
    alignItems: 'center',
    alignSelf: 'center',
    bottom: 88,
    flexDirection: 'row',
    gap: 6,
    position: 'absolute',
  },
  securityText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.caption.fontSize,
    lineHeight: TYPOGRAPHY.caption.lineHeight,
  },
  footer: {
    backgroundColor: COLORS.cream,
    borderTopColor: 'rgba(15,46,42,0.08)',
    borderTopWidth: 1,
    bottom: 0,
    left: 0,
    paddingBottom: SPACING.lg,
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingTop: SPACING.base,
    position: 'absolute',
    right: 0,
  },
});
