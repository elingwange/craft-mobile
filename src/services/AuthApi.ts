import { Alert } from 'react-native';
import api from './ApiService';

// This function handles the login request
export const login = async (
  userName: string,
  email: string,
  password: string,
): Promise<string | null> => {
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

    // Axios 默认对 2xx 状态码解析，非 2xx 会抛出错误，
    // 所以这里的代码只处理成功情况。
    console.log('Login successful, received data:', response.data);
    return response.data.token;
  } catch (error: any) {
    console.error('---- Login error:', error);

    // ✅ 改进错误处理，区分网络错误和后端返回的错误
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
