import React, { useState, useCallback } from 'react';
import type { FC } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect, StackActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetPassword } from '../services/AuthApi';
import { useTheme } from '../contexts/ThemeContext';

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
  const { theme, isDarkMode } = useTheme();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadUserData = async () => {
        try {
          const userDataString = await AsyncStorage.getItem('userData');
          if (userDataString) {
            const userData = JSON.parse(userDataString);
            if (userData.email) {
              setEmail(userData.email);
            }
          }
        } catch (error) {
          console.error('加载用户信息失败', error);
        }
      };

      loadUserData();
      return () => {};
    }, []),
  );

  const handleResetPassword = async () => {
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
      navigation.dispatch(StackActions.replace('Auth'));
    }

    console.log('重置密码请求发送', {
      email,
      newPassword,
    });
  };

  const toggleShowPassword = (): void => {
    setShowPassword(prevValue => !prevValue);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.screenTitleText, { color: theme.text }]}>
          Reset Password
        </Text>
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: theme.inputBackground },
          ]}
        >
          <Icon
            name="mail"
            size={20}
            color={theme.iconColor}
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Email or Username"
            placeholderTextColor={theme.placeholderText}
            autoCapitalize="none"
            value={email}
            editable={false}
          />
        </View>

        <View
          style={[
            styles.inputContainer,
            { backgroundColor: theme.inputBackground },
          ]}
        >
          <Icon
            name="lock"
            size={20}
            color={theme.iconColor}
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="New Password"
            placeholderTextColor={theme.placeholderText}
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
              color={theme.iconColor}
            />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.inputContainer,
            { backgroundColor: theme.inputBackground },
          ]}
        >
          <Icon
            name="lock"
            size={20}
            color={theme.iconColor}
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Confirm New Password"
            placeholderTextColor={theme.placeholderText}
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
              color={theme.iconColor}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleResetPassword}
          style={styles.resetButtonWrapper}
        >
          <LinearGradient
            colors={
              isDarkMode ? ['#b09971', '#ffc371'] : ['#FFD700', '#FFA500']
            }
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.resetButton}
          >
            <Text style={styles.resetButtonText}>Reset Password</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  goBackButton: {
    position: 'absolute',
    left: 16,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  screenTitleText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 55,
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
