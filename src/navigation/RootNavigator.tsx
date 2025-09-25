import React, { useState, useEffect, useRef } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import AppNavigator from './AppNavigator';

const AuthStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

// 认证流程的堆栈导航器
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

const RootNavigator = () => {
  // 管理登录状态，默认为 false
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigationRef = useRef(null);

  // 登录成功回调
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // 关键的修复：处理注销逻辑
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // 使用 useEffect 监听 isLoggedIn 状态的变化
  useEffect(() => {
    if (!navigationRef.current) return;

    if (isLoggedIn) {
      // 登录成功时，替换为 MainApp 堆栈
      navigationRef.current.dispatch(StackActions.replace('MainApp'));
    } else {
      // 注销成功时，替换为 Auth 堆栈
      navigationRef.current.dispatch(StackActions.replace('Auth'));
    }
  }, [isLoggedIn]);

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={isLoggedIn ? 'MainApp' : 'Auth'}
      >
        <RootStack.Screen name="Auth">
          {props => <AuthStackScreen {...props} onLogin={handleLoginSuccess} />}
        </RootStack.Screen>
        <RootStack.Screen name="MainApp">
          {props => <AppNavigator {...props} onLogout={handleLogout} />}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
