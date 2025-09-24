import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IssuesScreen from '../screens/IssuesScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import IssueDetailScreen from '../screens/IssueDetailScreen';
import NewIssueScreen from '../screens/NewIssueScreen';
import EditIssueScreen from '../screens/EditIssueScreen';

const Tab = createBottomTabNavigator();
const IssuesStack = createNativeStackNavigator();

// 为 Issue 相关的页面创建一个独立的堆栈导航器
const IssuesStackScreen = () => (
  <IssuesStack.Navigator screenOptions={{ headerShown: false }}>
    <IssuesStack.Screen name="Issues" component={IssuesScreen} />
    <IssuesStack.Screen name="IssueDetail" component={IssueDetailScreen} />
    <IssuesStack.Screen name="AddIssue" component={NewIssueScreen} />
    <IssuesStack.Screen name="EditIssue" component={EditIssueScreen} />
  </IssuesStack.Navigator>
);

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#1E1E1E',
          borderTopColor: 'transparent',
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Issues') {
            iconName = 'checkmark-circle-outline';
          } else if (route.name === 'Dashboard') {
            iconName = 'stats-chart-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-circle-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Issues" component={IssuesStackScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default AppNavigator;
