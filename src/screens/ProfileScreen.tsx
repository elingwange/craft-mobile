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
import { logout } from '../services/AuthApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const navigation = useNavigation();
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
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Text style={styles.screenTitle}>Profile</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#E0E0E0" />
        ) : userName ? (
          <>
            {/* 上半部分 - 用户信息 */}
            <View style={styles.profileSection}>
              <View style={styles.profileItem}>
                <Feather name="user" size={24} color="#A0A0A0" />
                <View style={styles.profileTextContainer}>
                  <Text style={styles.label}>Username</Text>
                  <Text style={styles.value}>{userName}</Text>
                </View>
              </View>
              <View style={{ height: 20 }} />
              <View style={styles.profileItem}>
                <Feather name="mail" size={24} color="#A0A0A0" />
                <View style={styles.profileTextContainer}>
                  <Text style={styles.label}>Email</Text>
                  <Text style={styles.value}>{email}</Text>
                </View>
              </View>
            </View>

            {/* 下半部分 - 操作列表 */}
            <View style={styles.actionsSection}>
              <Text style={styles.actionsTitle}>Settings</Text>

              <TouchableOpacity style={styles.actionButton}>
                <Feather name="lock" size={24} color="#A0A0A0" />
                <Text style={styles.actionText}>Reset Password</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Feather name="moon" size={24} color="#A0A0A0" />
                <Text style={styles.actionText}>Change Theme</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButtonLogout}
                onPress={handleLogout}
              >
                <Feather name="log-out" size={24} color="#A0A0A0" />
                <Text style={styles.actionTextLogout}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>无法加载用户信息。</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={styles.backToLoginButton}
            >
              <Text style={styles.backToLoginText}>返回登录页</Text>
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
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#E0E0E0',
    marginBottom: 20,
  },
  profileSection: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2b2b2b',
    paddingBottom: 20,
  },
  profileTextContainer: {
    marginLeft: 15,
  },
  label: {
    fontSize: 14,
    color: '#A0A0A0',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E0E0E0',
    marginTop: 4,
  },
  actionsSection: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
  },
  actionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E0E0E0',
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2b2b2b',
  },
  actionButtonLogout: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  actionText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#E0E0E0',
  },
  actionTextLogout: {
    marginLeft: 15,
    fontSize: 16,
    color: '#D9534F',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#A0A0A0',
    fontSize: 16,
    marginBottom: 20,
  },
  backToLoginButton: {
    backgroundColor: '#333333',
    padding: 12,
    borderRadius: 8,
  },
  backToLoginText: {
    color: '#E0E0E0',
    fontSize: 14,
  },
});

export default ProfileScreen;
