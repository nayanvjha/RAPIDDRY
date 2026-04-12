import React, { useEffect, useRef, useState } from 'react';
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
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { signInWithPhoneNumber } from 'firebase/auth';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';

import { auth, firebaseConfig } from '../config/firebase';
import { COLORS, FONTS, LAYOUT, RADIUS, SPACING, TYPOGRAPHY } from '../constants';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';

const DEV_OTP_CODE = '123456';

const shouldUseDevOtpFallback = (error: any) => {
  const code = error?.code ?? '';
  return code === 'auth/billing-not-enabled' || code === 'auth/operation-not-allowed';
};

const buildDevConfirmation = (phoneNumber: string) => {
  return {
    verificationId: 'dev-verification-id',
    confirm: async (code: string) => {
      if (code !== DEV_OTP_CODE) {
        throw new Error('Invalid OTP');
      }

      return {
        user: {
          getIdToken: async () => 'mock-id-token',
          phoneNumber,
        },
      };
    },
  };
};

type RouteParams = {
  phoneNumber: string;
};

export const OTPVerificationScreen = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();

  const confirmationResult = useAuthStore((state) => state.confirmationResult);
  const savedPhoneNumber = useAuthStore((state) => state.phoneNumber);
  const setConfirmationResult = useAuthStore((state) => state.setConfirmationResult);
  const setAuth = useAuthStore((state) => state.setAuth);

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);

  const refs = useRef<Array<TextInput | null>>([]);
  const recaptchaVerifierRef = useRef<FirebaseRecaptchaVerifierModal | null>(null);

  const phoneNumber = route.params?.phoneNumber || savedPhoneNumber || '+91';

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const verifyOtp = async (code: string) => {
    if (!confirmationResult || code.length !== 6 || isVerifying) {
      return;
    }

    try {
      setIsVerifying(true);
      const userCredential = await confirmationResult.confirm(code);
      const idToken = await userCredential.user.getIdToken();

      const response = await api.post('/auth/verify-token', { idToken });
      const token = response.data?.data?.token;
      const user = response.data?.data?.user;

      if (!token || !user) {
        throw new Error('Invalid auth response');
      }

      await setAuth(user, token);
      setConfirmationResult(null, '');

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      Alert.alert('Invalid OTP', 'Please enter a valid code and try again.');
      setDigits(['', '', '', '', '', '']);
      refs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const onDigitChange = (value: string, index: number) => {
    const cleaned = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = cleaned;
    setDigits(next);

    if (cleaned && index < 5) {
      refs.current[index + 1]?.focus();
    }

    const code = next.join('');
    if (code.length === 6 && next.every((digit) => digit.length === 1)) {
      verifyOtp(code);
    }
  };

  const onKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) {
      return;
    }

    if (!auth) {
      Alert.alert('Firebase Not Configured');
      return;
    }

    try {
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifierRef.current ?? undefined
      );
      setConfirmationResult(confirmation, phoneNumber);
      setDigits(['', '', '', '', '', '']);
      refs.current[0]?.focus();
      setTimer(30);
    } catch (error) {
      if (shouldUseDevOtpFallback(error)) {
        setConfirmationResult(buildDevConfirmation(phoneNumber) as any, phoneNumber);
        setDigits(['', '', '', '', '', '']);
        refs.current[0]?.focus();
        setTimer(30);
        Alert.alert('Dev OTP Enabled', `Use OTP ${DEV_OTP_CODE} to continue in development.`);
        return;
      }

      Alert.alert('Resend Failed', 'Unable to resend OTP. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifierRef}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification
      />
      <View style={styles.container}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={22} color={COLORS.forestDark} />
        </Pressable>

        <View style={styles.headingWrap}>
          <Text style={styles.heading}>Verify OTP</Text>
          <Text style={styles.subHeading}>{`Enter the 6-digit code sent to ${phoneNumber}`}</Text>
        </View>

        <View style={styles.otpRow}>
          {digits.map((digit, index) => (
            <TextInput
              key={`otp-${index}`}
              ref={(input) => {
                refs.current[index] = input;
              }}
              value={digit}
              onChangeText={(text) => onDigitChange(text, index)}
              onKeyPress={({ nativeEvent }) => onKeyPress(nativeEvent.key, index)}
              keyboardType="number-pad"
              maxLength={1}
              style={styles.otpInput}
              autoFocus={index === 0}
            />
          ))}
        </View>

        <Pressable style={styles.resendWrap} onPress={handleResendOtp}>
          <Text style={styles.resendText}>
            {timer > 0 ? `Resend OTP in 00:${String(timer).padStart(2, '0')}` : 'Resend OTP'}
          </Text>
        </Pressable>

        {isVerifying ? <Text style={styles.verifying}>Verifying...</Text> : null}
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
  otpRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 40,
  },
  otpInput: {
    ...TYPOGRAPHY.heading1,
    backgroundColor: COLORS.white,
    borderColor: COLORS.creamDark,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    color: COLORS.forestDark,
    flex: 1,
    height: 56,
    textAlign: 'center',
  },
  resendWrap: {
    marginTop: 24,
  },
  resendText: {
    ...TYPOGRAPHY.labelM,
    color: COLORS.gold,
  },
  verifying: {
    ...TYPOGRAPHY.bodyM,
    color: COLORS.forestDark,
    marginTop: 24,
  },
});
