import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AppNavigator from './AppNavigator';

const AuthStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

// 认证流程的堆栈导航器，包含登录和注册页面
// 接收一个 onLogin 属性，用于在登录成功时通知父组件
const AuthStackScreen = ({ onLogin }) => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      {/* 将 onLogin 函数作为 props 传递给 Login 屏幕 */}
      <AuthStack.Screen name="Login">
        {props => <LoginScreen {...props} onLogin={onLogin} />}
      </AuthStack.Screen>
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};

const RootNavigator = () => {
  // 管理登录状态，默认为 false
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 可以在这里添加 useEffect 来检查本地存储中的认证令牌
  // useEffect(() => {
  //   const checkLoginStatus = async () => {
  //     // 假设你的 AuthApi 有一个方法来检查令牌
  //     const token = await AsyncStorage.getItem('userToken');
  //     setIsLoggedIn(!!token);
  //   };
  //   checkLoginStatus();
  // }, []);

  // 定义登录成功后的回调函数
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          // 如果用户已登录，显示主应用底部标签栏
          <RootStack.Screen name="MainApp" component={AppNavigator} />
        ) : (
          // 如果用户未登录，显示认证堆栈，并传入登录成功回调函数
          <RootStack.Screen name="Auth">
            {props => (
              <AuthStackScreen {...props} onLogin={handleLoginSuccess} />
            )}
          </RootStack.Screen>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
