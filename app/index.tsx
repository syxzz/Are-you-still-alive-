import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Box, Text, Spinner } from 'native-base';
import { useAuth } from '../hooks/useAuth';

/**
 * 根入口：根据登录状态重定向到主列表或登录页
 */
export default function IndexScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(main)');
    } else {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, router]);

  return (
    <Box flex={1} justifyContent="center" alignItems="center" bg="gray.50">
      <Spinner size="lg" />
      <Text mt="2" color="gray.600">
        加载中…
      </Text>
    </Box>
  );
}
