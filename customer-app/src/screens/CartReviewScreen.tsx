import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { Button, BodyM, Heading1, LabelL } from '../components/ui';
import { COLORS, FONTS, LAYOUT, RADIUS, SPACING, TYPOGRAPHY } from '../constants';
import api from '../services/api';
import { useCartStore } from '../store/cartStore';

type CartReviewNavigation = NavigationProp<ParamListBase>;
type CartReviewRouteParams = {
  pickupDate: string;
  pickupSlot: string;
  specialInstructions?: string;
};

type Address = {
  id: string;
  label: string;
  full_address: string;
  landmark: string | null;
  is_default?: boolean;
};

type ApiSuccessResponse<T> = {
  success: boolean;
  data: T;
};

type CouponValidationResponse = {
  valid: boolean;
  reason?: string;
  discount_amount?: number;
  coupon?: {
    code: string;
  };
};

const DELIVERY_FEE = 30;

const formatCurrency = (amount: number) => {
  return `\u20B9${amount.toFixed(0)}`;
};

const formatPickupDisplay = (pickupDate: string, pickupSlot: string) => {
  const date = new Date(pickupDate);
  const dateLabel = Number.isNaN(date.getTime())
    ? pickupDate
    : date.toLocaleDateString('en-US', {
        weekday: 'long',
        day: '2-digit',
        month: 'short',
      });

  return `${dateLabel} \u2022 ${pickupSlot.replace(' - ', ' \u2013 ')}`;
};

export const CartReviewScreen = () => {
  const navigation = useNavigation<CartReviewNavigation>();
  const route = useRoute<RouteProp<Record<string, CartReviewRouteParams>, string>>();

  const { pickupDate, pickupSlot, specialInstructions } = route.params;

  const cartItemsMap = useCartStore((state) => state.items);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [addressesError, setAddressesError] = useState<string | null>(null);

  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const cartLines = useMemo(() => {
    return Object.values(cartItemsMap);
  }, [cartItemsMap]);

  const subtotal = useMemo(() => {
    return cartLines.reduce((sum, line) => sum + line.quantity * line.item.price, 0);
  }, [cartLines]);

  const total = useMemo(() => {
    return Math.max(0, subtotal + DELIVERY_FEE - discountAmount);
  }, [subtotal, discountAmount]);

  const selectedAddress = useMemo(() => {
    if (addresses.length === 0) {
      return null;
    }

    return addresses.find((address) => address.is_default) ?? addresses[0];
  }, [addresses]);

  useEffect(() => {
    let isMounted = true;

    const fetchAddresses = async () => {
      try {
        setAddressesLoading(true);
        const response = await api.get<ApiSuccessResponse<Address[]>>('/addresses');

        if (!isMounted) {
          return;
        }

        setAddresses(response.data?.data ?? []);
        setAddressesError(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setAddresses([]);
        setAddressesError('Unable to load addresses');
      } finally {
        if (isMounted) {
          setAddressesLoading(false);
        }
      }
    };

    fetchAddresses();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCouponInputChange = (value: string) => {
    setCouponInput(value);
    setCouponError(null);

    if (!value.trim()) {
      setAppliedCouponCode(null);
      setDiscountAmount(0);
    }
  };

  const handleApplyCoupon = async () => {
    const normalizedCode = couponInput.trim().toUpperCase();

    if (!normalizedCode) {
      setCouponError('Enter a coupon code');
      return;
    }

    try {
      setIsApplyingCoupon(true);
      setCouponError(null);

      const response = await api.post<ApiSuccessResponse<CouponValidationResponse>>(
        '/coupons/validate',
        {
          code: normalizedCode,
          order_total: subtotal,
        }
      );

      const result = response.data?.data;

      if (result?.valid) {
        setAppliedCouponCode(result.coupon?.code ?? normalizedCode);
        setDiscountAmount(Number(result.discount_amount ?? 0));
        setCouponError(null);
        return;
      }

      setAppliedCouponCode(null);
      setDiscountAmount(0);
      setCouponError(result?.reason ?? 'Coupon is not valid');
    } catch (error) {
      setAppliedCouponCode(null);
      setDiscountAmount(0);
      setCouponError('Failed to validate coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleProceedToPay = () => {
    if (!selectedAddress) {
      return;
    }

    navigation.navigate('Payment', {
      addressId: selectedAddress.id,
      pickupDate,
      pickupSlot,
      specialInstructions,
      couponCode: appliedCouponCode,
      total,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={22} color={COLORS.forestDark} />
          </Pressable>

          <Heading1 style={styles.title}>Order Summary</Heading1>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <LabelL style={styles.cardTitle}>Delivery Address</LabelL>
              <Pressable>
                <BodyM style={styles.linkText}>Change</BodyM>
              </Pressable>
            </View>

            {addressesLoading ? (
              <View style={styles.addressLoadingWrap}>
                <ActivityIndicator size="small" color={COLORS.gold} />
              </View>
            ) : selectedAddress ? (
              <View style={styles.addressContent}>
                <LabelL style={styles.addressLabel}>{selectedAddress.label}</LabelL>
                <BodyM style={styles.addressText}>{selectedAddress.full_address}</BodyM>
                {selectedAddress.landmark ? (
                  <BodyM style={styles.landmarkText}>{`Landmark: ${selectedAddress.landmark}`}</BodyM>
                ) : null}
              </View>
            ) : (
              <View style={styles.addressEmptyWrap}>
                <BodyM style={styles.addressEmptyText}>Add an address</BodyM>
                <Button fullWidth={false} variant="secondary">
                  Add Address
                </Button>
              </View>
            )}

            {addressesError ? <BodyM style={styles.errorText}>{addressesError}</BodyM> : null}
          </View>

          <View style={styles.card}>
            <LabelL style={styles.cardTitle}>Pickup Slot</LabelL>
            <BodyM style={styles.pickupText}>{formatPickupDisplay(pickupDate, pickupSlot)}</BodyM>
          </View>

          <View style={styles.card}>
            <LabelL style={styles.cardTitle}>Items</LabelL>

            {cartLines.length === 0 ? (
              <BodyM style={styles.emptyItemsText}>Your cart is empty.</BodyM>
            ) : (
              <View style={styles.itemsWrap}>
                {cartLines.map((line) => {
                  const lineTotal = line.quantity * line.item.price;

                  return (
                    <View key={line.item.id} style={styles.itemRow}>
                      <View style={styles.itemMainTextWrap}>
                        <LabelL style={styles.itemName}>{line.item.name}</LabelL>
                        <BodyM style={styles.itemMeta}>{`${line.quantity}x ${line.item.name} \u2014 ${formatCurrency(lineTotal)}`}</BodyM>
                      </View>
                      <View style={styles.priceWrap}>
                        <BodyM style={styles.priceMeta}>{`${formatCurrency(line.item.price)} each`}</BodyM>
                        <LabelL style={styles.itemTotal}>{formatCurrency(lineTotal)}</LabelL>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          <View style={styles.card}>
            <LabelL style={styles.cardTitle}>Price Summary</LabelL>

            <View style={styles.summaryRow}>
              <BodyM style={styles.summaryLabel}>Subtotal</BodyM>
              <BodyM style={styles.summaryValue}>{formatCurrency(subtotal)}</BodyM>
            </View>

            <View style={styles.summaryRow}>
              <BodyM style={styles.summaryLabel}>Delivery Fee</BodyM>
              <BodyM style={styles.summaryValue}>{formatCurrency(DELIVERY_FEE)}</BodyM>
            </View>

            <View style={styles.couponRow}>
              <TextInput
                autoCapitalize="characters"
                onChangeText={handleCouponInputChange}
                placeholder="Enter coupon code"
                placeholderTextColor={COLORS.textSecondary}
                style={styles.couponInput}
                value={couponInput}
              />
              <Button disabled={isApplyingCoupon} fullWidth={false} onPress={handleApplyCoupon}>
                {isApplyingCoupon ? 'Applying...' : 'Apply'}
              </Button>
            </View>

            {couponError ? <BodyM style={styles.couponErrorText}>{couponError}</BodyM> : null}

            {appliedCouponCode && discountAmount > 0 ? (
              <View style={styles.summaryRow}>
                <BodyM style={styles.discountLabel}>{`Discount (${appliedCouponCode})`}</BodyM>
                <BodyM style={styles.discountValue}>{`- ${formatCurrency(discountAmount)}`}</BodyM>
              </View>
            ) : null}

            <View style={[styles.summaryRow, styles.totalRow]}>
              <LabelL style={styles.totalLabel}>Total</LabelL>
              <LabelL style={styles.totalValue}>{formatCurrency(total)}</LabelL>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            disabled={!selectedAddress || cartLines.length === 0}
            onPress={handleProceedToPay}
            variant="primary"
          >
            {`Proceed to Pay — ${formatCurrency(total)}`}
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
    paddingBottom: 132,
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingTop: SPACING.base,
  },
  card: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.creamDark,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: SPACING.sm,
    padding: SPACING.base,
  },
  cardHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: COLORS.forestDark,
  },
  linkText: {
    color: COLORS.gold,
    fontFamily: FONTS.bodySemiBold,
    textDecorationLine: 'underline',
  },
  addressLoadingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  addressContent: {
    gap: SPACING.xs,
  },
  addressLabel: {
    color: COLORS.forestDark,
    textTransform: 'capitalize',
  },
  addressText: {
    color: COLORS.forestDark,
  },
  landmarkText: {
    color: COLORS.textSecondary,
  },
  addressEmptyWrap: {
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  addressEmptyText: {
    color: COLORS.forestDark,
  },
  errorText: {
    color: COLORS.statusError,
  },
  pickupText: {
    color: COLORS.forestDark,
    fontFamily: FONTS.bodyMedium,
  },
  emptyItemsText: {
    color: COLORS.textSecondary,
  },
  itemsWrap: {
    gap: SPACING.sm,
  },
  itemRow: {
    borderBottomColor: COLORS.creamDark,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: SPACING.sm,
  },
  itemMainTextWrap: {
    flex: 1,
    gap: 2,
    paddingRight: SPACING.base,
  },
  itemName: {
    color: COLORS.forestDark,
  },
  itemMeta: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.bodyMedium,
  },
  priceWrap: {
    alignItems: 'flex-end',
    gap: 2,
  },
  priceMeta: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.caption.fontSize,
    lineHeight: TYPOGRAPHY.caption.lineHeight,
  },
  itemTotal: {
    color: COLORS.forestDark,
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: COLORS.textSecondary,
  },
  summaryValue: {
    color: COLORS.forestDark,
  },
  couponRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  couponInput: {
    backgroundColor: COLORS.cream,
    borderColor: COLORS.creamDark,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    color: COLORS.forestDark,
    flex: 1,
    fontFamily: FONTS.body,
    fontSize: TYPOGRAPHY.bodyM.fontSize,
    lineHeight: TYPOGRAPHY.bodyM.lineHeight,
    minHeight: 44,
    paddingHorizontal: SPACING.md,
  },
  couponErrorText: {
    color: COLORS.statusError,
  },
  discountLabel: {
    color: '#15803D',
  },
  discountValue: {
    color: '#15803D',
    fontFamily: FONTS.bodySemiBold,
  },
  totalRow: {
    borderTopColor: COLORS.creamDark,
    borderTopWidth: 1,
    marginTop: SPACING.xs,
    paddingTop: SPACING.sm,
  },
  totalLabel: {
    color: COLORS.forestDark,
  },
  totalValue: {
    color: COLORS.forestDark,
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
