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
  const [userName, setUserName] = useState(null);
  const [email, setEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        setIsLoading(true);
        try {
          // 从 AsyncStorage 获取用户信息
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
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Profile</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#E0E0E0" />
        ) : userName ? (
          <View style={styles.card}>
            <View style={styles.profileItem}>
              <Feather name="user" size={24} color="#A0A0A0" />
              <View style={styles.profileTextContainer}>
                <Text style={styles.label}>Username</Text>
                <Text style={styles.value}>{userName}</Text>
              </View>
            </View>

            <View style={styles.profileItem}>
              <Feather name="mail" size={24} color="#A0A0A0" />
              <View style={styles.profileTextContainer}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{email}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Feather name="log-out" size={20} color="#fff" />
              <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>
          </View>
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
  header: {
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#E0E0E0',
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    marginBottom: 8,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E0E0E0',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9534F',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 20,
  },
  logoutButtonText: {
    marginLeft: 10,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
