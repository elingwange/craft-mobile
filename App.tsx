// App.tsx

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';

// 从 @react-navigation/native 导入 NavigationContainer
import { NavigationContainer } from '@react-navigation/native';
// 从 @react-navigation/native-stack 导入 createNativeStackNavigator
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 导入你的两个页面组件
import LoginScreen from './LoginScreen';
import IssueListScreen from './IssuesScreen';

// 创建一个导航器对象
const Stack = createNativeStackNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {/* 使用 Stack.Navigator 来定义应用的导航堆栈。
        initialRouteName="Login" 表示应用启动时第一个显示的页面是 LoginScreen。
      */}
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} // 隐藏 Login 页面的导航栏
        />
        <Stack.Screen
          name="Issues"
          component={IssueListScreen}
          options={{ headerShown: false }} // 隐藏 Issues 页面的导航栏
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
