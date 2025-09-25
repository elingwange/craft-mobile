import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './ApiService';

// 定义用户信息类型
interface UserData {
  username: string;
  email: string;
}

/**
 * Handles the login request.
 * @param userName The user's username.
 * @param email The user's email.
 * @param password The user's password.
 * @returns A Promise that resolves to UserData on success, or null on failure.
 */
export const login = async (
  userName: string,
  email: string,
  password: string,
): Promise<UserData | null> => {
  try {
    const loginParams = { userName, email, password };
    const params = JSON.stringify(loginParams);

    const response = await api.post('/users/login', params, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { token, username, email: userEmail } = response.data;

    await AsyncStorage.setItem('userToken', token);
    const userData: UserData = { username, email: userEmail };
    console.log('Login successful, received data:', userData);

    await AsyncStorage.setItem('userData', JSON.stringify(userData));

    return userData;
  } catch (error: any) {
    console.error('---- Login error:', error);

    if (error.response) {
      const { data, status } = error.response;
      let errorMessage = '服务器返回错误';

      if (status === 401) {
        errorMessage = '登录失败。用户名或密码不正确。';
      } else if (data && data.title) {
        errorMessage = data.title;
      }

      Alert.alert('登录失败', errorMessage);
    } else if (error.request) {
      Alert.alert('登录失败', '无法连接到服务器。请检查您的网络连接。');
    } else {
      Alert.alert('登录失败', '发生未知错误。');
    }

    return null;
  }
};

/**
 * Handles the logout request and token removal.
 * @returns A Promise that resolves to true on successful logout, or false otherwise.
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

/**
 * Handles the user registration request.
 * @param userName The user's username.
 * @param email The user's email.
 * @param password The user's password.
 * @returns A Promise that resolves to true on successful signup, or false on failure.
 */
export const signup = async (
  userName: string,
  email: string,
  password: string,
): Promise<Boolean | null> => {
  try {
    const loginParams = { userName, email, password };
    const params = JSON.stringify(loginParams);

    const response = await api.post('/users/register', params, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 201) {
      return true;
    }
    return false;
  } catch (error: any) {
    console.error('---- Login error:', error);
    return false;
  }
};

/**
 * Handles the password reset request.
 * @param userNameOrEmail The user's username or email.
 * @param newPassword The new password.
 * @returns A Promise that resolves to true on successful password reset, or false on failure.
 */
export const resetPassword = async (
  userNameOrEmail: string,
  newPassword: string,
): Promise<boolean> => {
  try {
    const response = await api.post('/users/reset-password', {
      userNameOrEmail,
      newPassword,
    });

    if (response.status === 200) {
      // 密码重置成功
      Alert.alert('成功', '密码已成功重置，请使用新密码登录。');
      return true;
    }

    // 如果状态码不是 200，但请求成功，也可能返回错误信息
    Alert.alert('重置失败', response.data?.message || '未知错误');
    return false;
  } catch (error: any) {
    console.error('---- Reset password error:', error);

    // 改进错误处理，区分不同类型的错误
    if (error.response) {
      // 服务器有响应，但状态码非 2xx
      const { data, status } = error.response;
      let errorMessage = '重置密码失败。';

      if (status === 404) {
        errorMessage = '找不到用户。请检查您输入的邮箱或用户名。';
      } else if (data && data.message) {
        errorMessage = data.message;
      }

      Alert.alert('重置失败', errorMessage);
    } else if (error.request) {
      // 请求已发出但没有收到响应
      Alert.alert('重置失败', '无法连接到服务器。请检查您的网络连接。');
    } else {
      // 其他未知错误
      Alert.alert('重置失败', '发生未知错误。');
    }

    return false;
  }
};
