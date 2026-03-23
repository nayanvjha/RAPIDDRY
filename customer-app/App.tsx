import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { COLORS } from './src/constants';
import { HomeScreen } from './src/screens/HomeScreen';
import { OTPVerificationScreen } from './src/screens/OTPVerificationScreen';
import { PhoneLoginScreen } from './src/screens/PhoneLoginScreen';
import { ServiceDetailScreen } from './src/screens/ServiceDetailScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import { useAuthStore } from './src/store/authStore';

export type RootStackParamList = {
  Splash: undefined;
  PhoneLogin: undefined;
  OTPVerification: {
    phoneNumber: string;
  };
  Home: undefined;
  ServiceDetail: {
    serviceId: string;
    serviceName?: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" color={COLORS.gold} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isAuthenticated ? 'Home' : 'Splash'}
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} />
          <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderWrap: {
    alignItems: 'center',
    backgroundColor: COLORS.cream,
    flex: 1,
    justifyContent: 'center',
  },
});
