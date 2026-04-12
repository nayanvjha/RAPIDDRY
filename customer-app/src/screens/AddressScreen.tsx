import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import * as Location from 'expo-location';
import { NavigationProp, ParamListBase, useFocusEffect, useNavigation } from '@react-navigation/native';

import { BodyM, Button, Heading1, LabelL } from '../components/ui';
import { COLORS, FONTS, LAYOUT, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../constants';
import api from '../services/api';

type AddressLabel = 'home' | 'work' | 'other';

type Address = {
  id: string;
  label: AddressLabel;
  full_address: string;
  landmark: string | null;
  lat: number | null;
  lng: number | null;
  is_default: boolean;
};

type ApiSuccessResponse<T> = {
  success: boolean;
  data: T;
};

type AddressForm = {
  label: AddressLabel;
  full_address: string;
  landmark: string;
  lat: number | null;
  lng: number | null;
};

const EMPTY_FORM: AddressForm = {
  label: 'home',
  full_address: '',
  landmark: '',
  lat: null,
  lng: null,
};

const LABEL_OPTIONS: AddressLabel[] = ['home', 'work', 'other'];

const getIconByLabel = (label: AddressLabel) => {
  if (label === 'home') {
    return 'home';
  }

  if (label === 'work') {
    return 'briefcase';
  }

  return 'map-pin';
};

const toLabelText = (label: AddressLabel) => {
  return label.charAt(0).toUpperCase() + label.slice(1);
};

export const AddressScreen = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newForm, setNewForm] = useState<AddressForm>(EMPTY_FORM);
  const [savingNew, setSavingNew] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<AddressForm>(EMPTY_FORM);
  const [savingEdit, setSavingEdit] = useState(false);
  const [busyAddressId, setBusyAddressId] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<ApiSuccessResponse<Address[]>>('/addresses');
      setAddresses(response.data?.data ?? []);
      setError(null);
    } catch (fetchError) {
      setAddresses([]);
      setError('Unable to load addresses');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [fetchAddresses])
  );

  const sortedAddresses = useMemo(() => {
    return [...addresses].sort((a, b) => Number(b.is_default) - Number(a.is_default));
  }, [addresses]);

  const requestCurrentLocation = async (
    onSuccess: (coords: { latitude: number; longitude: number }) => void
  ) => {
    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== 'granted') {
        Alert.alert('Permission Required', 'Location permission is needed to fetch your current location.');
        return;
      }

      const position = await Location.getCurrentPositionAsync({});
      onSuccess({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      Alert.alert('Location Added', 'Current location coordinates captured for this address.');
    } catch (locationError) {
      Alert.alert('Location Error', 'Unable to fetch current location.');
    }
  };

  const handleSaveNewAddress = async () => {
    if (!newForm.full_address.trim()) {
      Alert.alert('Required', 'Please enter full address.');
      return;
    }

    try {
      setSavingNew(true);
      await api.post('/addresses', {
        label: newForm.label,
        full_address: newForm.full_address.trim(),
        landmark: newForm.landmark.trim() || '',
        lat: newForm.lat,
        lng: newForm.lng,
      });

      setNewForm(EMPTY_FORM);
      await fetchAddresses();
    } catch (saveError) {
      Alert.alert('Failed', 'Unable to save address right now.');
    } finally {
      setSavingNew(false);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      setBusyAddressId(addressId);
      await api.patch(`/addresses/${addressId}/default`);
      await fetchAddresses();
    } catch (setDefaultError) {
      Alert.alert('Failed', 'Unable to set this address as default.');
    } finally {
      setBusyAddressId(null);
    }
  };

  const startEditing = (address: Address) => {
    setEditingId(address.id);
    setEditForm({
      label: address.label,
      full_address: address.full_address,
      landmark: address.landmark ?? '',
      lat: address.lat ?? null,
      lng: address.lng ?? null,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId) {
      return;
    }

    if (!editForm.full_address.trim()) {
      Alert.alert('Required', 'Please enter full address.');
      return;
    }

    try {
      setSavingEdit(true);
      await api.patch(`/addresses/${editingId}`, {
        label: editForm.label,
        full_address: editForm.full_address.trim(),
        landmark: editForm.landmark.trim() || '',
        lat: editForm.lat,
        lng: editForm.lng,
      });

      setEditingId(null);
      setEditForm(EMPTY_FORM);
      await fetchAddresses();
    } catch (editError) {
      Alert.alert('Failed', 'Unable to update address.');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = (addressId: string) => {
    Alert.alert('Delete Address', 'Are you sure you want to delete this address?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setBusyAddressId(addressId);
            await api.delete(`/addresses/${addressId}`);
            await fetchAddresses();
          } catch (deleteError) {
            Alert.alert('Failed', 'Unable to delete address right now.');
          } finally {
            setBusyAddressId(null);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={22} color={COLORS.forestDark} />
          </Pressable>

          <Heading1 style={styles.title}>Manage Addresses</Heading1>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color={COLORS.gold} />
              <BodyM style={styles.loadingText}>Loading addresses...</BodyM>
            </View>
          ) : (
            <View style={styles.listWrap}>
              {sortedAddresses.map((address) => {
                const isEditing = editingId === address.id;
                const isBusy = busyAddressId === address.id;

                return (
                  <View key={address.id} style={styles.addressCard}>
                    <View style={styles.addressHeader}>
                      <View style={styles.addressMetaLeft}>
                        <View style={styles.iconWrap}>
                          <Feather
                            name={getIconByLabel(address.label)}
                            size={16}
                            color={COLORS.forestDark}
                          />
                        </View>
                        <View style={styles.addressInfoWrap}>
                          <View style={styles.labelRow}>
                            <LabelL style={styles.labelText}>{toLabelText(address.label)}</LabelL>
                            {address.is_default ? (
                              <View style={styles.defaultBadge}>
                                <BodyM style={styles.defaultBadgeText}>Default</BodyM>
                              </View>
                            ) : null}
                          </View>
                          {!isEditing ? (
                            <>
                              <BodyM style={styles.fullAddressText}>{address.full_address}</BodyM>
                              {address.landmark ? (
                                <BodyM style={styles.landmarkText}>{`Landmark: ${address.landmark}`}</BodyM>
                              ) : null}
                            </>
                          ) : null}
                        </View>
                      </View>
                    </View>

                    {isEditing ? (
                      <View style={styles.editWrap}>
                        <View style={styles.chipsRow}>
                          {LABEL_OPTIONS.map((option) => {
                            const selected = editForm.label === option;

                            return (
                              <Pressable
                                key={`edit-${option}`}
                                onPress={() => setEditForm((prev) => ({ ...prev, label: option }))}
                                style={[styles.chip, selected && styles.chipSelected]}
                              >
                                <BodyM style={[styles.chipText, selected && styles.chipTextSelected]}>
                                  {toLabelText(option)}
                                </BodyM>
                              </Pressable>
                            );
                          })}
                        </View>

                        <TextInput
                          onChangeText={(value) => setEditForm((prev) => ({ ...prev, full_address: value }))}
                          placeholder="Full address"
                          placeholderTextColor={COLORS.textMuted}
                          style={styles.input}
                          value={editForm.full_address}
                        />

                        <TextInput
                          onChangeText={(value) => setEditForm((prev) => ({ ...prev, landmark: value }))}
                          placeholder="Landmark (optional)"
                          placeholderTextColor={COLORS.textMuted}
                          style={styles.input}
                          value={editForm.landmark}
                        />

                        <Pressable
                          onPress={() =>
                            requestCurrentLocation(({ latitude, longitude }) =>
                              setEditForm((prev) => ({ ...prev, lat: latitude, lng: longitude }))
                            )
                          }
                          style={styles.locationBtn}
                        >
                          <Feather name="crosshair" size={14} color={COLORS.gold} />
                          <BodyM style={styles.locationBtnText}>Use Current Location</BodyM>
                        </Pressable>

                        <View style={styles.rowActions}>
                          <Button fullWidth={false} onPress={() => setEditingId(null)} variant="secondary">
                            Cancel
                          </Button>
                          <Button
                            fullWidth={false}
                            onPress={handleSaveEdit}
                            variant="primary"
                            disabled={savingEdit}
                          >
                            {savingEdit ? 'Saving...' : 'Save'}
                          </Button>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.cardActionsRow}>
                        {!address.is_default ? (
                          <Pressable
                            onPress={() => handleSetDefault(address.id)}
                            style={styles.setDefaultBtn}
                            disabled={isBusy}
                          >
                            <BodyM style={styles.setDefaultText}>
                              {isBusy ? 'Setting...' : 'Set as Default'}
                            </BodyM>
                          </Pressable>
                        ) : (
                          <View />
                        )}

                        <View style={styles.sideActions}>
                          <Pressable onPress={() => startEditing(address)} style={styles.actionBtn}>
                            <BodyM style={styles.editText}>Edit</BodyM>
                          </Pressable>
                          <Pressable onPress={() => handleDelete(address.id)} style={styles.actionBtn}>
                            <BodyM style={styles.deleteText}>Delete</BodyM>
                          </Pressable>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}

              {!loading && sortedAddresses.length === 0 ? (
                <BodyM style={styles.emptyText}>No saved addresses yet. Add your first address below.</BodyM>
              ) : null}
            </View>
          )}

          <View style={styles.formCard}>
            <LabelL style={styles.sectionTitle}>Add New Address</LabelL>

            <View style={styles.chipsRow}>
              {LABEL_OPTIONS.map((option) => {
                const selected = newForm.label === option;

                return (
                  <Pressable
                    key={option}
                    onPress={() => setNewForm((prev) => ({ ...prev, label: option }))}
                    style={[styles.chip, selected && styles.chipSelected]}
                  >
                    <BodyM style={[styles.chipText, selected && styles.chipTextSelected]}>
                      {toLabelText(option)}
                    </BodyM>
                  </Pressable>
                );
              })}
            </View>

            <TextInput
              onChangeText={(value) => setNewForm((prev) => ({ ...prev, full_address: value }))}
              placeholder="Full address"
              placeholderTextColor={COLORS.textMuted}
              style={styles.input}
              value={newForm.full_address}
            />

            <TextInput
              onChangeText={(value) => setNewForm((prev) => ({ ...prev, landmark: value }))}
              placeholder="Landmark (optional)"
              placeholderTextColor={COLORS.textMuted}
              style={styles.input}
              value={newForm.landmark}
            />

            <Pressable
              onPress={() =>
                requestCurrentLocation(({ latitude, longitude }) =>
                  setNewForm((prev) => ({ ...prev, lat: latitude, lng: longitude }))
                )
              }
              style={styles.locationBtn}
            >
              <Feather name="crosshair" size={14} color={COLORS.gold} />
              <BodyM style={styles.locationBtnText}>Use Current Location</BodyM>
            </Pressable>

            <Button onPress={handleSaveNewAddress} variant="primary" disabled={savingNew}>
              {savingNew ? 'Saving Address...' : 'Save Address'}
            </Button>
          </View>

          {error ? <BodyM style={styles.errorText}>{error}</BodyM> : null}
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
    paddingBottom: SPACING['3xl'],
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingTop: SPACING.base,
  },
  loadingWrap: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.creamDark,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    marginBottom: SPACING.base,
    padding: SPACING.base,
  },
  loadingText: {
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  listWrap: {
    marginBottom: SPACING.base,
  },
  addressCard: {
    ...SHADOWS.elevation1,
    backgroundColor: COLORS.white,
    borderColor: COLORS.creamDark,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    marginBottom: SPACING.base,
    padding: SPACING.base,
  },
  addressHeader: {
    marginBottom: SPACING.sm,
  },
  addressMetaLeft: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: COLORS.cream,
    borderRadius: RADIUS.pill,
    height: 30,
    justifyContent: 'center',
    marginTop: 2,
    width: 30,
  },
  addressInfoWrap: {
    flex: 1,
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: 2,
  },
  labelText: {
    color: COLORS.forestDark,
    textTransform: 'capitalize',
  },
  defaultBadge: {
    backgroundColor: COLORS.goldPale,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  defaultBadgeText: {
    color: COLORS.statusWarning,
    fontFamily: FONTS.bodySemiBold,
    fontSize: TYPOGRAPHY.caption.fontSize,
    lineHeight: TYPOGRAPHY.caption.lineHeight,
  },
  fullAddressText: {
    color: COLORS.forestDark,
  },
  landmarkText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.caption.fontSize,
    lineHeight: TYPOGRAPHY.caption.lineHeight,
    marginTop: 2,
  },
  cardActionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  setDefaultBtn: {
    backgroundColor: COLORS.goldPale,
    borderColor: COLORS.gold,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    minHeight: 34,
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
  },
  setDefaultText: {
    color: COLORS.forestDark,
    fontFamily: FONTS.bodySemiBold,
  },
  sideActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionBtn: {
    minHeight: 34,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  editText: {
    color: COLORS.gold,
    fontFamily: FONTS.bodySemiBold,
  },
  deleteText: {
    color: COLORS.statusError,
    fontFamily: FONTS.bodySemiBold,
  },
  editWrap: {
    gap: SPACING.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  chip: {
    backgroundColor: COLORS.cream,
    borderColor: COLORS.creamDark,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    minHeight: 34,
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
  },
  chipSelected: {
    backgroundColor: COLORS.forestDark,
    borderColor: COLORS.forestDark,
  },
  chipText: {
    color: COLORS.forestDark,
    fontFamily: FONTS.bodyMedium,
  },
  chipTextSelected: {
    color: COLORS.cream,
    fontFamily: FONTS.bodySemiBold,
  },
  input: {
    backgroundColor: COLORS.cream,
    borderColor: COLORS.creamDark,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    color: COLORS.forestDark,
    fontFamily: FONTS.body,
    fontSize: TYPOGRAPHY.bodyM.fontSize,
    lineHeight: TYPOGRAPHY.bodyM.lineHeight,
    minHeight: 44,
    paddingHorizontal: SPACING.md,
  },
  locationBtn: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    minHeight: 34,
  },
  locationBtnText: {
    color: COLORS.gold,
    fontFamily: FONTS.bodySemiBold,
  },
  rowActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  emptyText: {
    color: COLORS.textSecondary,
  },
  formCard: {
    ...SHADOWS.elevation1,
    backgroundColor: COLORS.white,
    borderColor: COLORS.creamDark,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: SPACING.sm,
    marginBottom: SPACING.base,
    padding: SPACING.base,
  },
  sectionTitle: {
    color: COLORS.forestDark,
  },
  errorText: {
    color: COLORS.statusError,
  },
});
