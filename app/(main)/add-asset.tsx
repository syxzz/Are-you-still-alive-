import { useCallback, useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Box, Text, Button, Input, FormControl, Select, ScrollView, KeyboardAvoidingView } from 'native-base';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { CameraView } from '../../components/CameraView';
import { useDatabase } from '../../hooks/useDatabase';
import { recognizeFromImage } from '../../utils/ocr';
import { AssetFormData, ASSET_CATEGORIES } from '../../types/asset';
import { Colors } from '../../constants/Colors';

type TabType = 'camera' | 'manual';

const initialForm: AssetFormData = {
  name: '',
  category: 'bank',
  account: '',
  password: '',
  note: '',
  imageUri: '',
};

/**
 * 新增/编辑资产页：拍照录入（OCR 模拟）+ 手动输入
 */
export default function AddAssetScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const isEdit = Boolean(params.id);
  const id = params.id ? parseInt(params.id, 10) : 0;

  const { ready, getAssetById, insertAsset, updateAsset } = useDatabase();
  const [tab, setTab] = useState<TabType>('manual');
  const [form, setForm] = useState<AssetFormData>(initialForm);
  const [saving, setSaving] = useState(false);

  // 编辑时回填
  useEffect(() => {
    if (!ready || !isEdit || !id) return;
    (async () => {
      const asset = await getAssetById(id);
      if (asset) {
        setForm({
          name: asset.name,
          category: asset.category,
          account: asset.account,
          password: asset.password,
          note: asset.note,
          imageUri: asset.imageUri,
        });
      }
    })();
  }, [ready, isEdit, id, getAssetById]);

  const handleCameraConfirm = useCallback(async (uri: string) => {
    setForm((prev) => ({ ...prev, imageUri: uri }));
    // OCR 模拟：识别后填充 account；TODO: 待接入 Google ML Kit
    const result = await recognizeFromImage(uri);
    if (result.account) {
      setForm((prev) => ({ ...prev, account: result.account ?? prev.account }));
    }
    setTab('manual');
  }, []);

  /** 从相册选择（备选） */
  const handlePickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      setForm((prev) => ({ ...prev, imageUri: result.assets[0].uri }));
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (isEdit) {
        const ok = await updateAsset(id, form);
        if (ok) router.back();
      } else {
        const newId = await insertAsset(form);
        if (newId != null) router.back();
      }
    } finally {
      setSaving(false);
    }
  }, [form, isEdit, id, insertAsset, updateAsset, router]);

  if (!ready) {
    return (
      <Box flex={1} bg={Colors.background} justifyContent="center" alignItems="center">
        <Text color={Colors.textSecondary}>加载中…</Text>
      </Box>
    );
  }

  // 拍照录入全屏
  if (tab === 'camera') {
    return (
      <Box flex={1} bg="black">
        <CameraView
          onCaptureConfirm={handleCameraConfirm}
          onCancel={() => setTab('manual')}
        />
      </Box>
    );
  }

  return (
    <KeyboardAvoidingView
      flex={1}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Box flex={1} bg={Colors.background} safeAreaTop>
      {/* 顶部标题 */}
      <Box
        flexDirection="row"
        alignItems="center"
        px="4"
        py="3"
        bg={Colors.surface}
        borderBottomWidth="1"
        borderBottomColor={Colors.border}
      >
        <Box flex={1} />
        <Text fontSize="xl" fontWeight="bold" color={Colors.text}>
          {isEdit ? '编辑资产' : '新增资产'}
        </Text>
        <Box flex={1} />
      </Box>

      {/* 选项卡：拍照录入 / 手动输入 */}
      <Box flexDirection="row" bg={Colors.surface} px="4" pb="2">
        <Button
          variant={(tab as TabType) === 'camera' ? 'solid' : 'outline'}
          colorScheme="blue"
          size="sm"
          mr="2"
          onPress={() => setTab('camera')}
          leftIcon={<Ionicons name="camera" size={18} color={(tab as TabType) === 'camera' ? '#fff' : Colors.primary} />}
        >
          拍照录入
        </Button>
        <Button
          variant={(tab as TabType) === 'manual' ? 'solid' : 'outline'}
          colorScheme="blue"
          size="sm"
          onPress={() => setTab('manual')}
          leftIcon={<Ionicons name="create" size={18} color={(tab as TabType) === 'manual' ? '#fff' : Colors.primary} />}
        >
          手动输入
        </Button>
      </Box>

      <ScrollView
        flex={1}
        px="4"
        pt="4"
        pb="8"
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={false}
      >
        <FormControl mb="3">
          <FormControl.Label>资产名称</FormControl.Label>
          <Input
            value={form.name}
            onChangeText={(t) => setForm((prev) => ({ ...prev, name: t }))}
            placeholder="如：建设银行储蓄卡"
            autoCapitalize="none"
            returnKeyType="next"
            isDisabled={false}
            isReadOnly={false}
          />
        </FormControl>
        <FormControl mb="3">
          <FormControl.Label>分类</FormControl.Label>
          <Select
            selectedValue={form.category}
            onValueChange={(v) => setForm((prev) => ({ ...prev, category: v }))}
            minW="full"
          >
            {ASSET_CATEGORIES.map((c) => (
              <Select.Item key={c.value} label={c.label} value={c.value} />
            ))}
          </Select>
        </FormControl>
        <FormControl mb="3">
          <FormControl.Label>账号</FormControl.Label>
          <Input
            value={form.account}
            onChangeText={(t) => setForm((prev) => ({ ...prev, account: t }))}
            placeholder="账号/卡号（拍照可自动识别）"
            autoCapitalize="none"
            returnKeyType="next"
            isDisabled={false}
            isReadOnly={false}
          />
        </FormControl>
        <FormControl mb="3">
          <FormControl.Label>密码</FormControl.Label>
          <Input
            value={form.password}
            onChangeText={(t) => setForm((prev) => ({ ...prev, password: t }))}
            placeholder="选填"
            type="password"
            autoCapitalize="none"
            returnKeyType="next"
            isDisabled={false}
            isReadOnly={false}
          />
        </FormControl>
        <FormControl mb="3">
          <FormControl.Label>备注</FormControl.Label>
          <Input
            value={form.note}
            onChangeText={(t) => setForm((prev) => ({ ...prev, note: t }))}
            placeholder="选填"
            autoCapitalize="sentences"
            returnKeyType="done"
            isDisabled={false}
            isReadOnly={false}
          />
        </FormControl>
        <FormControl mb="3">
          <FormControl.Label>图片（可选）</FormControl.Label>
          <Button size="sm" variant="outline" leftIcon={<Ionicons name="images-outline" size={18} />} onPress={handlePickImage}>
            从相册选择
          </Button>
        </FormControl>

        <Button
          onPress={handleSave}
          colorScheme="blue"
          size="lg"
          mt="4"
          mb="8"
          isLoading={saving}
          isDisabled={!form.name.trim()}
        >
          保存
        </Button>
      </ScrollView>
    </Box>
    </KeyboardAvoidingView>
  );
}
