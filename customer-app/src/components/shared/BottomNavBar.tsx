import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { COLORS, FONTS, LAYOUT, RADIUS } from '../../constants';

export type BottomTabKey = 'Home' | 'Services' | 'Orders' | 'Track' | 'Profile';

type BottomNavBarProps = {
  activeTab: BottomTabKey;
  onTabPress?: (tab: BottomTabKey) => void;
};

type TabItem = {
  key: BottomTabKey;
  label: string;
  renderIcon: (active: boolean) => React.ReactNode;
};

const TABS: TabItem[] = [
  {
    key: 'Home',
    label: 'Home',
    renderIcon: (active) => (
      <Feather name="home" size={20} color={active ? COLORS.forestDark : COLORS.textMuted} />
    ),
  },
  {
    key: 'Services',
    label: 'Services',
    renderIcon: (active) => (
      <MaterialIcons
        name={active ? 'miscellaneous-services' : 'miscellaneous-services'}
        size={21}
        color={active ? COLORS.forestDark : COLORS.textMuted}
      />
    ),
  },
  {
    key: 'Orders',
    label: 'Orders',
    renderIcon: (active) => (
      <Feather name="file-text" size={20} color={active ? COLORS.forestDark : COLORS.textMuted} />
    ),
  },
  {
    key: 'Track',
    label: 'Track',
    renderIcon: (active) => (
      <Feather name="map-pin" size={20} color={active ? COLORS.forestDark : COLORS.textMuted} />
    ),
  },
  {
    key: 'Profile',
    label: 'Profile',
    renderIcon: (active) => (
      <Feather name="user" size={20} color={active ? COLORS.forestDark : COLORS.textMuted} />
    ),
  },
];

export const BottomNavBar = ({ activeTab, onTabPress }: BottomNavBarProps) => {
  return (
    <View style={styles.wrapper}>
      {TABS.map((tab) => {
        const active = tab.key === activeTab;

        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabPress?.(tab.key)}
            style={styles.tab}
            hitSlop={8}
          >
            <View style={[styles.indicator, active && styles.activeIndicator]} />
            {tab.renderIcon(active)}
            <Text style={[styles.label, active && styles.activeLabel]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderTopColor: COLORS.creamDark,
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 72,
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: LAYOUT.minTouchTarget,
    minWidth: LAYOUT.minTouchTarget,
    width: '20%',
  },
  indicator: {
    borderRadius: RADIUS.pill,
    height: 3,
    marginBottom: 8,
    width: 20,
  },
  activeIndicator: {
    backgroundColor: COLORS.gold,
  },
  label: {
    color: COLORS.textMuted,
    fontFamily: FONTS.body,
    fontSize: 11,
    marginTop: 4,
  },
  activeLabel: {
    color: COLORS.forestDark,
    fontFamily: FONTS.bodySemiBold,
  },
});
