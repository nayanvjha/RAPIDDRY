import axios from 'axios';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { resolveApiBaseUrl } from '../config/api';
import { COLORS, LAYOUT, RADIUS, SPACING } from '../constants';
import { useAgentAuthStore } from '../store/authStore';
import { BodyM, Button, DisplayL, LabelM } from '../components/ui';

export const AgentLoginScreen = () => {
  const setAuth = useAgentAuthStore((state) => state.setAuth);

  const [phone, setPhone] = useState('7667625880');
  const [password, setPassword] = useState('agent123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isFormValid = useMemo(() => {
    return phone.trim().length > 0 && password.trim().length > 0;
  }, [phone, password]);

  const handleLogin = async () => {
    if (!isFormValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const apiBaseUrl = await resolveApiBaseUrl();
      const response = await axios.post<{
        success: boolean;
        data: {
          token: string;
          user: {
            id: string;
            name: string | null;
            phone: string;
            email: string | null;
            role: string;
            avatar_url: string | null;
          };
        };
      }>(`${apiBaseUrl}/auth/verify-token`, {
        idToken: 'mock-id-token',
      });

      await setAuth(response.data.data.user, response.data.data.token);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message ?? 'Login failed. Please try again.');
      } else {
        setErrorMessage('Login failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.container}
      >
        <View style={styles.header}>
          <LabelM style={styles.kicker}>Rapidry Agent</LabelM>
          <DisplayL>Sign In</DisplayL>
          <BodyM style={styles.subText}>Enter your phone and password to access your work queue.</BodyM>
        </View>

        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <LabelM style={styles.label}>Phone</LabelM>
            <TextInput
              autoCapitalize="none"
              keyboardType="phone-pad"
              onChangeText={setPhone}
              placeholder="Phone number"
              placeholderTextColor={COLORS.textMuted}
              style={styles.input}
              value={phone}
            />
          </View>

          <View style={styles.inputGroup}>
            <LabelM style={styles.label}>Password</LabelM>
            <TextInput
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
              style={styles.input}
              value={password}
            />
          </View>

          {errorMessage ? <BodyM style={styles.errorText}>{errorMessage}</BodyM> : null}

          <Button disabled={!isFormValid || isSubmitting} onPress={handleLogin}>
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>

          {isSubmitting ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={COLORS.gold} size="small" />
            </View>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.forestDark,
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
  },
  header: {
    marginBottom: SPACING['2xl'],
  },
  kicker: {
    color: COLORS.gold,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  subText: {
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
  },
  formCard: {
    backgroundColor: COLORS.forestMid,
    borderRadius: RADIUS.xl,
    gap: SPACING.lg,
    padding: LAYOUT.cardPaddingLarge,
  },
  inputGroup: {
    gap: SPACING.sm,
  },
  label: {
    color: COLORS.cream,
  },
  input: {
    backgroundColor: COLORS.forestLight,
    borderColor: COLORS.forestLight,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    color: COLORS.cream,
    minHeight: 48,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  errorText: {
    color: '#FFB4A8',
  },
  loadingRow: {
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
});
