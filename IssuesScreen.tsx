import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// 导入你的 API 服务文件，假设它叫 issuesApi.js
// 请确保你已经创建了这个文件并包含了我们之前讨论的 fetchIssues 函数
import { fetchIssues } from './IssueApi';

// 定义导航相关的类型 (保持不变)
type RootStackParamList = {
  Login: undefined;
  Issues: undefined;
};
type IssuesScreenProps = NativeStackScreenProps<RootStackParamList, 'Issues'>;

// 定义每一个 issue 的数据类型 (保持不变)
type Issue = {
  id: string;
  title: string;
  status: 'Done' | 'Backlog' | 'In Progress';
  priority: 'High' | 'Medium' | 'Low';
  created: string;
};

// 定义徽章的颜色 (保持不变)
const priorityColors = {
  High: '#D9534F',
  Medium: '#9B59B6',
  Low: '#3498DB',
};
const statusColors = {
  Done: '#5CB85C',
  Backlog: '#777',
  'In Progress': '#F0AD4E',
};

// 徽章组件 (保持不变)
const Badge = ({ text, color }: { text: string; color: string }) => (
  <View style={[styles.badge, { backgroundColor: color }]}>
    <Text style={styles.badgeText}>{text}</Text>
  </View>
);

const IssuesScreen = ({ navigation }: IssuesScreenProps) => {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 临时使用一个硬编码的 JWT Token 进行测试
  // 注意：在实际应用中，你需要从登录流程中动态获取并存储它
  const temporaryToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlYjRiZDRkYi1kODBkLTQyZmQtYjU2Ny02NDM5MmNhYzZkZTkiLCJqdGkiOiI0NzQ3M2ZkYS1kZDE5LTRiZjItOGNlMS1jNzJkOWIzNGUzNmUiLCJleHAiOjE3ODk2MDY4MTQsImlzcyI6IlRhc2tNYW5hZ2VtZW50QXBpSXNzdWVyIiwiYXVkIjoiVGFza01hbmFnZW1lbnRBcGkifQ.Q9M9Fbg2H49nj84vmtwl7INgxiz9buKk2e8ovq8P89M';

  useEffect(() => {
    const getIssues = async () => {
      setIsLoading(true);
      // 调用 API 时，将 Token 作为参数传递
      const fetchedIssues = await fetchIssues(temporaryToken);
      setIssues(fetchedIssues);
      setIsLoading(false);
    };

    getIssues();
  }, []); // 依赖数组为空，表示只在组件挂载时运行一次

  // 渲染列表中的每一项 (保持不变)
  const renderItem = ({ item }: { item: Issue }) => (
    <View style={styles.issueRow}>
      <Text style={[styles.issueCell, styles.titleCell]} numberOfLines={1}>
        {item.title}
      </Text>
      <View style={[styles.issueCell, styles.statusCell]}>
        <Badge text={item.status} color={statusColors[item.status]} />
      </View>
      <View style={[styles.issueCell, styles.priorityCell]}>
        <Badge text={item.priority} color={priorityColors[item.priority]} />
      </View>
      <Text style={[styles.issueCell, styles.createdCell]}>{item.created}</Text>
    </View>
  );

  // 列表的头部 (保持不变)
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
        {/* 顶部导航 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-back" size={24} color="#FFF" />
            <Text style={styles.headerTitle}>Back to Dashboard</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Issues</Text>
          <TouchableOpacity style={styles.newIssueButton}>
            <Icon name="add" size={20} color="#FFF" />
            <Text style={styles.newIssueButtonText}>New Issue</Text>
          </TouchableOpacity>
        </View>

        {/* 任务列表 */}
        <View style={styles.listContainer}>
          {/* 根据加载状态显示加载指示器或列表 */}
          {isLoading ? (
            <ActivityIndicator size="large" color="#fff" style={{ flex: 1 }} />
          ) : (
            <FlatList
              data={issues} // <-- 使用从 API 获取的数据
              renderItem={renderItem}
              keyExtractor={item => item.id}
              ListHeaderComponent={ListHeader}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

// 样式表 (保持不变)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
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
    flex: 3,
    marginRight: 8,
  },
  statusCell: {
    flex: 1.5,
    alignItems: 'flex-start',
  },
  priorityCell: {
    flex: 1.5,
    alignItems: 'flex-start',
  },
  createdCell: {
    flex: 2,
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
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default IssuesScreen;
