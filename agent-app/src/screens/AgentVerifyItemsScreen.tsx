import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { BodyM, Button, DisplayL, LabelM } from '../components/ui';
import { COLORS, LAYOUT, RADIUS, SPACING } from '../constants';
import api from '../services/api';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'AgentVerifyItems'>;

type AgentOrder = {
  delivery_id: string;
  order_id: string;
  order_number: string;
  customer_name: string | null;
  items_count: number | string;
};

type VerifyItem = {
  id: string;
  name: string;
  expectedQty: number;
  verifiedQty: number;
};

const buildInitialItems = (itemCount: number) => {
  const normalized = Math.max(1, itemCount);
  return Array.from({ length: normalized }, (_, index) => ({
    id: `itm-${index + 1}`,
    name: `Laundry Item ${index + 1}`,
    expectedQty: 1,
    verifiedQty: 1,
  }));
};

export const AgentVerifyItemsScreen = ({ navigation, route }: Props) => {
  const taskId = route.params?.taskId ?? 'task-pending';

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerName, setCustomerName] = useState('Customer');
  const [deliveryId, setDeliveryId] = useState(taskId);
  const [items, setItems] = useState<VerifyItem[]>(buildInitialItems(1));
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const loadTaskData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get<{ success: boolean; data: AgentOrder[] }>('/orders');
      const deliveries = response.data?.data ?? [];
      const selected = deliveries.find((entry) => entry.delivery_id === taskId);

      if (!selected) {
        Alert.alert('Task Missing', 'Could not load this task from active orders.');
        setItems(buildInitialItems(1));
        return;
      }

      const itemCount = Number(selected.items_count ?? 1);
      setCustomerName(selected.customer_name?.trim() || 'Customer');
      setDeliveryId(selected.delivery_id);
      setItems(buildInitialItems(itemCount));
    } catch {
      Alert.alert('Load Failed', 'Unable to load order items for verification.');
      setItems(buildInitialItems(1));
    } finally {
      setIsLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    loadTaskData();
  }, [loadTaskData]);

  const updateItemQty = (itemId: string, delta: -1 | 1) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        return {
          ...item,
          verifiedQty: Math.max(0, item.verifiedQty + delta),
        };
      })
    );
  };

  const handleAddPhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Needed', 'Camera permission is required to take item photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.6,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + Math.max(0, item.verifiedQty), 0),
    [items]
  );

  const handleConfirmPickup = async () => {
    if (!deliveryId || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(`/orders/${deliveryId}/verify-items`, {
        items: items.map((item) => ({
          name: item.name,
          expected_quantity: item.expectedQty,
          verified_quantity: item.verifiedQty,
        })),
        photo_url: photoUri,
      });

      await api.patch(`/orders/${deliveryId}/status`, {
        status: 'completed',
      });

      Alert.alert('Pickup Confirmed', 'Items verified and pickup marked completed.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('AgentDashboard'),
        },
      ]);
    } catch {
      Alert.alert('Confirm Failed', 'Unable to confirm pickup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>{'<'}</Text>
          </Pressable>
          <DisplayL style={styles.headerTitle}>Verify Items</DisplayL>
        </View>

        <View style={styles.card}>
          <LabelM style={styles.kicker}>Customer</LabelM>
          <BodyM>{customerName}</BodyM>
        </View>

        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={COLORS.gold} size="small" />
            <BodyM style={styles.loadingText}>Loading checklist...</BodyM>
          </View>
        ) : (
          <View style={styles.listWrap}>
            {items.map((item) => {
              const matched = item.verifiedQty === item.expectedQty;

              return (
                <View key={item.id} style={styles.itemRow}>
                  <View style={styles.itemMeta}>
                    <BodyM>{item.name}</BodyM>
                    <BodyM style={styles.itemSub}>{`Expected: ${item.expectedQty}`}</BodyM>
                  </View>

                  <View style={styles.counterWrap}>
                    <Pressable onPress={() => updateItemQty(item.id, -1)} style={styles.counterBtn}>
                      <Text style={styles.counterBtnText}>-</Text>
                    </Pressable>
                    <Text style={styles.counterValue}>{item.verifiedQty}</Text>
                    <Pressable onPress={() => updateItemQty(item.id, 1)} style={styles.counterBtn}>
                      <Text style={styles.counterBtnText}>+</Text>
                    </Pressable>
                    <Text style={[styles.matchText, matched ? styles.matchOk : styles.matchWarn]}>
                      {matched ? '✓' : '!'}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.card}>
          <LabelM style={styles.kicker}>Photo</LabelM>
          <Button onPress={handleAddPhoto} variant="secondary">
            Add Photo
          </Button>

          {photoUri ? <Image source={{ uri: photoUri }} style={styles.thumbnail} /> : null}
        </View>

        <View style={styles.totalWrap}>
          <BodyM style={styles.totalText}>{`Total: ${totalItems} items`}</BodyM>
        </View>

        <Button disabled={isSubmitting || isLoading} onPress={handleConfirmPickup}>
          {isSubmitting ? 'Confirming...' : 'Confirm Pickup'}
        </Button>
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
  backText: {
    color: COLORS.cream,
    fontSize: 18,
    lineHeight: 22,
  },
  headerTitle: {
    color: COLORS.cream,
    fontSize: 24,
    lineHeight: 30,
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
  loadingWrap: {
    alignItems: 'center',
    backgroundColor: COLORS.forestMid,
    borderRadius: RADIUS.xl,
    padding: LAYOUT.cardPaddingLarge,
  },
  loadingText: {
    color: COLORS.textMuted,
  },
  listWrap: {
    gap: SPACING.sm,
  },
  itemRow: {
    alignItems: 'center',
    backgroundColor: COLORS.forestMid,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  itemMeta: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  itemSub: {
    color: COLORS.textMuted,
    marginTop: 2,
  },
  counterWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  counterBtn: {
    alignItems: 'center',
    backgroundColor: COLORS.forestLight,
    borderRadius: RADIUS.pill,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  counterBtnText: {
    color: COLORS.cream,
    fontSize: 16,
    lineHeight: 20,
  },
  counterValue: {
    color: COLORS.cream,
    fontSize: 16,
    fontWeight: '600',
    minWidth: 22,
    textAlign: 'center',
  },
  matchText: {
    fontSize: 16,
    fontWeight: '700',
    minWidth: 14,
    textAlign: 'center',
  },
  matchOk: {
    color: '#34D399',
  },
  matchWarn: {
    color: '#F59E0B',
  },
  thumbnail: {
    borderRadius: RADIUS.md,
    height: 140,
    marginTop: SPACING.sm,
    width: '100%',
  },
  totalWrap: {
    alignItems: 'flex-end',
  },
  totalText: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: '600',
  },
});
