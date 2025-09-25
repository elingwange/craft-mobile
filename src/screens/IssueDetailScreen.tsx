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
import { useTheme } from '../contexts/ThemeContext';
import { deleteIssue } from '../services/IssueApi';
import {
  fetchIssueById,
  getStatusColor,
  getPriorityColor,
} from '../services/IssueApi';
import { useFocusEffect } from '@react-navigation/native';

type RootStackParamList = {
  Issues: undefined;
  IssueDetail: {
    issueId: number;
  };
};

interface IssueDetailScreenProps {}

const IssueDetailScreen: React.FC<IssueDetailScreenProps> = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'IssueDetail'>>();
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();

  const { issueId } = route.params;

  const [issue, setIssue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('---- issueId', issueId);

  useFocusEffect(
    useCallback(() => {
      const fetchDetail = async () => {
        setIsLoading(true);
        try {
          const fetchedIssue = await fetchIssueById(issueId);
          setIssue(fetchedIssue);
        } catch (error) {
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
            await deleteIssue(issue.id);
            console.log('Issue 删除成功！');
            navigation.goBack();
          } catch (error) {
            Alert.alert('错误', '删除任务失败，请稍后重试。');
          }
        },
      },
    ]);
  };

  const renderTag = (label: string, color: string) => (
    <View style={[styles.tag, { backgroundColor: color }]}>
      <Text style={[styles.tagText, { color: theme.tagText }]}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.container}>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={theme.text}
            style={{ flex: 1 }}
          />
        ) : !issue ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.text }]}>
              任务详情不存在。
            </Text>
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color={theme.text} />
              <Text style={[styles.backButtonText, { color: theme.text }]}>
                返回
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={handleGoBack}
                style={styles.backButton}
              >
                <Feather name="arrow-left" size={24} color={theme.text} />
                <Text style={[styles.backButtonText, { color: theme.text }]}>
                  Back
                </Text>
              </TouchableOpacity>
              <View style={styles.headerTitleContainer}>
                <Text style={[styles.title, { color: theme.text }]}>
                  {issue.title}
                </Text>
              </View>
              <View style={styles.headerTitleContainer}>
                <View style={styles.headerButtons}>
                  <TouchableOpacity
                    onPress={handleEdit}
                    style={[styles.button, { backgroundColor: theme.subText }]}
                  >
                    {/* 修复：将图标颜色设置为与背景形成对比的颜色 */}
                    <Feather name="edit-2" size={16} color={theme.text} />
                    <Text
                      style={[styles.buttonText, { color: theme.buttonText }]}
                    >
                      Edit
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleDelete}
                    style={[
                      styles.button,
                      styles.deleteButton,
                      { backgroundColor: theme.danger },
                    ]}
                  >
                    {/* 修复：将图标颜色设置为白色，以确保在红色背景上清晰可见 */}
                    <Feather name="trash-2" size={16} color="#fff" />
                    <Text
                      style={[
                        styles.deleteButtonText,
                        { color: theme.buttonText },
                      ]}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={[styles.card, { backgroundColor: theme.card }]}>
              <View style={styles.tagContainer}>
                {renderTag(issue.status, getStatusColor(issue.status))}
                {renderTag(issue.priority, getPriorityColor(issue.priority))}
                <Text style={[styles.updatedText, { color: theme.subText }]}>
                  Updated {issue.created}
                </Text>
              </View>
              <Text style={[styles.mainContentText, { color: theme.text }]}>
                {issue.description}
              </Text>
            </View>

            <View style={[styles.card, { backgroundColor: theme.card }]}>
              <Text style={[styles.detailsTitle, { color: theme.text }]}>
                Details
              </Text>
              <View style={styles.detailsRow}>
                <Text style={[styles.detailsLabel, { color: theme.subText }]}>
                  Assigned to
                </Text>
                <Text style={[styles.detailsValue, { color: theme.text }]}>
                  {'N/A'}
                </Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={[styles.detailsLabel, { color: theme.subText }]}>
                  Status
                </Text>
                <View style={styles.detailsValue2}>
                  {renderTag(issue.status, getStatusColor(issue.status))}
                </View>
              </View>
              <View style={styles.detailsRow}>
                <Text style={[styles.detailsLabel, { color: theme.subText }]}>
                  Priority
                </Text>
                <View style={styles.detailsValue2}>
                  {renderTag(issue.priority, getPriorityColor(issue.priority))}
                </View>
              </View>
              <View style={styles.detailsRow}>
                <Text style={[styles.detailsLabel, { color: theme.subText }]}>
                  Created
                </Text>
                <Text style={[styles.detailsValue, { color: theme.text }]}>
                  {issue.created}
                </Text>
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
    marginRight: 8,
  },
  buttonText: {
    marginLeft: 4,
  },
  deleteButton: {},
  deleteButtonText: {
    marginLeft: 4,
  },
  card: {
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
    fontWeight: 'bold',
    fontSize: 12,
  },
  updatedText: {
    fontSize: 12,
  },
  mainContentText: {
    fontSize: 16,
    marginVertical: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  detailsRow: {
    marginBottom: 12,
  },
  detailsLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  detailsValue: {
    fontSize: 14,
  },
  detailsValue2: {
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
    fontSize: 18,
    marginBottom: 20,
  },
});

export default IssueDetailScreen;
