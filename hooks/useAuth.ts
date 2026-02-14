import { useCallback, useState } from 'react';
import { router } from 'expo-router';

/** 模拟登录状态：本地标记是否已登录，无真实接口 */
const AUTH_KEY = '@legacy/authenticated';

function getStoredAuth(): boolean {
  if (typeof global === 'undefined') return false;
  return (global as { __legacyAuth?: boolean }).__legacyAuth ?? false;
}

function setStoredAuth(value: boolean): void {
  if (typeof global !== 'undefined') {
    (global as { __legacyAuth?: boolean }).__legacyAuth = value;
  }
}

/**
 * 认证 Hook：模拟登录/登出，控制是否展示登录页
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(getStoredAuth());

  const login = useCallback(() => {
    setStoredAuth(true);
    setIsAuthenticated(true);
    router.replace('/(main)');
  }, []);

  const logout = useCallback(() => {
    setStoredAuth(false);
    setIsAuthenticated(false);
    router.replace('/(auth)/login');
  }, []);

  return { isAuthenticated, login, logout };
}
