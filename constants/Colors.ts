/**
 * 全局颜色常量
 */
export const Colors = {
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#1e293b',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  error: '#dc2626',
  success: '#16a34a',
  warning: '#d97706',
  // 资产分类图标背景
  categoryBg: {
    bank: '#dbeafe',
    card: '#fce7f3',
    social: '#dcfce7',
    other: '#f3e8ff',
  },
} as const;

export type ColorsType = typeof Colors;
