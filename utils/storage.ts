import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  HEARTBEAT_ENABLED: '@legacy/heartbeat_enabled',
  HEARTBEAT_FREQUENCY: '@legacy/heartbeat_frequency',
  HEARTBEAT_LAST_CONFIRM: '@legacy/heartbeat_last_confirm',
} as const;

/** 心跳检测频率 */
export type HeartbeatFrequency = 'monthly' | 'quarterly';

/**
 * 获取心跳检测是否开启
 */
export async function getHeartbeatEnabled(): Promise<boolean> {
  const v = await AsyncStorage.getItem(KEYS.HEARTBEAT_ENABLED);
  return v === 'true';
}

/**
 * 设置心跳检测开关
 */
export function setHeartbeatEnabled(enabled: boolean): Promise<void> {
  return AsyncStorage.setItem(KEYS.HEARTBEAT_ENABLED, enabled ? 'true' : 'false');
}

/**
 * 获取心跳检测频率
 */
export async function getHeartbeatFrequency(): Promise<HeartbeatFrequency> {
  const v = await AsyncStorage.getItem(KEYS.HEARTBEAT_FREQUENCY);
  return (v === 'quarterly' ? 'quarterly' : 'monthly') as HeartbeatFrequency;
}

/**
 * 设置心跳检测频率
 */
export function setHeartbeatFrequency(freq: HeartbeatFrequency): Promise<void> {
  return AsyncStorage.setItem(KEYS.HEARTBEAT_FREQUENCY, freq);
}

/**
 * 获取上次确认时间戳（毫秒）
 */
export async function getHeartbeatLastConfirm(): Promise<number> {
  const v = await AsyncStorage.getItem(KEYS.HEARTBEAT_LAST_CONFIRM);
  return v ? parseInt(v, 10) : 0;
}

/**
 * 设置上次确认时间戳（立即确认时调用）
 */
export function setHeartbeatLastConfirm(timestamp: number): Promise<void> {
  return AsyncStorage.setItem(KEYS.HEARTBEAT_LAST_CONFIRM, String(timestamp));
}
