import { Stack } from 'expo-router';
import { NativeBaseProvider } from 'native-base';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <NativeBaseProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }} />
    </NativeBaseProvider>
  );
}
