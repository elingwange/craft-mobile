import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

// 导入所有屏幕
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import AppNavigator from './AppNavigator';

const AuthStack = createNativeStackNavigator();

// 认证流程的堆栈导航器
// 这个组件就是你的 AuthNavigator
const AuthStackScreen = ({ onLogin }) => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login">
        {props => <LoginScreen {...props} onLogin={onLogin} />}
      </AuthStack.Screen>
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </AuthStack.Navigator>
  );
};

// 顶层根导航器
const RootNavigator = () => {
  // 使用一个状态来管理登录状态
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 登录成功回调，更新状态为 true
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // 注销回调，更新状态为 false
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <NavigationContainer>
      {/* 根据登录状态直接渲染不同的导航器 */}
      {isLoggedIn ? (
        // 如果已登录，渲染应用的主导航器
        <AppNavigator onLogout={handleLogout} />
      ) : (
        // 如果未登录，渲染认证堆栈
        <AuthStackScreen onLogin={handleLoginSuccess} />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
