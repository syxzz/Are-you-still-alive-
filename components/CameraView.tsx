import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { CameraView as ExpoCameraView, useCameraPermissions } from 'expo-camera';
import { Box } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface CameraViewProps {
  /** 拍照并确认后回调图片 uri */
  onCaptureConfirm: (uri: string) => void;
  /** 取消（返回） */
  onCancel: () => void;
}

/**
 * 封装 expo-camera：全屏预览，支持拍照、确认、重拍
 */
export function CameraView({ onCaptureConfirm, onCancel }: CameraViewProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<React.ComponentRef<typeof ExpoCameraView>>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  if (!permission) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="black">
        <Text style={styles.text}>正在请求相机权限…</Text>
      </Box>
    );
  }

  if (!permission.granted) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="black" p="4">
        <Text style={styles.text}>需要相机权限以拍摄资产照片</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>授权</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelBtn]} onPress={onCancel}>
          <Text style={styles.buttonText}>取消</Text>
        </TouchableOpacity>
      </Box>
    );
  }

  const handleTakePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      const result = await cameraRef.current.takePictureAsync?.({ quality: 0.8, base64: false });
      if (result?.uri) setPhotoUri(result.uri);
    } catch (e) {
      console.error('拍照失败', e);
    }
  };

  const handleConfirm = () => {
    if (photoUri) onCaptureConfirm(photoUri);
  };

  const handleRetake = () => {
    setPhotoUri(null);
  };

  // 已拍照片：展示预览 + 确认/重拍
  if (photoUri) {
    return (
      <View style={StyleSheet.absoluteFill}>
        <Image source={{ uri: photoUri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlBtn} onPress={handleRetake}>
            <Ionicons name="camera-reverse" size={28} color="#fff" />
            <Text style={styles.controlLabel}>重拍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn} onPress={handleConfirm}>
            <Ionicons name="checkmark-circle" size={28} color="#fff" />
            <Text style={styles.controlLabel}>确认</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <ExpoCameraView ref={cameraRef} style={StyleSheet.absoluteFill} />
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onCancel} style={styles.iconBtn}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={handleTakePhoto} style={styles.captureBtn}>
          <View style={styles.captureInner} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: { color: '#fff', marginBottom: 12 },
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  cancelBtn: { backgroundColor: Colors.textSecondary },
  buttonText: { color: '#fff', fontSize: 16 },
  topBar: {
    position: 'absolute',
    top: 48,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  iconBtn: { padding: 8 },
  bottomBar: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#fff',
  },
  controls: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  controlBtn: {
    alignItems: 'center',
  },
  controlLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
});
