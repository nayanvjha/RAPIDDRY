import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';

import { BodyM, DisplayL, LabelM } from '../components/ui';
import { AgentBottomNav } from '../components/shared/AgentBottomNav';
import { resolveApiBaseUrl } from '../config/api';
import { COLORS, LAYOUT, RADIUS, SPACING } from '../constants';
import api from '../services/api';
import { useAgentAuthStore } from '../store/authStore';

type AgentUserProfile = {
  id: string;
  name: string | null;
  phone: string;
  created_at?: string;
};

type EarningsSnapshot = {
  delivery_count: number;
};

const formatMemberSince = (rawDate: string | undefined) => {
  if (!rawDate) {
    return 'N/A';
  }

  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) {
    return 'N/A';
  }

  return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
};

export const AgentProfileScreen = () => {
  const user = useAgentAuthStore((state) => state.user);
  const token = useAgentAuthStore((state) => state.token);
  const clearAuth = useAgentAuthStore((state) => state.clearAuth);

  const [isLoading, setIsLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [totalDeliveries, setTotalDeliveries] = useState(0);
  const [memberSince, setMemberSince] = useState('N/A');

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const loadProfileData = async () => {
        setIsLoading(true);
        try {
          const apiBaseUrl = await resolveApiBaseUrl();
          const [profileResponse, earningsResponse] = await Promise.all([
            axios.get<{ success: boolean; data: AgentUserProfile }>(`${apiBaseUrl}/auth/me`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
            api.get<{ success: boolean; data: EarningsSnapshot }>('/earnings', {
              params: { period: 'month' },
            }),
          ]);

          if (!isMounted) {
            return;
          }

          setMemberSince(formatMemberSince(profileResponse.data?.data?.created_at));
          setTotalDeliveries(Number(earningsResponse.data?.data?.delivery_count ?? 0));
        } catch {
          if (isMounted) {
            Alert.alert('Profile Error', 'Unable to load profile insights right now.');
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };

      loadProfileData();

      return () => {
        isMounted = false;
      };
    }, [token])
  );

  const initial = useMemo(() => {
    const candidate = user?.name?.trim() || user?.phone || 'A';
    return candidate.charAt(0).toUpperCase();
  }, [user?.name, user?.phone]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Do you want to logout from the agent app?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await clearAuth();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screenWrap}>
        <ScrollView contentContainerStyle={styles.content}>
          <DisplayL>My Profile</DisplayL>

          <View style={styles.headerCard}>
            <View style={styles.avatarCircle}>
              <LabelM style={styles.avatarText}>{initial}</LabelM>
            </View>

            <View style={styles.headerTextWrap}>
              <LabelM style={styles.nameText}>{user?.name?.trim() || 'Agent'}</LabelM>
              <BodyM style={styles.phoneText}>{user?.phone || 'Phone unavailable'}</BodyM>
              <BodyM style={styles.ratingText}>4.9 ⭐ (142 reviews)</BodyM>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <LabelM style={styles.kicker}>Total Deliveries</LabelM>
              {isLoading ? <ActivityIndicator color={COLORS.gold} size="small" /> : <BodyM>{totalDeliveries}</BodyM>}
            </View>
            <View style={styles.statCard}>
              <LabelM style={styles.kicker}>Member Since</LabelM>
              {isLoading ? <ActivityIndicator color={COLORS.gold} size="small" /> : <BodyM>{memberSince}</BodyM>}
            </View>
          </View>

          <View style={styles.card}>
            <LabelM style={styles.kicker}>Documents</LabelM>
            <View style={styles.rowBetween}>
              <BodyM>Aadhaar</BodyM>
              <BodyM style={styles.verifiedText}>✅ Verified</BodyM>
            </View>
            <View style={styles.rowBetween}>
              <BodyM>DL</BodyM>
              <BodyM style={styles.pendingText}>❌ Pending</BodyM>
            </View>
          </View>

          <View style={styles.card}>
            <LabelM style={styles.kicker}>Settings</LabelM>

            <View style={styles.rowBetween}>
              <BodyM>Notifications</BodyM>
              <Switch
                onValueChange={setNotificationsEnabled}
                thumbColor={notificationsEnabled ? COLORS.gold : '#8A9B98'}
                trackColor={{ false: '#2E4B46', true: '#39635B' }}
                value={notificationsEnabled}
              />
            </View>

            <Pressable onPress={() => Alert.alert('Help & Support', 'Contact support@rapidry.in for assistance.')}>
              <BodyM style={styles.actionText}>Help & Support</BodyM>
            </Pressable>

            <Pressable onPress={handleLogout}>
              <BodyM style={styles.logoutText}>Logout</BodyM>
            </Pressable>
          </View>
        </ScrollView>
        <AgentBottomNav activeTab="profile" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.forestDark,
    flex: 1,
  },
  screenWrap: {
    flex: 1,
  },
  content: {
    gap: SPACING.lg,
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingVertical: SPACING.xl,
  },
  headerCard: {
    alignItems: 'center',
    backgroundColor: COLORS.forestMid,
    borderRadius: RADIUS.xl,
    flexDirection: 'row',
    gap: SPACING.base,
    padding: LAYOUT.cardPaddingLarge,
  },
  avatarCircle: {
    alignItems: 'center',
    backgroundColor: COLORS.gold,
    borderRadius: RADIUS.pill,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  avatarText: {
    color: COLORS.forestDark,
    fontSize: 28,
    lineHeight: 34,
  },
  headerTextWrap: {
    flex: 1,
    gap: 4,
  },
  nameText: {
    color: COLORS.cream,
    fontSize: 18,
    lineHeight: 24,
  },
  phoneText: {
    color: COLORS.textMuted,
  },
  ratingText: {
    color: COLORS.gold,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  statCard: {
    backgroundColor: COLORS.forestMid,
    borderRadius: RADIUS.xl,
    flex: 1,
    gap: SPACING.sm,
    minHeight: 96,
    justifyContent: 'center',
    padding: LAYOUT.cardPadding,
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
  rowBetween: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  verifiedText: {
    color: '#34D399',
  },
  pendingText: {
    color: '#F59E0B',
  },
  actionText: {
    color: COLORS.cream,
    marginTop: SPACING.sm,
  },
  logoutText: {
    color: '#FFB4A8',
    marginTop: SPACING.sm,
  },
});
