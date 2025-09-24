import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './ApiService';

// 定义用户信息类型
interface UserData {
  username: string;
  email: string;
}

// This function handles the login request
export const login = async (
  userName: string,
  email: string,
  password: string,
): Promise<UserData | null> => {
  try {
    // 直接使用参数创建请求体对象，避免混淆
    const loginParams = { userName, email, password };
    const params = JSON.stringify(loginParams);

    // ✅ 推荐使用封装好的 API 服务，而不是直接使用 fetch
    const response = await api.post('/users/login', params, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { token, username, email: userEmail } = response.data;

    // 登录成功，将 token 和用户信息保存到 AsyncStorage
    await AsyncStorage.setItem('userToken', token);
    const userData: UserData = { username, email: userEmail };
    console.log('Login successful, received data:', userData);

    //   关键修复：将对象转换为 JSON 字符串再存储
    await AsyncStorage.setItem('userData', JSON.stringify(userData));

    await AsyncStorage.getItem('userData').then(value => {
      if (value) {
        console.log('Retrieved userData from AsyncStorage:', JSON.parse(value));
      } else {
        console.log('No userData found in AsyncStorage');
      }
    });

    return userData;
  } catch (error: any) {
    console.error('---- Login error:', error);

    // 改进错误处理，区分网络错误和后端返回的错误
    if (error.response) {
      // 服务器有响应，但状态码不在 2xx 范围内（例如 401, 400, 404）
      const { data, status } = error.response;
      let errorMessage = '服务器返回错误';

      if (status === 401) {
        errorMessage = '登录失败。用户名或密码不正确。';
      } else if (data && data.title) {
        // 后端可能返回带 title 字段的错误信息
        errorMessage = data.title;
      }

      Alert.alert('登录失败', errorMessage);
    } else if (error.request) {
      // 请求已发出但没有收到响应，例如网络连接中断
      Alert.alert('登录失败', '无法连接到服务器。请检查您的网络连接。');
    } else {
      // 其他未知错误，例如代码执行错误
      Alert.alert('登录失败', '发生未知错误。');
    }

    return null;
  }
};

/**
 * Handles the logout request and token removal.
 * @returns {Promise<boolean>} A promise that resolves to true if logout is successful, false otherwise.
 */
export const logout = async (): Promise<boolean> => {
  try {
    // Call the backend logout endpoint (optional, but good practice)
    const response = await api.post('/users/logout');
    if (response.status !== 200) {
      return false;
    }

    // Remove the authentication token from local storage
    await AsyncStorage.removeItem('userToken');
    return true;
  } catch (error) {
    console.error('Logout failed:', error);
    return false;
  }
};
