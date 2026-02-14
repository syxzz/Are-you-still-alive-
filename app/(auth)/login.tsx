import { Box, Text, Button } from 'native-base';
import { useAuth } from '../../hooks/useAuth';
import { Colors } from '../../constants/Colors';

/**
 * 登录页（模拟：点击即登录）
 */
export default function LoginScreen() {
  const { login } = useAuth();

  return (
    <Box flex={1} bg={Colors.background} justifyContent="center" alignItems="center" px="8">
      <Text fontSize="2xl" fontWeight="bold" color={Colors.text} mb="2">
        遗产管家
      </Text>
      <Text color={Colors.textSecondary} mb="8" textAlign="center">
        安全管理您的数字资产与账号信息
      </Text>
      <Button onPress={login} colorScheme="blue" size="lg" w="full">
        进入
      </Button>
    </Box>
  );
}
