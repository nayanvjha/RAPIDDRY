import { NavigationContainer, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, View } from 'react-native';

import { AgentDashboardScreen } from './src/screens/AgentDashboardScreen';
import { AgentEarningsScreen } from './src/screens/AgentEarningsScreen';
import { AgentLoginScreen } from './src/screens/AgentLoginScreen';
import { AgentProfileScreen } from './src/screens/AgentProfileScreen';
import { AgentTaskDetailScreen } from './src/screens/AgentTaskDetailScreen';
import { AgentVerifyItemsScreen } from './src/screens/AgentVerifyItemsScreen';
import { COLORS } from './src/constants';
import { useAgentAuthStore } from './src/store/authStore';
import type { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme: Theme = {
  dark: true,
  colors: {
    primary: COLORS.gold,
    background: COLORS.forestDark,
    card: COLORS.forestMid,
    text: COLORS.cream,
    border: COLORS.forestLight,
    notification: COLORS.gold,
  },
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700',
    },
    heavy: {
      fontFamily: 'System',
      fontWeight: '800',
    },
  },
};

const App = () => {
  const isAuthenticated = useAgentAuthStore((state) => state.isAuthenticated);
  const isLoading = useAgentAuthStore((state) => state.isLoading);
  const checkAuth = useAgentAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingSafeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={COLORS.gold} size="large" />
        </View>
        <StatusBar style="light" />
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'AgentDashboard' : 'AgentLogin'}
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.forestDark,
          },
          headerTintColor: COLORS.cream,
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: COLORS.forestDark,
          },
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen
            component={AgentLoginScreen}
            name="AgentLogin"
            options={{
              headerShown: false,
            }}
          />
        ) : (
          <>
            <Stack.Screen
              component={AgentDashboardScreen}
              name="AgentDashboard"
              options={{
                title: 'Agent Dashboard',
              }}
            />
            <Stack.Screen
              component={AgentTaskDetailScreen}
              name="AgentTaskDetail"
              options={{
                title: 'Task Detail',
              }}
            />
            <Stack.Screen
              component={AgentVerifyItemsScreen}
              name="AgentVerifyItems"
              options={{
                title: 'Verify Items',
              }}
            />
            <Stack.Screen
              component={AgentEarningsScreen}
              name="AgentEarnings"
              options={{
                title: 'Earnings',
              }}
            />
            <Stack.Screen
              component={AgentProfileScreen}
              name="AgentProfile"
              options={{
                title: 'Profile',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingSafeArea: {
    backgroundColor: COLORS.forestDark,
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

export default App;
