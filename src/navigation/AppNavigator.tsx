import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import IssuesScreen from '../screens/IssuesScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import IssueDetailScreen from '../screens/IssueDetailScreen';
import EditIssueScreen from '../screens/EditIssueScreen';
import AddIssueScreen from '../screens/NewIssueScreen';

const Tab = createBottomTabNavigator();
const IssuesStack = createNativeStackNavigator();

// 为“任务”标签页创建一个独立的堆栈导航器，以支持详情页等
const IssuesStackScreen = () => (
  <IssuesStack.Navigator screenOptions={{ headerShown: false }}>
    <IssuesStack.Screen name="IssuesList" component={IssuesScreen} />
    <IssuesStack.Screen name="IssueDetail" component={IssueDetailScreen} />
    <IssuesStack.Screen name="EditIssue" component={EditIssueScreen} />
    <IssuesStack.Screen name="AddIssue" component={AddIssueScreen} />
  </IssuesStack.Navigator>
);

const AppNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1E1E1E',
          borderTopColor: '#282828',
        },
        tabBarActiveTintColor: '#F0AD4E',
        tabBarInactiveTintColor: '#A0A0A0',
      }}
    >
      <Tab.Screen
        name="Issues"
        component={IssuesStackScreen}
        options={{
          title: 'Issues',
          tabBarIcon: ({ color, size }) => (
            <Icon name="list-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Icon name="pie-chart-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-circle-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
