// IssueDetailScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';

// 定义从导航参数中接收的数据类型
interface IssueDetailData {
  id: string;
  title: string;
  description: string;
  status: 'In Progress' | 'Done' | 'Low' | 'Medium' | 'High';
  priority: 'Low' | 'Medium' | 'High';
  created: string;
}

// 定义路由参数的类型
type RootStackParamList = {
  Issues: undefined;
  IssueDetail: {
    issue: IssueDetailData;
  };
};

type IssueDetailScreenRouteProp = RouteProp<RootStackParamList, 'IssueDetail'>;

interface IssueDetailScreenProps {}

const IssueDetailScreen: React.FC<IssueDetailScreenProps> = () => {
  const route = useRoute<IssueDetailScreenRouteProp>();
  const { issue } = route.params;
  const navigation = useNavigation();

  console.log('---- issue', issue);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleEdit = () => {
    navigation.navigate('EditIssue', { issue: issue });
  };

  const handleDelete = () => {
    console.log('点击删除', issue.id);
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
        {/* ✅ 顶部导航布局 */}
        <View style={styles.header}>
          {/* 第一行：返回按钮 */}
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#E0E0E0" />
            <Text style={styles.backButtonText}>Back to Issues</Text>
          </TouchableOpacity>
          {/* 第二行：标题和按钮 */}
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

        {/* 主要内容卡片 */}
        <View style={styles.card}>
          <View style={styles.tagContainer}>
            {renderTag(issue.status, statusColors[issue.status])}
            {renderTag(issue.priority, priorityColors[issue.priority])}
            <Text style={styles.updatedText}>Updated {issue.created}</Text>
          </View>
          <Text style={styles.mainContentText}>{issue.description}</Text>
        </View>

        {/* 详细信息卡片 */}
        <View style={styles.card}>
          <Text style={styles.detailsTitle}>Details</Text>
          {/* ✅ 详细信息行新布局 */}
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
});

export default IssueDetailScreen;
