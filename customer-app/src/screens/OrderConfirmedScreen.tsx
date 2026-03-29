import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { Button, BodyM, Heading1, LabelL } from '../components/ui';
import { COLORS, LAYOUT, SPACING } from '../constants';

type OrderConfirmedRouteParams = {
  orderId: string;
  orderNumber: string;
};

export const OrderConfirmedScreen = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, OrderConfirmedRouteParams>, string>>();
  const { orderId, orderNumber } = route.params;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 7,
      tension: 80,
    }).start();
  }, [scaleAnim]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.body}>
          <Animated.View style={[styles.successIconWrap, { transform: [{ scale: scaleAnim }] }]}>
            <Feather name="check-circle" size={80} color={COLORS.statusSuccess} />
          </Animated.View>

          <Heading1 style={styles.heading}>Order Placed!</Heading1>
          <LabelL style={styles.orderNumber}>{orderNumber}</LabelL>
          <BodyM style={styles.infoText}>
            Your pickup is scheduled. We'll notify you when an agent is on the way.
          </BodyM>

          <View style={styles.buttonWrap}>
            <Button
              onPress={() => navigation.navigate('OrderTracking', { orderId })}
              variant="secondary"
            >
              Track Order
            </Button>
          </View>

          <View style={styles.buttonWrap}>
            <Button
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Home' }],
                })
              }
              variant="primary"
            >
              Back to Home
            </Button>
          </View>
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
  body: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
  },
  successIconWrap: {
    marginBottom: SPACING.lg,
  },
  heading: {
    color: COLORS.forestDark,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  orderNumber: {
    color: COLORS.gold,
    marginBottom: SPACING.base,
  },
  infoText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  buttonWrap: {
    marginTop: SPACING.base,
    width: '100%',
  },
});
