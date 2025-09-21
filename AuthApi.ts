import { Alert } from 'react-native';

const IP = '10.176.230.168';
const API_BASE_URL: string = `http://${IP}:8889`;

// This function handles the login request
export const login = async (
  userName: string,
  email: string,
  password: string,
): Promise<string | null> => {
  try {
    var loginParams = { userName, email, password };
    loginParams = {
      userName: '',
      email: 'evan@example.com',
      password: 'MySuperSecretPassword123@',
    };

    var params = JSON.stringify(loginParams);

    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: params,
    });

    //console.error('---- Login response:', response);

    if (!response.ok) {
      const errorData = await response.json();
      Alert.alert('登录失败', errorData.title || '服务器返回错误');
      return null;
    }

    const data = await response.json();
    return data.token; // Return the JWT token
  } catch (error) {
    console.error('---- Login error:', error);
    Alert.alert('登录失败', '无法连接到服务器。请检查您的网络连接。');
    return null;
  }
};
