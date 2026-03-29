import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';

import { Button, BodyM, Heading1, LabelL } from '../components/ui';
import { COLORS, FONTS, LAYOUT, RADIUS, SPACING, TYPOGRAPHY } from '../constants';

type DateOption = {
  key: string;
  value: Date;
  dayLabel: string;
  dateLabel: string;
  monthLabel: string;
  isToday: boolean;
};

const TIME_SLOTS = [
  '7:00 AM - 9:00 AM',
  '9:00 AM - 11:00 AM',
  '11:00 AM - 1:00 PM',
  '2:00 PM - 4:00 PM',
  '4:00 PM - 6:00 PM',
  '6:00 PM - 8:00 PM',
] as const;

const buildDateOptions = (): DateOption[] => {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return Array.from({ length: 7 }, (_, index) => {
    const nextDate = new Date(todayStart);
    nextDate.setDate(todayStart.getDate() + index + 1);

    const dayLabel = nextDate.toLocaleDateString('en-US', { weekday: 'short' });
    const monthLabel = nextDate.toLocaleDateString('en-US', { month: 'short' });

    return {
      key: nextDate.toISOString(),
      value: nextDate,
      dayLabel,
      dateLabel: String(nextDate.getDate()),
      monthLabel,
      isToday:
        nextDate.getDate() === todayStart.getDate() &&
        nextDate.getMonth() === todayStart.getMonth() &&
        nextDate.getFullYear() === todayStart.getFullYear(),
    };
  });
};

export const PickupSchedulingScreen = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const dateOptions = useMemo(() => buildDateOptions(), []);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const selectedDate = useMemo(() => {
    return dateOptions.find((option) => option.key === selectedDateKey) ?? null;
  }, [dateOptions, selectedDateKey]);

  const isContinueDisabled = !selectedDate || !selectedSlot;

  const handleContinue = () => {
    if (!selectedDate || !selectedSlot) {
      return;
    }

    navigation.navigate('CartReview', {
      pickupDate: selectedDate.value.toISOString(),
      pickupSlot: selectedSlot,
      specialInstructions: specialInstructions.trim(),
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={22} color={COLORS.forestDark} />
          </Pressable>

          <Heading1 style={styles.title}>Schedule Pickup</Heading1>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <LabelL style={styles.sectionTitle}>Pick a Date</LabelL>

            <ScrollView
              horizontal
              contentContainerStyle={styles.calendarRow}
              showsHorizontalScrollIndicator={false}
            >
              {dateOptions.map((option) => {
                const isSelected = option.key === selectedDateKey;

                return (
                  <Pressable
                    key={option.key}
                    onPress={() => setSelectedDateKey(option.key)}
                    style={[
                      styles.dateCard,
                      option.isToday && styles.todayCard,
                      isSelected && styles.selectedDateCard,
                    ]}
                  >
                    <BodyM style={[styles.dayText, isSelected && styles.selectedDateText]}>
                      {option.dayLabel}
                    </BodyM>
                    <LabelL style={[styles.dateText, isSelected && styles.selectedDateText]}>
                      {option.dateLabel}
                    </LabelL>
                    <BodyM style={[styles.monthText, isSelected && styles.selectedDateText]}>
                      {option.monthLabel}
                    </BodyM>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <LabelL style={styles.sectionTitle}>Select Time Slot</LabelL>

            <View style={styles.timeSlotGrid}>
              {TIME_SLOTS.map((slot) => {
                const isSelected = selectedSlot === slot;

                return (
                  <Pressable
                    key={slot}
                    onPress={() => setSelectedSlot(slot)}
                    style={[styles.timeSlotChip, isSelected && styles.selectedSlotChip]}
                  >
                    <BodyM style={[styles.timeSlotText, isSelected && styles.selectedSlotText]}>
                      {slot}
                    </BodyM>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <LabelL style={styles.sectionTitle}>Special Instructions</LabelL>
            <TextInput
              multiline
              numberOfLines={4}
              onChangeText={setSpecialInstructions}
              placeholder="Any special instructions? (optional)"
              placeholderTextColor={COLORS.textSecondary}
              style={styles.instructionsInput}
              textAlignVertical="top"
              value={specialInstructions}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button disabled={isContinueDisabled} onPress={handleContinue} variant="primary">
            Continue
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
    gap: SPACING.xl,
    paddingBottom: SPACING['2xl'],
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingTop: SPACING.base,
  },
  section: {
    gap: SPACING.md,
  },
  sectionTitle: {
    color: COLORS.forestDark,
    fontFamily: FONTS.bodySemiBold,
  },
  calendarRow: {
    gap: SPACING.sm,
    paddingRight: SPACING.base,
  },
  dateCard: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.creamDark,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: 2,
    minWidth: 72,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.md,
  },
  todayCard: {
    borderColor: COLORS.gold,
  },
  selectedDateCard: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  dayText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.bodyMedium,
    fontSize: TYPOGRAPHY.bodyM.fontSize,
    lineHeight: TYPOGRAPHY.bodyM.lineHeight,
  },
  dateText: {
    color: COLORS.forestDark,
    fontFamily: FONTS.bodySemiBold,
    fontSize: TYPOGRAPHY.labelL.fontSize,
    lineHeight: TYPOGRAPHY.labelL.lineHeight,
  },
  monthText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.bodyMedium,
    fontSize: TYPOGRAPHY.caption.fontSize,
    lineHeight: TYPOGRAPHY.caption.lineHeight,
    textTransform: 'uppercase',
  },
  selectedDateText: {
    color: COLORS.cream,
  },
  timeSlotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  timeSlotChip: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.forestDark,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    minHeight: 52,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    width: '48.5%',
  },
  selectedSlotChip: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  timeSlotText: {
    color: COLORS.forestDark,
    fontFamily: FONTS.bodyMedium,
    textAlign: 'center',
  },
  selectedSlotText: {
    color: COLORS.white,
    fontFamily: FONTS.bodySemiBold,
  },
  instructionsInput: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.creamDark,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    color: COLORS.forestDark,
    fontFamily: FONTS.body,
    fontSize: TYPOGRAPHY.bodyM.fontSize,
    lineHeight: TYPOGRAPHY.bodyM.lineHeight,
    minHeight: 112,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  footer: {
    backgroundColor: COLORS.cream,
    borderTopColor: 'rgba(15,46,42,0.08)',
    borderTopWidth: 1,
    paddingBottom: SPACING.lg,
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingTop: SPACING.base,
  },
});
