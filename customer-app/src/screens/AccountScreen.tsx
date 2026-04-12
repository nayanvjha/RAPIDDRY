import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import Constants from 'expo-constants';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';

import { BottomNavBar } from '../components/shared/BottomNavBar';
import { Button, BodyM, Heading1, LabelL } from '../components/ui';
import { COLORS, FONTS, LAYOUT, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../constants';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';

type AuthUser = {
  id: string;
  name: string | null;
  phone: string;
  email: string | null;
  role: string;
  avatar_url: string | null;
};

type Address = {
  id: string;
  label: string;
  full_address: string;
  landmark: string | null;
  is_default: boolean;
};

type ApiSuccessResponse<T> = {
  success: boolean;
  data: T;
};

const getInitial = (name: string | null, phone: string) => {
  const cleanName = name?.trim();
  if (cleanName) {
    return cleanName.charAt(0).toUpperCase();
  }

  return phone.replace(/\D/g, '').charAt(0) || 'U';
};

const getAddressIcon = (label: string) => {
  if (label.toLowerCase().includes('work') || label.toLowerCase().includes('office')) {
    return 'briefcase';
  }

  return 'home';
};

export const AccountScreen = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name?.trim() ?? '');
  const [isSavingName, setIsSavingName] = useState(false);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [addressesError, setAddressesError] = useState<string | null>(null);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  React.useEffect(() => {
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

  const displayName = user?.name?.trim() || 'Set Name';
  const displayPhone = user?.phone || '-';
  const avatarInitial = useMemo(() => getInitial(user?.name ?? null, user?.phone ?? ''), [user?.name, user?.phone]);

  const handleSaveName = async () => {
    if (!editingName || isSavingName) {
      return;
    }

    const normalizedName = nameInput.trim();
    const currentName = user?.name?.trim() ?? '';

    setEditingName(false);

    if (!normalizedName || normalizedName === currentName) {
      setNameInput(normalizedName || currentName);
      return;
    }

    try {
      setIsSavingName(true);
      const response = await api.patch<ApiSuccessResponse<AuthUser>>('/auth/me', {
        name: normalizedName,
      });

      const updatedUser = response.data?.data;

      if (updatedUser) {
        useAuthStore.setState((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : updatedUser,
        }));
        setNameInput(updatedUser.name?.trim() ?? normalizedName);
      } else {
        useAuthStore.setState((state) => ({
          user: state.user ? { ...state.user, name: normalizedName } : state.user,
        }));
      }
    } catch (error) {
      Alert.alert('Update Failed', 'Unable to update your name right now.');
      setNameInput(currentName);
    } finally {
      setIsSavingName(false);
    }
  };

  const confirmLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await clearAuth();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Splash' }],
          });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Heading1 style={styles.title}>Profile</Heading1>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.profileCard}>
            <View style={styles.profileTopRow}>
              <View style={styles.avatar}>
                <LabelL style={styles.avatarText}>{avatarInitial}</LabelL>
              </View>

              <View style={styles.profileTextWrap}>
                {editingName ? (
                  <TextInput
                    autoFocus
                    onBlur={handleSaveName}
                    onChangeText={setNameInput}
                    onSubmitEditing={handleSaveName}
                    placeholder="Set Name"
                    placeholderTextColor={COLORS.textMuted}
                    style={styles.nameInput}
                    value={nameInput}
                  />
                ) : (
                  <Pressable onPress={() => setEditingName(true)} style={styles.namePressable}>
                    <LabelL style={styles.nameText}>{displayName}</LabelL>
                    <Feather name="edit-2" size={14} color={COLORS.gold} />
                  </Pressable>
                )}

                <BodyM style={styles.phoneText}>{displayPhone}</BodyM>
                {isSavingName ? <BodyM style={styles.savingText}>Saving name...</BodyM> : null}
              </View>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <LabelL style={styles.sectionTitle}>Saved Addresses</LabelL>
              <Pressable onPress={() => navigation.navigate('AddressScreen')}>
                <BodyM style={styles.actionLink}>Add Address</BodyM>
              </Pressable>
            </View>

            <Pressable onPress={() => navigation.navigate('AddressScreen')} style={styles.manageAddressesLink}>
              <BodyM style={styles.manageAddressesText}>Manage Addresses</BodyM>
              <Feather name="chevron-right" size={16} color={COLORS.gold} />
            </Pressable>

            {addressesLoading ? (
              <BodyM style={styles.loadingText}>Loading addresses...</BodyM>
            ) : addresses.length === 0 ? (
              <BodyM style={styles.emptyText}>No saved addresses yet.</BodyM>
            ) : (
              <View style={styles.addressList}>
                {addresses.map((address) => (
                  <View key={address.id} style={styles.addressRow}>
                    <View style={styles.addressIconWrap}>
                      <Feather
                        name={getAddressIcon(address.label)}
                        size={16}
                        color={COLORS.forestDark}
                      />
                    </View>

                    <View style={styles.addressTextWrap}>
                      <View style={styles.addressHeaderRow}>
                        <LabelL style={styles.addressLabel}>{address.label}</LabelL>
                        {address.is_default ? (
                          <View style={styles.defaultBadge}>
                            <BodyM style={styles.defaultBadgeText}>Default</BodyM>
                          </View>
                        ) : null}
                      </View>

                      <BodyM style={styles.addressFull}>{address.full_address}</BodyM>
                      {address.landmark ? (
                        <BodyM style={styles.addressLandmark}>{`Landmark: ${address.landmark}`}</BodyM>
                      ) : null}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {addressesError ? <BodyM style={styles.errorText}>{addressesError}</BodyM> : null}
          </View>

          <View style={styles.sectionCard}>
            <LabelL style={styles.sectionTitle}>App Settings</LabelL>

            <View style={styles.settingRow}>
              <BodyM style={styles.settingText}>Notifications</BodyM>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: COLORS.creamDark, true: COLORS.goldLight }}
                thumbColor={notificationsEnabled ? COLORS.forestDark : COLORS.textMuted}
              />
            </View>

            <Pressable
              onPress={() => Alert.alert('Rapidry', `Version ${appVersion}`)}
              style={styles.settingRow}
            >
              <BodyM style={styles.settingText}>About</BodyM>
              <BodyM style={styles.settingMeta}>{`v${appVersion}`}</BodyM>
            </Pressable>

            <Pressable
              onPress={() => Alert.alert('Help & Support', 'Contact: support@rapidry.in')}
              style={styles.settingRow}
            >
              <BodyM style={styles.settingText}>Help & Support</BodyM>
              <Feather name="chevron-right" size={18} color={COLORS.textMuted} />
            </Pressable>
          </View>

          <Pressable onPress={confirmLogout} style={styles.logoutButton}>
            <Feather name="log-out" size={16} color={COLORS.statusError} />
            <BodyM style={styles.logoutText}>Logout</BodyM>
          </Pressable>
        </ScrollView>

        <BottomNavBar activeTab="Profile" />
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
  content: {
    paddingBottom: 96,
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingTop: SPACING.base,
  },
  profileCard: {
    ...SHADOWS.elevation1,
    backgroundColor: COLORS.white,
    borderColor: COLORS.creamDark,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    marginBottom: SPACING.base,
    padding: SPACING.base,
  },
  profileTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.md,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: COLORS.forestDark,
    borderRadius: RADIUS.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  avatarText: {
    color: COLORS.gold,
    fontFamily: FONTS.displayBold,
    fontSize: 17,
    lineHeight: 21,
  },
  profileTextWrap: {
    flex: 1,
    gap: 3,
  },
  namePressable: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 8,
  },
  nameText: {
    color: COLORS.forestDark,
    fontFamily: FONTS.displaySemiBold,
    fontSize: TYPOGRAPHY.heading2.fontSize,
    lineHeight: TYPOGRAPHY.heading2.lineHeight,
  },
  nameInput: {
    borderBottomColor: COLORS.gold,
    borderBottomWidth: 1,
    color: COLORS.forestDark,
    fontFamily: FONTS.displaySemiBold,
    fontSize: TYPOGRAPHY.heading2.fontSize,
    lineHeight: TYPOGRAPHY.heading2.lineHeight,
    minHeight: 34,
    paddingVertical: 0,
  },
  phoneText: {
    color: COLORS.textSecondary,
  },
  savingText: {
    color: COLORS.gold,
    fontFamily: FONTS.bodyMedium,
    fontSize: TYPOGRAPHY.caption.fontSize,
    lineHeight: TYPOGRAPHY.caption.lineHeight,
  },
  sectionCard: {
    ...SHADOWS.elevation1,
    backgroundColor: COLORS.white,
    borderColor: COLORS.creamDark,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    marginBottom: SPACING.base,
    padding: SPACING.base,
  },
  sectionHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    color: COLORS.forestDark,
  },
  actionLink: {
    color: COLORS.gold,
    fontFamily: FONTS.bodySemiBold,
    textDecorationLine: 'underline',
  },
  manageAddressesLink: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 4,
    marginBottom: SPACING.sm,
    marginTop: -2,
  },
  manageAddressesText: {
    color: COLORS.gold,
    fontFamily: FONTS.bodySemiBold,
  },
  loadingText: {
    color: COLORS.textSecondary,
  },
  emptyText: {
    color: COLORS.textSecondary,
  },
  addressList: {
    gap: SPACING.sm,
  },
  addressRow: {
    borderBottomColor: COLORS.creamDark,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  addressIconWrap: {
    alignItems: 'center',
    backgroundColor: COLORS.cream,
    borderRadius: RADIUS.pill,
    height: 28,
    justifyContent: 'center',
    marginTop: 2,
    width: 28,
  },
  addressTextWrap: {
    flex: 1,
  },
  addressHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: 2,
  },
  addressLabel: {
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
  addressFull: {
    color: COLORS.forestDark,
  },
  addressLandmark: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.caption.fontSize,
    lineHeight: TYPOGRAPHY.caption.lineHeight,
    marginTop: 2,
  },
  errorText: {
    color: COLORS.statusError,
    marginTop: SPACING.sm,
  },
  settingRow: {
    alignItems: 'center',
    borderBottomColor: COLORS.creamDark,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  settingText: {
    color: COLORS.forestDark,
  },
  settingMeta: {
    color: COLORS.textMuted,
  },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: '#FDECEC',
    borderColor: '#F7D3D3',
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: SPACING.sm,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: SPACING.base,
  },
  logoutText: {
    color: COLORS.statusError,
    fontFamily: FONTS.bodySemiBold,
  },
});
