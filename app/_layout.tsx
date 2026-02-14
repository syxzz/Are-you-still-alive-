import { Stack } from 'expo-router';
import { NativeBaseProvider } from 'native-base';
import { StatusBar } from 'expo-status-bar';
import { BackHandler, LogBox } from 'react-native';

// 忽略 VirtualizedList 嵌套警告（在表单中使用 Select 组件时会出现）
// 这是 native-base Select 组件的已知问题，不影响实际功能
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews',
]);

// Polyfill for BackHandler to support old native-base API
if (!(BackHandler as any).removeEventListener) {
  const subscriptions = new Map();
  const originalAddEventListener = BackHandler.addEventListener.bind(BackHandler);

  BackHandler.addEventListener = (eventName: any, handler: any) => {
    const subscription = originalAddEventListener(eventName, handler);
    subscriptions.set(handler, subscription);
    return subscription;
  };

  (BackHandler as any).removeEventListener = (_eventName: any, handler: any) => {
    const subscription = subscriptions.get(handler);
    if (subscription) {
      subscription.remove();
      subscriptions.delete(handler);
    }
  };
}

export default function RootLayout() {
  return (
    <NativeBaseProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }} />
    </NativeBaseProvider>
  );
}
