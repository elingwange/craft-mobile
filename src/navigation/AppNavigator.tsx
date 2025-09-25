import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Feather from 'react-native-vector-icons/Feather';
import IssuesScreen from '../screens/IssuesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DashboardScreen from '../screens/DashboardScreen'; // 重新添加 DashboardScreen
import ResetPasswordScreen from '../screens/ResetPasswordScreen';

// 导入任务相关的新屏幕
import NewIssueScreen from '../screens/NewIssueScreen';
import EditIssueScreen from '../screens/EditIssueScreen';
import IssueDetailScreen from '../screens/IssueDetailScreen';

const Tab = createBottomTabNavigator();
const AppStack = createNativeStackNavigator();
const IssuesStack = createNativeStackNavigator();

// 新建一个处理所有任务相关页面的堆栈导航器
const IssuesFlow = () => {
  return (
    <IssuesStack.Navigator screenOptions={{ headerShown: false }}>
      {/* 主要的任务列表页 */}
      <IssuesStack.Screen name="IssuesList" component={IssuesScreen} />
      {/* 新建任务页 */}
      <IssuesStack.Screen name="NewIssue" component={NewIssueScreen} />
      {/* 编辑任务页 */}
      <IssuesStack.Screen name="EditIssue" component={EditIssueScreen} />
      {/* 任务详情页 */}
      <IssuesStack.Screen name="IssueDetail" component={IssueDetailScreen} />
    </IssuesStack.Navigator>
  );
};

// 定义主要的底部标签栏导航器
const MainTabs = ({ onLogout }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Issues') {
            iconName = 'home';
          } else if (route.name === 'Dashboard') {
            iconName = 'list';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }
          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#b09971',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#1E1E1E',
          borderTopWidth: 0,
        },
      })}
    >
      {/* 将 IssuesScreen 替换为新的 IssuesFlow */}
      <Tab.Screen name="Issues" component={IssuesFlow} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Profile">
        {props => <ProfileScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

// 定义应用主堆栈，包含标签栏和重置密码页面
const AppNavigator = ({ onLogout }) => {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="MainTabs">
        {props => <MainTabs {...props} onLogout={onLogout} />}
      </AppStack.Screen>
      <AppStack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#121212',
          },
          headerTintColor: '#E0E0E0',
          headerTitle: '重置密码',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </AppStack.Navigator>
  );
};

export default AppNavigator;
