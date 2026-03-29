import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { signInWithPhoneNumber } from 'firebase/auth';

import { auth } from '../config/firebase';
import { Button } from '../components/ui';
import { COLORS, FONTS, LAYOUT, RADIUS, SPACING, TYPOGRAPHY } from '../constants';
import { useAuthStore } from '../store/authStore';

export const PhoneLoginScreen = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const setConfirmationResult = useAuthStore((state) => state.setConfirmationResult);

  const [phone, setPhone] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const sanitizedPhone = useMemo(() => phone.replace(/\D/g, '').slice(0, 10), [phone]);
  const canSendOtp = sanitizedPhone.length === 10 && !isSending;
  const isFloating = isFocused || sanitizedPhone.length > 0;

  const handleSendOtp = async () => {
    if (!canSendOtp) {
      return;
    }

    try {
      setIsSending(true);
      const fullPhone = `+91${sanitizedPhone}`;
      
      // MOCK BYPASS FOR TESTING
      // Since Firebase JS SDK requires Recaptcha which isn't easy in bare React Native
      const testNumbers = ['+919999999999', '+918306581102'];
      
      if (testNumbers.includes(fullPhone)) {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Use a mock confirmation object
        const mockConfirmation = {
          verificationId: 'mock-verification-id',
          confirm: async (code: string) => {
            if (code === '123456') {
              return {
                user: {
                  getIdToken: async () => 'mock-id-token',
                  phoneNumber: fullPhone,
                }
              };
            }
            throw new Error('Invalid mock OTP');
          }
        };
        
        setConfirmationResult(mockConfirmation as any, fullPhone);
        navigation.navigate('OTPVerification', { phoneNumber: fullPhone });
        return;
      }

      if (!auth) {
        Alert.alert('Firebase Not Configured', 'Please add EXPO_PUBLIC_FIREBASE_* environment variables');
        return;
      }

      // We'd normally need a RecaptchaVerifier here for Firebase Web SDK in React Native
      // const appVerifier = new RecaptchaVerifier(auth, 'sign-in-button', { size: 'invisible' });
      // const confirmation = await signInWithPhoneNumber(auth, fullPhone, appVerifier);
      
      // For now, if it's not a test number, we throw as Firebase Web SDK requires Recaptcha
      throw new Error('Recaptcha required for real numbers');
      
    } catch (error: any) {
      console.error('OTP Error:', error);
      Alert.alert('OTP Failed', error?.message || 'Unable to send OTP. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={22} color={COLORS.forestDark} />
        </Pressable>

        <View style={styles.headingWrap}>
          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.subHeading}>Enter your phone number to continue</Text>
        </View>

        <View style={styles.fieldWrap}>
          <View style={styles.phoneField}>
            <View style={styles.countryCodeWrap}>
              <Text style={styles.countryFlag}>IN</Text>
              <Text style={styles.countryCode}>+91</Text>
            </View>

            <View style={styles.inputWrap}>
              <Text
                style={[
                  styles.floatingLabel,
                  isFloating && styles.floatingLabelActive,
                  isFocused && styles.floatingLabelFocused,
                ]}
              >
                Phone number
              </Text>

              <TextInput
                keyboardType="number-pad"
                value={sanitizedPhone}
                onChangeText={setPhone}
                maxLength={10}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                style={styles.input}
                placeholder=""
              />
            </View>
          </View>
        </View>

        <View style={styles.buttonWrap}>
          <Button variant="primary" disabled={!canSendOtp} onPress={handleSendOtp}>
            {isSending ? 'Sending...' : 'Send OTP'}
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
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
  },
  backButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    marginTop: SPACING.sm,
    width: 44,
  },
  headingWrap: {
    marginTop: 24,
  },
  heading: {
    ...TYPOGRAPHY.displayL,
    color: COLORS.forestDark,
  },
  subHeading: {
    ...TYPOGRAPHY.bodyM,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  fieldWrap: {
    marginTop: 40,
  },
  phoneField: {
    borderBottomColor: COLORS.forestMid,
    borderBottomWidth: 1.5,
    flexDirection: 'row',
    minHeight: 56,
  },
  countryCodeWrap: {
    alignItems: 'center',
    borderRightColor: 'rgba(15,46,42,0.2)',
    borderRightWidth: 1,
    flexDirection: 'row',
    minWidth: 78,
    paddingRight: 10,
  },
  countryFlag: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.bodySemiBold,
    fontSize: 12,
    marginRight: 6,
  },
  countryCode: {
    color: COLORS.forestDark,
    fontFamily: FONTS.bodySemiBold,
    fontSize: 16,
  },
  inputWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 12,
    position: 'relative',
  },
  floatingLabel: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.body,
    fontSize: 15,
    left: 12,
    position: 'absolute',
    top: 18,
  },
  floatingLabelActive: {
    fontFamily: FONTS.displayItalic,
    fontSize: 12,
    top: 4,
  },
  floatingLabelFocused: {
    color: COLORS.gold,
  },
  input: {
    ...TYPOGRAPHY.bodyL,
    color: COLORS.forestDark,
    paddingBottom: 8,
    paddingTop: 20,
  },
  buttonWrap: {
    marginTop: 40,
  },
});
