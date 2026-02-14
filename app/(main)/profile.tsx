import { useRouter } from 'expo-router';
import { Box, Text, Button } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { HeartbeatStatus } from '../../components/HeartbeatStatus';
import { Colors } from '../../constants/Colors';

/**
 * 个人设置页：头像占位、受托人管理、心跳检测、关于/隐私占位
 */
export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useAuth();

  return (
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
        <Button variant="ghost" size="sm" onPress={() => router.back()} leftIcon={<Ionicons name="arrow-back" size={22} color={Colors.primary} />}>
          返回
        </Button>
        <Text flex={1} fontSize="xl" fontWeight="bold" color={Colors.text} textAlign="center">
          个人设置
        </Text>
        <Box w="16" />
      </Box>

      <Box px="4" py="4">
        {/* 头像占位 */}
        <Box alignItems="center" py="6" mb="4" bg={Colors.surface} borderRadius="lg">
          <Box
            w="20"
            h="20"
            borderRadius="full"
            bg={Colors.border}
            alignItems="center"
            justifyContent="center"
          >
            <Ionicons name="person" size={40} color={Colors.textSecondary} />
          </Box>
          <Text mt="2" color={Colors.textSecondary} fontSize="sm">
            头像（占位）
          </Text>
        </Box>

        {/* 区块1：受托人管理 */}
        <Box bg={Colors.surface} borderRadius="lg" p="4" mb="4">
          <Text fontSize="lg" fontWeight="600" color={Colors.text} mb="3">
            受托人管理
          </Text>
          <Text color={Colors.textSecondary} fontSize="sm" mb="2">
            姓名、手机号，可添加多个（占位）
          </Text>
          <Button size="sm" variant="outline" colorScheme="blue">
            添加受托人
          </Button>
        </Box>

        {/* 区块2：心跳检测 */}
        <HeartbeatStatus />

        {/* 区块3：关于我们、隐私政策 */}
        <Box bg={Colors.surface} borderRadius="lg" p="4" mb="4">
          <Text fontSize="lg" fontWeight="600" color={Colors.text} mb="3">
            关于我们
          </Text>
          <Text color={Colors.textSecondary} fontSize="sm" mb="4">
            占位
          </Text>
          <Text fontSize="lg" fontWeight="600" color={Colors.text} mb="2">
            隐私政策
          </Text>
          <Text color={Colors.textSecondary} fontSize="sm">
            占位
          </Text>
        </Box>

        <Button w="full" variant="ghost" colorScheme="red" onPress={logout}>
          退出登录
        </Button>
      </Box>
    </Box>
  );
}
