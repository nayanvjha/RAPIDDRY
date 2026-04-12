import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { BodyM } from '../ui';
import { COLORS, LAYOUT, RADIUS, SPACING } from '../../constants';
import type { RootStackParamList } from '../../types/navigation';

type TabKey = 'dashboard' | 'earnings' | 'profile';

type AgentBottomNavProps = {
  activeTab: TabKey;
};

const TABS: Array<{ key: TabKey; label: string; route: keyof RootStackParamList }> = [
  { key: 'dashboard', label: 'Dashboard', route: 'AgentDashboard' },
  { key: 'earnings', label: 'Earnings', route: 'AgentEarnings' },
  { key: 'profile', label: 'Profile', route: 'AgentProfile' },
];

export const AgentBottomNav = ({ activeTab }: AgentBottomNavProps) => {
  const navigation = useNavigation();

  return (
    <View style={styles.wrapper}>
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;

        return (
          <Pressable
            key={tab.key}
            onPress={() => {
              if (!isActive) {
                navigation.navigate(tab.route as never);
              }
            }}
            style={[styles.tabButton, isActive && styles.tabButtonActive]}
          >
            <BodyM style={[styles.tabText, isActive && styles.tabTextActive]}>{tab.label}</BodyM>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.forestMid,
    borderColor: COLORS.forestLight,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: SPACING.sm,
    justifyContent: 'space-between',
    marginBottom: SPACING.base,
    marginHorizontal: LAYOUT.screenPaddingHorizontal,
    padding: 6,
  },
  tabButton: {
    alignItems: 'center',
    borderRadius: RADIUS.pill,
    flex: 1,
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: SPACING.sm,
  },
  tabButtonActive: {
    backgroundColor: COLORS.gold,
  },
  tabText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  tabTextActive: {
    color: COLORS.forestDark,
  },
});