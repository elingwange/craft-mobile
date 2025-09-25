import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { logout } from '../services/AuthApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 接受 onLogout 作为 prop，不再直接进行导航
const ProfileScreen = ({ onLogout }) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const navigation = useNavigation(); // 导航可以保留，用于其他页面如 ResetPassword
  const [userName, setUserName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        setIsLoading(true);
        try {
          const userDataString = await AsyncStorage.getItem('userData');
          if (userDataString) {
            const userData = JSON.parse(userDataString);
            setUserName(userData.username);
            setEmail(userData.email);
          } else {
            console.log('No user data found in storage');
            setUserName(null);
            setEmail(null);
          }
        } catch (error) {
          console.error('加载用户信息失败', error);
          Alert.alert('错误', '无法加载用户信息。');
        } finally {
          setIsLoading(false);
        }
      };

      loadProfile();
      return () => {};
    }, []),
  );

  const handleResetPassword = () => {
    // 这里的导航逻辑可以保持不变
    navigation.navigate('ResetPassword');
  };

  const handleAppearance = () => {
    toggleTheme();
  };

  const handleLogout = () => {
    Alert.alert(
      '确认登出',
      '你确定要登出吗？',
      [
        {
          text: '取消',
          onPress: () => console.log('登出取消'),
          style: 'cancel',
        },
        {
          text: '确定',
          onPress: async () => {
            const isLoggedOut = await logout();
            if (isLoggedOut) {
              // 关键修正：调用父组件传递的 onLogout prop
              // 这会通知顶层导航器状态已改变
              if (onLogout) {
                onLogout();
              }
            } else {
              Alert.alert('登出失败', '请稍后重试。');
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        <Text style={[styles.screenTitle, { color: theme.text }]}>Profile</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.text} />
        ) : userName ? (
          <>
            <View
              style={[styles.profileSection, { backgroundColor: theme.card }]}
            >
              <View
                style={[
                  styles.profileItem,
                  { borderBottomColor: theme.border },
                ]}
              >
                <Feather name="user" size={24} color={theme.subText} />
                <View style={styles.profileTextContainer}>
                  <Text style={[styles.label, { color: theme.subText }]}>
                    Username
                  </Text>
                  <Text style={[styles.value, { color: theme.text }]}>
                    {userName}
                  </Text>
                </View>
              </View>
              <View style={{ height: 20 }} />
              <View style={styles.profileItem}>
                <Feather name="mail" size={24} color={theme.subText} />
                <View style={styles.profileTextContainer}>
                  <Text style={[styles.label, { color: theme.subText }]}>
                    Email
                  </Text>
                  <Text style={[styles.value, { color: theme.text }]}>
                    {email}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={[styles.actionsSection, { backgroundColor: theme.card }]}
            >
              <Text style={[styles.actionsTitle, { color: theme.text }]}>
                Settings
              </Text>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { borderBottomColor: theme.border },
                ]}
                onPress={handleResetPassword}
              >
                <Feather name="lock" size={24} color={theme.subText} />
                <Text style={[styles.actionText, { color: theme.text }]}>
                  Reset Password
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { borderBottomColor: theme.border },
                ]}
                onPress={handleAppearance}
              >
                <Feather name="moon" size={24} color={theme.subText} />
                <Text style={[styles.actionText, { color: theme.text }]}>
                  Change Theme
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButtonLogout}
                onPress={handleLogout}
              >
                <Feather name="log-out" size={24} color={theme.danger} />
                <Text
                  style={[styles.actionTextLogout, { color: theme.danger }]}
                >
                  Log Out
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.subText }]}>
              无法加载用户信息。
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={[
                styles.backToLoginButton,
                { backgroundColor: theme.card },
              ]}
            >
              <Text style={[styles.backToLoginText, { color: theme.text }]}>
                返回登录页
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileSection: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingBottom: 20,
  },
  profileTextContainer: {
    marginLeft: 15,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  actionsSection: {
    borderRadius: 12,
    padding: 20,
  },
  actionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  actionButtonLogout: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  actionText: {
    marginLeft: 15,
    fontSize: 16,
  },
  actionTextLogout: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 20,
  },
  backToLoginButton: {
    padding: 12,
    borderRadius: 8,
  },
  backToLoginText: {
    fontSize: 14,
  },
});

export default ProfileScreen;
