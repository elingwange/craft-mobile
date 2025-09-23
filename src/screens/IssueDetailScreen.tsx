// IssueDetailScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { deleteIssue } from '../services/IssueApi';
import { fetchIssueById } from '../services/IssueApi';
import { useFocusEffect } from '@react-navigation/native';

type RootStackParamList = {
  Issues: undefined;
  // ✅ 修改类型，现在它接收一个名为 'issueId' 的 number 类型参数
  IssueDetail: {
    issueId: number;
  };
};

interface IssueDetailScreenProps {}

const IssueDetailScreen: React.FC<IssueDetailScreenProps> = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'IssueDetail'>>();
  const navigation = useNavigation();

  // ✅ 现在可以直接解构出 issueId
  const { issueId } = route.params;

  const [issue, setIssue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('---- issueId', issueId); // 现在这里会显示正确的 ID

  useFocusEffect(
    useCallback(() => {
      const fetchDetail = async () => {
        setIsLoading(true);
        try {
          const fetchedIssue = await fetchIssueById(issueId);
          setIssue(fetchedIssue);
        } catch (error) {
          // 处理错误，例如显示错误信息
          console.error('获取任务详情失败', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetail();
      return () => {};
    }, [issueId]),
  );

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleEdit = () => {
    // ✅ 确保在导航前 issue 存在
    if (issue) {
      navigation.navigate('EditIssue', { issue: issue });
    }
  };

  const handleDelete = async () => {
    Alert.alert('确认删除', '确认要永久删除这个任务？', [
      {
        text: '取消',
        style: 'cancel',
      },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            // 只有在用户点击“删除”后，才执行实际的删除逻辑
            await deleteIssue(issue.id);
            console.log('Issue 删除成功！');
            navigation.goBack(); // 删除成功后返回到列表页
          } catch (error) {
            Alert.alert('错误', '删除任务失败，请稍后重试。');
          }
        },
      },
    ]);
  };

  const statusColors = {
    'In Progress': '#9B59B6', // 假设Todo是这个颜色
    Done: '#5CB85C',
    Low: '#3498DB',
    Medium: '#9B59B6', // 假设Medium是这个颜色
    High: '#D9534F',
  };
  const priorityColors = {
    Low: '#3498DB',
    Medium: '#9B59B6',
    High: '#D9534F',
  };

  const renderTag = (label: string, color: string) => (
    <View style={[styles.tag, { backgroundColor: color }]}>
      <Text style={styles.tagText}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>
        {isLoading ? (
          // ✅ 如果正在加载，显示加载指示器
          <ActivityIndicator size="large" color="#fff" style={{ flex: 1 }} />
        ) : !issue ? (
          // ✅ 如果加载完成但数据为空，显示一个提示
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>任务详情不存在。</Text>
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color="#E0E0E0" />
              <Text style={styles.backButtonText}>返回列表</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // ✅ 只有当数据可用时，才渲染详情内容
          <>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={handleGoBack}
                style={styles.backButton}
              >
                <Feather name="arrow-left" size={24} color="#E0E0E0" />
                <Text style={styles.backButtonText}>Back to Issues</Text>
              </TouchableOpacity>
              <View style={styles.headerTitleContainer}>
                <Text style={styles.title}>{issue.title}</Text>
              </View>
              <View style={styles.headerTitleContainer}>
                <View style={styles.headerButtons}>
                  <TouchableOpacity onPress={handleEdit} style={styles.button}>
                    <Feather name="edit-2" size={16} color="#E0E0E0" />
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleDelete}
                    style={[styles.button, styles.deleteButton]}
                  >
                    <Feather name="trash-2" size={16} color="#fff" />
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.tagContainer}>
                {renderTag(issue.status, statusColors[issue.status])}
                {renderTag(issue.priority, priorityColors[issue.priority])}
                <Text style={styles.updatedText}>Updated {issue.created}</Text>
              </View>
              <Text style={styles.mainContentText}>{issue.description}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.detailsTitle}>Details</Text>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsLabel}>Assigned to</Text>
                <Text style={styles.detailsValue}>{'N/A'}</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsLabel}>Status</Text>
                <View style={styles.detailsValue2}>
                  {renderTag(issue.status, statusColors[issue.status])}
                </View>
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsLabel}>Priority</Text>
                <View style={styles.detailsValue2}>
                  {renderTag(issue.priority, priorityColors[issue.priority])}
                </View>
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsLabel}>Created</Text>
                <Text style={styles.detailsValue}>{issue.created}</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#E0E0E0',
    marginLeft: 8,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E0E0E0',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#2b2b2b',
    marginRight: 8,
  },
  buttonText: {
    marginLeft: 4,
    color: '#E0E0E0',
  },
  deleteButton: {
    backgroundColor: '#D9534F',
  },
  deleteButtonText: {
    marginLeft: 4,
    color: '#fff',
  },
  card: {
    backgroundColor: '#2b2b2b',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 8,
  },
  tagText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  updatedText: {
    color: '#A0A0A0',
    fontSize: 12,
  },
  mainContentText: {
    color: '#E0E0E0',
    fontSize: 16,
    marginVertical: 20,
  },
  detailsTitle: {
    color: '#E0E0E0',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  detailsRow: {
    marginBottom: 12,
  },
  detailsLabel: {
    color: '#A0A0A0',
    fontSize: 14,
    marginBottom: 4,
  },
  detailsValue: {
    color: '#E0E0E0',
    fontSize: 14,
  },
  // ✅ 修改 detailsValue2 样式
  detailsValue2: {
    // 移除 width: '50%'，让其宽度自适应子元素
    color: '#E0E0E0',
    fontSize: 14,
    width: '30%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
});

export default IssueDetailScreen;
