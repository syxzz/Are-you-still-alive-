import { useCallback, useEffect, useState } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { FlatList } from 'react-native';
import { Box, Text, IconButton } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { AssetCard } from '../../components/AssetCard';
import { useDatabase } from '../../hooks/useDatabase';
import { Asset } from '../../types/asset';
import { Colors } from '../../constants/Colors';

/**
 * 资产列表页：按创建时间倒序展示 AssetCard，右上角加号跳转新增
 */
export default function MainIndexScreen() {
  const router = useRouter();
  const { ready, getAllAssets, deleteAsset } = useDatabase();
  const [assets, setAssets] = useState<Asset[]>([]);

  const loadAssets = useCallback(async () => {
    const list = await getAllAssets();
    setAssets(list);
  }, [getAllAssets]);

  useEffect(() => {
    if (!ready) return;
    loadAssets();
  }, [ready, loadAssets]);

  useFocusEffect(
    useCallback(() => {
      if (ready) loadAssets();
    }, [ready, loadAssets])
  );

  const handleDelete = useCallback(
    async (id: number) => {
      const ok = await deleteAsset(id);
      if (ok) loadAssets();
    },
    [deleteAsset, loadAssets]
  );

  if (!ready) {
    return (
      <Box flex={1} bg={Colors.background} justifyContent="center" alignItems="center">
        <Text color={Colors.textSecondary}>加载中…</Text>
      </Box>
    );
  }

  return (
    <Box flex={1} bg={Colors.background} safeAreaTop>
      {/* 顶部标题 + 加号 */}
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        px="4"
        py="3"
        bg={Colors.surface}
        borderBottomWidth="1"
        borderBottomColor={Colors.border}
      >
        <Text fontSize="xl" fontWeight="bold" color={Colors.text}>
          遗产管家
        </Text>
        <Box flexDirection="row">
          <IconButton
            icon={<Ionicons name="person-outline" size={24} color={Colors.primary} />}
            onPress={() => router.push('/(main)/profile')}
            variant="ghost"
          />
          <IconButton
            icon={<Ionicons name="add" size={26} color={Colors.primary} />}
            onPress={() => router.push('/(main)/add-asset')}
            variant="ghost"
          />
        </Box>
      </Box>

      {assets.length === 0 ? (
        <Box flex={1} justifyContent="center" alignItems="center" px="8">
          <Box
            w="24"
            h="24"
            borderRadius="full"
            bg={Colors.border}
            alignItems="center"
            justifyContent="center"
            mb="4"
          >
            <Ionicons name="wallet-outline" size={48} color={Colors.textSecondary} />
          </Box>
          <Text color={Colors.textSecondary} textAlign="center">
            点击加号添加你的第一项资产
          </Text>
        </Box>
      ) : (
        <FlatList
          data={assets}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Box px="4">
              <AssetCard
                asset={item}
                onPress={() => router.push({ pathname: '/(main)/asset-detail', params: { id: String(item.id) } })}
                onEdit={() => router.push({ pathname: '/(main)/add-asset', params: { id: String(item.id) } })}
                onDelete={() => handleDelete(item.id)}
              />
            </Box>
          )}
          contentContainerStyle={{ paddingVertical: 16 }}
        />
      )}
    </Box>
  );
}
