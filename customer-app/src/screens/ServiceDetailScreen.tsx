import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import { BottomNavBar } from '../components/shared/BottomNavBar';
import { Button, BodyM, Heading1, LabelL } from '../components/ui';
import { COLORS, FONTS, LAYOUT, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../constants';
import api from '../services/api';
import { CartItem, useCartStore } from '../store/cartStore';

type ServiceItem = {
  id: string;
  service_id: string;
  name: string;
  price: number | string;
  unit: string | null;
};

type ServiceResponse = {
  success: boolean;
  data: {
    service: {
      id: string;
      name: string;
    };
    items: ServiceItem[];
  };
};

type ServiceDetailRouteParams = {
  serviceId: string;
  serviceName?: string;
};

const LoadingSkeleton = () => (
  <View style={styles.skeletonWrap}>
    {Array.from({ length: 8 }).map((_, index) => (
      <View key={`sk-${index}`} style={styles.skeletonRow}>
        <View>
          <View style={styles.skeletonTitle} />
          <View style={styles.skeletonPrice} />
        </View>
        <View style={styles.skeletonStepper}>
          <View style={styles.skeletonCircle} />
          <View style={styles.skeletonCount} />
          <View style={styles.skeletonCircle} />
        </View>
      </View>
    ))}
  </View>
);

export const ServiceDetailScreen = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, ServiceDetailRouteParams>, string>>();
  const insets = useSafeAreaInsets();

  const serviceId = route.params?.serviceId;
  const initialServiceName = route.params?.serviceName ?? 'Service';

  const [serviceName, setServiceName] = useState(initialServiceName);
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cartItemsMap = useCartStore((state) => state.items);
  const incrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);

  const slideAnim = useRef(new Animated.Value(120)).current;

  useEffect(() => {
    if (!serviceId) {
      setLoading(false);
      setError('Invalid service');
      return;
    }

    let isMounted = true;

    const fetchServiceItems = async () => {
      try {
        setLoading(true);
        const response = await api.get<ServiceResponse>(`/services/${serviceId}/items`);

        if (!isMounted) {
          return;
        }

        const payload = response.data?.data;
        setServiceName(payload?.service?.name ?? initialServiceName);
        setItems(payload?.items ?? []);
        setError(null);
      } catch (fetchError) {
        if (isMounted) {
          setError('Unable to load service items');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchServiceItems();

    return () => {
      isMounted = false;
    };
  }, [initialServiceName, serviceId]);

  const relevantCartLines = useMemo(() => {
    return Object.values(cartItemsMap).filter((line) => line.item.service_id === serviceId);
  }, [cartItemsMap, serviceId]);

  const totalItems = useMemo(() => {
    return relevantCartLines.reduce((sum, line) => sum + line.quantity, 0);
  }, [relevantCartLines]);

  const totalPrice = useMemo(() => {
    return relevantCartLines.reduce((sum, line) => sum + line.item.price * line.quantity, 0);
  }, [relevantCartLines]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: totalItems > 0 ? 0 : 120,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [slideAnim, totalItems]);

  const getQuantity = (itemId: string) => {
    return cartItemsMap[itemId]?.quantity ?? 0;
  };

  const handleIncrement = (item: ServiceItem) => {
    const normalized: CartItem = {
      id: item.id,
      service_id: item.service_id,
      name: item.name,
      price: Number(item.price),
      unit: item.unit,
    };

    incrementItem(normalized);
  };

  const handleViewCart = () => {
    navigation.navigate('PickupScheduling');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={22} color={COLORS.forestDark} />
          </Pressable>
          <Heading1 style={styles.title}>{serviceName}</Heading1>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: totalItems > 0 ? 168 + insets.bottom : 96 + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <View style={styles.errorWrap}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            items.map((item) => {
              const quantity = getQuantity(item.id);

              return (
                <View key={item.id} style={styles.row}>
                  <View style={styles.itemTextWrap}>
                    <LabelL style={styles.itemName}>{item.name}</LabelL>
                    <BodyM style={styles.itemPrice}>{`\u20B9${Number(item.price)}`}</BodyM>
                  </View>

                  <View style={styles.stepper}>
                    <Pressable
                      onPress={() => decrementItem(item.id)}
                      style={styles.stepperButton}
                    >
                      <Feather name="minus" size={16} color={COLORS.forestDark} />
                    </Pressable>

                    <LabelL style={styles.countText}>{quantity}</LabelL>

                    <Pressable
                      onPress={() => handleIncrement(item)}
                      style={styles.stepperButton}
                    >
                      <Feather name="plus" size={16} color={COLORS.forestDark} />
                    </Pressable>
                  </View>
                </View>
              );
            })
          )}

          {loading && (
            <View style={styles.loaderMeta}>
              <ActivityIndicator size="small" color={COLORS.gold} />
            </View>
          )}
        </ScrollView>

        <Animated.View
          pointerEvents={totalItems > 0 ? 'auto' : 'none'}
          style={[
            styles.stickyBar,
            {
              bottom: 72,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View>
            <Text style={styles.summaryItems}>{`${totalItems} ${totalItems === 1 ? 'item' : 'items'}`}</Text>
            <Text style={styles.summaryPrice}>{`\u20B9${totalPrice}`}</Text>
          </View>

          <View style={styles.cartButtonWrap}>
            <Button variant="primary" fullWidth={false} onPress={handleViewCart}>
              View Cart {'\u2192'}
            </Button>
          </View>
        </Animated.View>

        <BottomNavBar activeTab="Services" />
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
  listContent: {
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingTop: SPACING.base,
  },
  row: {
    alignItems: 'center',
    borderBottomColor: COLORS.creamDark,
    borderBottomWidth: 1,
    flexDirection: 'row',
    minHeight: 60,
    paddingVertical: 10,
  },
  itemTextWrap: {
    flex: 1,
    gap: 2,
    paddingRight: 12,
  },
  itemName: {
    color: COLORS.forestDark,
  },
  itemPrice: {
    color: COLORS.gold,
    fontFamily: FONTS.bodyMedium,
  },
  stepper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  stepperButton: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.forestLight,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  countText: {
    color: COLORS.forestDark,
    minWidth: 22,
    textAlign: 'center',
  },
  stickyBar: {
    ...SHADOWS.elevation3,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderTopColor: COLORS.creamDark,
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 72,
    justifyContent: 'space-between',
    left: 0,
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    position: 'absolute',
    right: 0,
  },
  summaryItems: {
    color: COLORS.forestDark,
    fontFamily: FONTS.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
  },
  summaryPrice: {
    color: COLORS.gold,
    fontFamily: FONTS.bodySemiBold,
    fontSize: 18,
    lineHeight: 24,
    marginTop: 1,
  },
  cartButtonWrap: {
    maxWidth: 170,
    minWidth: 132,
  },
  skeletonWrap: {
    gap: 4,
  },
  skeletonRow: {
    alignItems: 'center',
    borderBottomColor: COLORS.creamDark,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 60,
    paddingVertical: 10,
  },
  skeletonTitle: {
    backgroundColor: COLORS.creamDark,
    borderRadius: 8,
    height: 14,
    width: 120,
  },
  skeletonPrice: {
    backgroundColor: COLORS.creamDark,
    borderRadius: 8,
    height: 12,
    marginTop: 8,
    width: 60,
  },
  skeletonStepper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  skeletonCircle: {
    backgroundColor: COLORS.creamDark,
    borderRadius: RADIUS.pill,
    height: 36,
    width: 36,
  },
  skeletonCount: {
    backgroundColor: COLORS.creamDark,
    borderRadius: 8,
    height: 14,
    width: 16,
  },
  loaderMeta: {
    alignItems: 'center',
    marginTop: 12,
  },
  errorWrap: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.creamDark,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  errorText: {
    ...TYPOGRAPHY.bodyM,
    color: COLORS.statusError,
  },
});
