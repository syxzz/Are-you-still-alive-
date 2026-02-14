import React, { useEffect, useState } from 'react';
import { Box, Text, Button, Switch, Select, useToast } from 'native-base';
import {
  getHeartbeatEnabled,
  setHeartbeatEnabled,
  getHeartbeatFrequency,
  setHeartbeatFrequency,
  getHeartbeatLastConfirm,
  setHeartbeatLastConfirm,
  HeartbeatFrequency,
} from '../utils/storage';
import { Colors } from '../constants/Colors';

/** 根据频率计算下次检测日期文案 */
function getNextCheckDateText(lastTs: number, frequency: HeartbeatFrequency): string {
  if (lastTs <= 0) return '—';
  const d = new Date(lastTs);
  if (frequency === 'monthly') {
    d.setMonth(d.getMonth() + 1);
    d.setDate(1);
  } else {
    d.setMonth(d.getMonth() + 3);
    d.setDate(1);
  }
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function formatLastConfirm(ts: number): string {
  if (ts <= 0) return '—';
  return new Date(ts).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function HeartbeatStatus() {
  const toast = useToast();
  const [enabled, setEnabledState] = useState(false);
  const [frequency, setFrequencyState] = useState<HeartbeatFrequency>('monthly');
  const [lastConfirm, setLastConfirmState] = useState(0);

  const load = async () => {
    const [e, f, l] = await Promise.all([
      getHeartbeatEnabled(),
      getHeartbeatFrequency(),
      getHeartbeatLastConfirm(),
    ]);
    setEnabledState(e);
    setFrequencyState(f);
    setLastConfirmState(l);
  };

  useEffect(() => {
    load();
  }, []);

  const onToggle = async (value: boolean) => {
    await setHeartbeatEnabled(value);
    setEnabledState(value);
  };

  const onFrequencyChange = async (value: string) => {
    const v = (value === 'quarterly' ? 'quarterly' : 'monthly') as HeartbeatFrequency;
    await setHeartbeatFrequency(v);
    setFrequencyState(v);
  };

  const onConfirmNow = async () => {
    const ts = Date.now();
    await setHeartbeatLastConfirm(ts);
    setLastConfirmState(ts);
    toast.show({ description: '已确认', placement: 'top' });
  };

  return (
    <Box bg={Colors.surface} borderRadius="lg" p="4" mb="4">
      <Text fontSize="lg" fontWeight="600" color={Colors.text} mb="3">
        心跳检测设置
      </Text>
      <Box flexDirection="row" justifyContent="space-between" alignItems="center" mb="3">
        <Text color={Colors.textSecondary}>启用心跳检测</Text>
        <Switch value={enabled} onValueChange={onToggle} />
      </Box>
      <Box mb="3">
        <Text color={Colors.textSecondary} mb="1" fontSize="sm">
          频率
        </Text>
        <Select
          selectedValue={frequency}
          onValueChange={onFrequencyChange}
          minW="full"
          placeholder="选择频率"
        >
          <Select.Item label="每月1号" value="monthly" />
          <Select.Item label="每季度" value="quarterly" />
        </Select>
      </Box>
      <Box mb="3">
        <Text color={Colors.textSecondary} fontSize="sm">
          上次确认时间
        </Text>
        <Text color={Colors.text} fontSize="md">
          {formatLastConfirm(lastConfirm)}
        </Text>
      </Box>
      <Box mb="2">
        <Text color={Colors.textSecondary} fontSize="sm">
          下次检测日期
        </Text>
        <Text color={Colors.text} fontSize="md">
          {getNextCheckDateText(lastConfirm, frequency)}
        </Text>
      </Box>
      <Button onPress={onConfirmNow} colorScheme="blue" size="sm">
        立即确认
      </Button>
    </Box>
  );
}
