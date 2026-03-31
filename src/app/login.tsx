import { Stack } from 'expo-router';

import LoginScreen from '@/screens/auth/LoginScreen';

export default function LoginRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LoginScreen />
    </>
  );
}
