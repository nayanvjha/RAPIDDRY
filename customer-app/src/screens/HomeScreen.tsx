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
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';

import { COLORS, FONTS, LAYOUT, RADIUS, SPACING, TYPOGRAPHY } from '../constants';
import { BodyM, Heading2 } from '../components/ui';
import { BottomNavBar } from '../components/shared/BottomNavBar';
import { HeroBanner } from '../components/shared/HeroBanner';
import { ServiceCard, ServiceCardData } from '../components/shared/ServiceCard';
import api from '../services/api';

type ApiService = {
  id: string;
  name: string;
  description: string | null;
  base_price: number | string | null;
  price_unit: string | null;
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'Good morning,';
  }
  if (hour < 17) {
    return 'Good afternoon,';
  }
  return 'Good evening,';
};

const HomeSkeleton = () => {
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View style={{ opacity: pulse }}>
      <View style={styles.skeletonHero} />
      <View style={styles.skeletonHeaderRow}>
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonLink} />
      </View>
      <View style={styles.skeletonRowLarge}>
        <View style={styles.skeletonLargeCard} />
        <View style={styles.skeletonLargeCard} />
      </View>
      <View style={styles.skeletonRowSmall}>
        <View style={styles.skeletonSmallCard} />
        <View style={styles.skeletonSmallCard} />
        <View style={styles.skeletonSmallCard} />
      </View>
    </Animated.View>
  );
};

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const [services, setServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const MOCK_SERVICES: ApiService[] = [
      { id: '1', name: 'Wash & Fold',     description: 'Everyday laundry, washed & neatly folded',      base_price: 49,  price_unit: 'per kg' },
      { id: '2', name: 'Wash & Iron',     description: 'Washed, pressed & ready to wear',               base_price: 69,  price_unit: 'per kg' },
      { id: '3', name: 'Dry Clean',       description: 'Professional solvent cleaning for delicates',    base_price: 199, price_unit: 'per piece' },
      { id: '4', name: 'Steam Iron',      description: 'Crisp press finish for your garments',           base_price: 29,  price_unit: 'per piece' },
      { id: '5', name: 'Stain Removal',   description: 'Targeted treatment for tough stains',            base_price: 149, price_unit: 'per piece' },
      { id: '6', name: 'Shoe Cleaning',   description: 'Deep clean & restore your footwear',             base_price: 299, price_unit: 'per pair' },
    ];

    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await api.get<{ success: boolean; data: ApiService[] }>('/services');

        if (isMounted) {
          setServices(response.data.data ?? []);
          setError(null);
        }
      } catch (apiError) {
        // Fallback to mock data for UI testing when backend is offline
        if (isMounted) {
          setServices(MOCK_SERVICES);
          setError(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchServices();
    return () => {
      isMounted = false;
    };
  }, []);

  const primaryServices = useMemo(() => services.slice(0, 2), [services]);
  const secondaryServices = useMemo(() => services.slice(2, 5), [services]);
  const extraService = useMemo(() => services[5], [services]);

  const goToServiceDetail = (service: ServiceCardData) => {
    navigation.navigate('ServiceDetail', {
      serviceId: service.id,
      serviceName: service.name,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View>
              <BodyM style={styles.greeting}>{getGreeting()}</BodyM>
              <Text style={styles.userName}>Nishant</Text>
            </View>

            <View style={styles.headerRight}>
              <Pressable style={styles.iconButton}>
                <Feather name="bell" size={22} color={COLORS.forestDark} />
                <View style={styles.notificationDot} />
              </Pressable>

              <View style={styles.avatar}>
                <Text style={styles.avatarText}>N</Text>
              </View>
            </View>
          </View>

          <Pressable style={styles.locationPill}>
            <Feather name="map-pin" size={14} color={COLORS.gold} />
            <Text style={styles.locationText}>Sector 66, Gurgaon</Text>
            <Feather name="chevron-down" size={14} color={COLORS.gold} />
          </Pressable>

          <View style={styles.heroSection}>
            <HeroBanner />
          </View>

          <View style={styles.servicesSection}>
            <View style={styles.servicesHeader}>
              <Heading2>Services</Heading2>
              <Pressable>
                <Text style={styles.seeAllText}>See all {'\u2192'}</Text>
              </Pressable>
            </View>

            {loading ? (
              <HomeSkeleton />
            ) : error ? (
              <View style={styles.errorWrap}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : (
              <>
                <View style={styles.rowLarge}>
                  {primaryServices[0] ? (
                    <ServiceCard
                      service={primaryServices[0]}
                      size="large"
                      tone="dark"
                      onPress={goToServiceDetail}
                    />
                  ) : null}
                  {primaryServices[1] ? (
                    <ServiceCard
                      service={primaryServices[1]}
                      size="large"
                      tone="light"
                      onPress={goToServiceDetail}
                    />
                  ) : null}
                </View>

                <View style={styles.rowSmall}>
                  {secondaryServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      size="small"
                      tone="outlined"
                      onPress={goToServiceDetail}
                    />
                  ))}
                </View>

                {extraService ? (
                  <View style={styles.extraRow}>
                    <ServiceCard
                      service={extraService}
                      size="small"
                      tone="outlined"
                      onPress={goToServiceDetail}
                    />
                  </View>
                ) : null}
              </>
            )}

            {loading && (
              <View style={styles.loadingMeta}>
                <ActivityIndicator color={COLORS.gold} size="small" />
              </View>
            )}
          </View>
        </ScrollView>

        <BottomNavBar activeTab="Home" />
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
  scrollContent: {
    paddingBottom: 96,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingTop: SPACING.sm,
  },
  greeting: {
    color: COLORS.textMuted,
  },
  userName: {
    color: COLORS.forestDark,
    fontFamily: FONTS.displayBold,
    fontSize: 24,
    lineHeight: 30,
    marginTop: 2,
  },
  headerRight: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    position: 'relative',
    width: 44,
  },
  notificationDot: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.cream,
    borderRadius: RADIUS.pill,
    borderWidth: 1.5,
    height: 8,
    position: 'absolute',
    right: 10,
    top: 10,
    width: 8,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: COLORS.forestDark,
    borderRadius: RADIUS.pill,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  avatarText: {
    color: COLORS.gold,
    fontFamily: FONTS.displayBold,
    fontSize: 16,
  },
  locationPill: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.forestDark,
    borderRadius: RADIUS.pill,
    flexDirection: 'row',
    gap: 8,
    height: 34,
    marginLeft: LAYOUT.screenPaddingHorizontal,
    marginTop: SPACING.sm,
    minWidth: 44,
    paddingHorizontal: 14,
  },
  locationText: {
    color: COLORS.cream,
    fontFamily: FONTS.bodyMedium,
    fontSize: 13,
  },
  heroSection: {
    marginHorizontal: LAYOUT.screenPaddingHorizontal,
    marginTop: SPACING.base,
  },
  servicesSection: {
    marginTop: 28,
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
  },
  servicesHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  seeAllText: {
    color: COLORS.gold,
    fontFamily: FONTS.bodyMedium,
    fontSize: 13,
  },
  rowLarge: {
    flexDirection: 'row',
    gap: 12,
  },
  rowSmall: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  extraRow: {
    marginTop: 10,
    width: '33%',
  },
  loadingMeta: {
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
  skeletonHero: {
    backgroundColor: COLORS.creamDark,
    borderRadius: 18,
    height: 200,
  },
  skeletonHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    marginTop: 28,
  },
  skeletonTitle: {
    backgroundColor: COLORS.creamDark,
    borderRadius: 8,
    height: 22,
    width: 110,
  },
  skeletonLink: {
    backgroundColor: COLORS.creamDark,
    borderRadius: 8,
    height: 18,
    width: 70,
  },
  skeletonRowLarge: {
    flexDirection: 'row',
    gap: 12,
  },
  skeletonLargeCard: {
    backgroundColor: COLORS.creamDark,
    borderRadius: 14,
    flex: 1,
    height: 160,
  },
  skeletonRowSmall: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  skeletonSmallCard: {
    backgroundColor: COLORS.creamDark,
    borderRadius: 14,
    flex: 1,
    height: 100,
  },
});
