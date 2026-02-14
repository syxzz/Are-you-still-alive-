import { useCallback, useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Box, Text, Button, useToast } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useDatabase } from '../../hooks/useDatabase';
import { Asset } from '../../types/asset';
import { ASSET_CATEGORIES } from '../../types/asset';
import { Colors } from '../../constants/Colors';

/**
 * 资产详情页：完整信息展示，密码可点击显示，底部编辑/删除
 */
export default function AssetDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const id = parseInt(params.id ?? '0', 10);
  const toast = useToast();

  const { ready, getAssetById, deleteAsset } = useDatabase();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    const a = await getAssetById(id);
    setAsset(a ?? null);
  }, [id, getAssetById]);

  useEffect(() => {
    if (!ready) return;
    load();
  }, [ready, load]);

  const handleDelete = useCallback(async () => {
    if (!asset) return;
    const ok = await deleteAsset(asset.id);
    if (ok) {
      toast.show({ description: '已删除', placement: 'top' });
      router.back();
    }
  }, [asset, deleteAsset, router, toast]);

  if (!ready) {
    return (
      <Box flex={1} bg={Colors.background} justifyContent="center" alignItems="center">
        <Text color={Colors.textSecondary}>加载中…</Text>
      </Box>
    );
  }

  if (!asset) {
    return (
      <Box flex={1} bg={Colors.background} justifyContent="center" alignItems="center">
        <Text color={Colors.textSecondary}>未找到该资产</Text>
        <Button mt="4" onPress={() => router.back()} variant="ghost">
          返回
        </Button>
      </Box>
    );
  }

  const categoryLabel =
    ASSET_CATEGORIES.find((c) => c.value === asset.category)?.label ?? asset.category;

  return (
    <Box flex={1} bg={Colors.background} safeAreaTop>
      {/* 顶部返回 */}
      <Box
        flexDirection="row"
        alignItems="center"
        px="4"
        py="3"
        bg={Colors.surface}
        borderBottomWidth="1"
        borderBottomColor={Colors.border}
      >
        <Button
          variant="ghost"
          size="sm"
          onPress={() => router.back()}
          leftIcon={<Ionicons name="arrow-back" size={22} color={Colors.primary} />}
        >
          返回
        </Button>
      </Box>

      <Box flex={1} px="4" py="4">
        <Box bg={Colors.surface} borderRadius="lg" p="4" mb="4">
          <Text fontSize="sm" color={Colors.textSecondary} mb="1">
            资产名称
          </Text>
          <Text fontSize="lg" fontWeight="600" color={Colors.text} mb="4">
            {asset.name}
          </Text>
          <Text fontSize="sm" color={Colors.textSecondary} mb="1">
            分类
          </Text>
          <Text fontSize="md" color={Colors.text} mb="4">
            {categoryLabel}
          </Text>
          <Text fontSize="sm" color={Colors.textSecondary} mb="1">
            账号
          </Text>
          <Text fontSize="md" color={Colors.text} mb="4">
            {asset.account || '—'}
          </Text>
          <Text fontSize="sm" color={Colors.textSecondary} mb="1">
            密码
          </Text>
          <Box flexDirection="row" alignItems="center" mb="4">
            <Text fontSize="md" color={Colors.text}>
              {passwordVisible ? asset.password || '—' : (asset.password ? '••••••••' : '—')}
            </Text>
            {asset.password ? (
              <Button
                variant="ghost"
                size="sm"
                ml="2"
                onPress={() => setPasswordVisible((v) => !v)}
              >
                {passwordVisible ? '隐藏' : '显示'}
              </Button>
            ) : null}
          </Box>
          <Text fontSize="sm" color={Colors.textSecondary} mb="1">
            备注
          </Text>
          <Text fontSize="md" color={Colors.text}>
            {asset.note || '—'}
          </Text>
        </Box>

        <Button
          w="full"
          colorScheme="blue"
          mb="3"
          onPress={() => router.push({ pathname: '/(main)/add-asset', params: { id: String(asset.id) } })}
          leftIcon={<Ionicons name="create" size={20} color="#fff" />}
        >
          编辑
        </Button>
        <Button w="full" colorScheme="red" variant="outline" onPress={handleDelete}>
          删除
        </Button>
      </Box>
    </Box>
  );
}
