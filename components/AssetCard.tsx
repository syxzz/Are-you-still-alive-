import React from 'react';
import { Box, Text, IconButton, Menu, useToast } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { Asset } from '../types/asset';
import { ASSET_CATEGORIES } from '../types/asset';
import { Colors } from '../constants/Colors';

interface AssetCardProps {
  asset: Asset;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

/** 根据分类取默认图标名 */
function getCategoryIconName(category: string): keyof typeof Ionicons.glyphMap {
  const map: Record<string, keyof typeof Ionicons.glyphMap> = {
    bank: 'card-outline',
    card: 'card',
    social: 'people-outline',
    other: 'folder-outline',
  };
  return map[category] ?? 'folder-outline';
}

/** 账号脱敏：隐藏中间四位 */
function maskAccount(account: string): string {
  if (!account || account.length < 8) return account;
  const len = account.length;
  return account.slice(0, 4) + ' **** ' + account.slice(-4);
}

export function AssetCard({ asset, onPress, onEdit, onDelete }: AssetCardProps) {
  const toast = useToast();
  const categoryLabel =
    ASSET_CATEGORIES.find((c) => c.value === asset.category)?.label ?? asset.category;

  const handleDelete = () => {
    onDelete();
    toast.show({ description: '已删除', placement: 'top' });
  };

  return (
    <Box
      bg={Colors.surface}
      borderRadius="lg"
      p="4"
      mb="3"
      shadow="1"
      onTouchEnd={onPress}
    >
      <Box flexDirection="row" alignItems="center" justifyContent="space-between">
        <Box flexDirection="row" alignItems="center" flex={1}>
          <Box
            w="10"
            h="10"
            borderRadius="full"
            bg={(Colors.categoryBg as Record<string, string>)[asset.category] ?? Colors.categoryBg.other}
            alignItems="center"
            justifyContent="center"
            mr="3"
          >
            <Ionicons name={getCategoryIconName(asset.category)} size={22} color={Colors.primary} />
          </Box>
          <Box flex={1}>
            <Text fontSize="md" fontWeight="600" color={Colors.text} numberOfLines={1}>
              {asset.name}
            </Text>
            <Text fontSize="sm" color={Colors.textSecondary}>
              {categoryLabel} · {maskAccount(asset.account) || '—'}
            </Text>
          </Box>
        </Box>
        <Menu
          trigger={(triggerProps) => (
            <IconButton
              {...triggerProps}
              icon={<Ionicons name="ellipsis-vertical" size={20} color={Colors.textSecondary} />}
              variant="ghost"
              size="sm"
            />
          )}
          placement="bottom right"
        >
          <Menu.Item onPress={onEdit}>编辑</Menu.Item>
          <Menu.Item onPress={handleDelete} color={Colors.error}>
            删除
          </Menu.Item>
        </Menu>
      </Box>
    </Box>
  );
}
