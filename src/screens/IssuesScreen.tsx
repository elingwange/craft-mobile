import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

// 导入统一的 API 服务和类型定义
import {
  fetchIssues,
  IssueUIData,
  getStatusColor,
  getPriorityColor,
} from '../services/IssueApi';

// 定义导航相关的类型 (保持不变)
type RootStackParamList = {
  Login: undefined;
  Issues: undefined;
};
type IssuesScreenProps = NativeStackScreenProps<RootStackParamList, 'Issues'>;

// 徽章组件 (保持不变)
const Badge = ({ text, color }: { text: string; color: string }) => (
  <View style={[styles.badge, { backgroundColor: color }]}>
    <Text style={styles.badgeText}>{text}</Text>
  </View>
);

const IssuesScreen = ({ navigation }: IssuesScreenProps) => {
  const [issues, setIssues] = useState<IssueUIData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useFocusEffect(
    useCallback(() => {
      const getIssues = async () => {
        setIsLoading(true);
        try {
          const fetchedIssues = await fetchIssues();
          setIssues(fetchedIssues);
        } catch (error) {
          console.error('获取 Issue 失败:', error);
        } finally {
          setIsLoading(false);
        }
      };

      getIssues();

      return () => {
        // 可选：在这里添加清理逻辑
      };
    }, []),
  );

  const handleNewIssuePress = () => {
    navigation.navigate('AddIssue');
  };
  const handleDashboardPress = () => {
    navigation.navigate('Dashboard');
  };

  // 现在 item.status 和 item.priority 直接是 UI 层类型，无需额外的映射
  const renderItem = ({ item }: { item: IssueUIData }) => (
    <TouchableOpacity
      style={styles.issueRow}
      onPress={() => navigation.navigate('IssueDetail', { issueId: item.id })}
    >
      <Text style={[styles.issueCell, styles.titleCell]} numberOfLines={1}>
        {item.title}
      </Text>
      <View style={[styles.issueCell, styles.statusCell]}>
        {/* 正确调用：使用 getStatusColor 函数获取颜色 */}
        <Badge text={item.status} color={getStatusColor(item.status)} />
      </View>
      <View style={[styles.issueCell, styles.priorityCell]}>
        {/* 正确调用：使用 getPriorityColor 函数获取颜色 */}
        <Badge text={item.priority} color={getPriorityColor(item.priority)} />
      </View>
      <Text style={[styles.issueCell, styles.createdCell]}>{item.created}</Text>
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={[styles.headerText, styles.titleCell]}>Title</Text>
      <Text style={[styles.headerText, styles.statusCell]}>Status</Text>
      <Text style={[styles.headerText, styles.priorityCell]}>Priority</Text>
      <Text style={[styles.headerText, styles.createdCell]}>Created</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.listContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#fff" style={{ flex: 1 }} />
          ) : (
            <FlatList
              data={issues}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              ListHeaderComponent={ListHeader}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
        <TouchableOpacity style={styles.fab} onPress={handleNewIssuePress}>
          <Icon name="add" size={30} color="#FFF" />
        </TouchableOpacity>
      </View>
      <View style={{ height: 20 }} />
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
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 10,
    marginBottom: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 4,
  },
  screenTitle: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: -1,
  },
  newIssueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    width: 135,
    marginBottom: 12,
  },
  newIssueButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    overflow: 'hidden',
    padding: 8,
    marginTop: 10,
    marginBottom: 30,
  },
  listHeader: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerText: {
    color: '#888',
    fontSize: 14,
    fontWeight: 'bold',
  },
  issueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
  },
  issueCell: {
    color: '#E0E0E0',
    fontSize: 14,
  },
  titleCell: {
    flex: 4,
    marginRight: 8,
  },
  statusCell: {
    flex: 2,
    alignItems: 'flex-start',
  },
  priorityCell: {
    flex: 2,
    alignItems: 'flex-start',
  },
  createdCell: {
    flex: 1.7,
    textAlign: 'right',
    color: '#999',
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // 新增的 FAB 样式
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: -40,
    backgroundColor: '#ffc371',
    borderRadius: 30,
    elevation: 8, // Android 阴影
    shadowColor: '#000', // iOS 阴影
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});

export default IssuesScreen;
