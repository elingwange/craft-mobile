// App.tsx

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';

// 从 @react-navigation/native 导入 NavigationContainer
import { NavigationContainer } from '@react-navigation/native';
// 从 @react-navigation/native-stack 导入 createNativeStackNavigator
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import IssueListScreen from './screens/IssuesScreen';
import IssueDetailScreen from './screens/IssueDetailScreen';
import EditIssueScreen from './screens/EditIssueScreen';

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
        <Stack.Screen
          name="IssueDetail"
          component={IssueDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditIssue"
          component={EditIssueScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
