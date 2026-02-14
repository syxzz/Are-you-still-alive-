import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="add-asset" />
      <Stack.Screen name="asset-detail" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
