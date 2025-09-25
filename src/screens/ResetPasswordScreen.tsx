import React, { useState, useCallback } from 'react';
import type { FC } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect, StackActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetPassword } from '../services/AuthApi';

// 定义你的导航器中所有页面的类型
type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ResetPassword: undefined;
};

type ResetPasswordScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ResetPassword'
>;

const ResetPasswordScreen: FC<ResetPasswordScreenProps> = ({ navigation }) => {
  // 移除 emailOrUsername 状态，因为我们将从 AsyncStorage 获取它
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 使用 useFocusEffect 在屏幕获取焦点时加载用户数据
  useFocusEffect(
    useCallback(() => {
      const loadUserData = async () => {
        try {
          // 从 AsyncStorage 中加载用户数据
          const userDataString = await AsyncStorage.getItem('userData');
          if (userDataString) {
            const userData = JSON.parse(userDataString);
            // 确保 userData.email 存在
            if (userData.email) {
              setEmail(userData.email);
            }
          }
        } catch (error) {
          console.error('加载用户信息失败', error);
        }
      };

      loadUserData();
      // 在屏幕失焦时，这里没有需要清理的资源，所以返回空函数
      return () => {};
    }, []),
  );

  const handleResetPassword = async () => {
    // 检查新密码和确认密码是否为空
    if (!newPassword || !confirmPassword) {
      Alert.alert('错误', '所有字段都不能为空。');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('错误', '两次输入的密码不一致。');
      return;
    }

    const state = await resetPassword(email, newPassword);
    if (state) {
      // API 调用成功
      // 使用 StackActions.replace 替换整个导航堆栈
      // 'Auth' 是你在 RootNavigator 中定义的认证堆栈的名称
      navigation.dispatch(StackActions.replace('Auth'));
    }

    // 在这里添加调用 API 的逻辑，使用从 AsyncStorage 获取的 email
    console.log('重置密码请求发送', {
      email,
      newPassword,
    });
  };

  const toggleShowPassword = (): void => {
    setShowPassword(prevValue => !prevValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Reset Password</Text>

      {/* 邮箱输入框 - 显示邮箱名称，不可编辑 */}
      <View style={styles.inputContainer}>
        <Icon name="mail" size={20} color="#888" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email or Username"
          placeholderTextColor="#888"
          autoCapitalize="none"
          // 不再使用 onChangeText，因为这个字段是不可编辑的
          value={email}
          // 设置 editable 为 false，使其不可编辑
          editable={false}
        />
      </View>

      {/* 新密码输入框 */}
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#888" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="#888"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          onChangeText={setNewPassword}
          value={newPassword}
        />
        <TouchableOpacity
          style={styles.passwordToggleIcon}
          onPress={toggleShowPassword}
        >
          <Icon
            name={showPassword ? 'eye' : 'eye-off'}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      {/* 确认新密码输入框 */}
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#888" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          placeholderTextColor="#888"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          onChangeText={setConfirmPassword}
          value={confirmPassword}
        />
        <TouchableOpacity
          style={styles.passwordToggleIcon}
          onPress={toggleShowPassword}
        >
          <Icon
            name={showPassword ? 'eye' : 'eye-off'}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      {/* 重置密码按钮 */}
      <TouchableOpacity
        onPress={handleResetPassword}
        style={styles.resetButtonWrapper}
      >
        <LinearGradient
          colors={['#b09971', '#ffc371']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.resetButton}
        >
          <Text style={styles.resetButtonText}>Reset Password</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
    paddingHorizontal: 30,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E0E0E0',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 55,
    backgroundColor: '#333',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#fff',
    fontSize: 16,
  },
  passwordToggleIcon: {
    paddingLeft: 10,
  },
  resetButtonWrapper: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 20,
    marginBottom: 15,
  },
  resetButton: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ResetPasswordScreen;
