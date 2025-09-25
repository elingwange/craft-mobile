import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import {
  createIssue,
  statusOptionsUI,
  priorityOptionsUI,
} from '../services/IssueApi';

const AddIssueScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();

  // 为新 Issue 设置默认初始状态
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(statusOptionsUI[0]);
  const [priority, setPriority] = useState(priorityOptionsUI[0]);

  // 管理模态框状态
  const [isStatusModalVisible, setStatusModalVisible] = useState(false);
  const [isPriorityModalVisible, setPriorityModalVisible] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleCreate = async () => {
    // 实现创建新 Issue 的逻辑
    console.log('创建新 Issue:', { title, description, status, priority });
    // 调用 API Service 来发送创建请求
    if (!title || !description) {
      Alert.alert('提示', '标题和描述不能为空');
      return;
    }

    // 新增：将 UI 状态转换为 API 所需的格式
    const apiStatus = status.toLowerCase().replace(/\s/g, '_');
    const apiPriority = priority.toLowerCase();

    const newIssueData = {
      title,
      description,
      status: apiStatus,
      priority: apiPriority,
    };

    try {
      // 捕获潜在的异常
      await createIssue(newIssueData);
      console.log('Issue 创建成功！');
      navigation.goBack(); // 只有在请求成功时才会返回
    } catch (error) {
      // 在请求失败时执行
      console.error('Issue 创建失败:', error);
      Alert.alert('错误', '创建任务失败，请稍后重试。');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const renderOptionItem = (
    item: string,
    onSelect: (value: string) => void,
  ) => (
    <TouchableOpacity
      style={[styles.modalOption, { borderBottomColor: theme.border }]}
      onPress={() => onSelect(item)}
    >
      <Text style={[styles.modalOptionText, { color: theme.text }]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* 顶部导航 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={theme.text} />
            <Text style={[styles.backButtonText, { color: theme.text }]}>
              Back
            </Text>
          </TouchableOpacity>
          {/* 页面标题 */}
          <Text style={[styles.screenTitle, { color: theme.text }]}>
            Add Issue
          </Text>
        </View>

        {/* 表单卡片 */}
        <View style={[styles.formCard, { backgroundColor: theme.card }]}>
          {/* Title 输入框 */}
          <View style={styles.formRow}>
            <Text style={[styles.label, { color: theme.subText }]}>Title</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.inputBackground, color: theme.text },
              ]}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Description 输入框 */}
          <View style={styles.formRow}>
            <Text style={[styles.label, { color: theme.subText }]}>
              Description
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.inputBackground, color: theme.text },
              ]}
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>

          {/* Status 自定义下拉菜单 */}
          <View style={styles.formRow}>
            <Text style={[styles.label, { color: theme.subText }]}>Status</Text>
            <TouchableOpacity
              style={[
                styles.customPickerButton,
                { backgroundColor: theme.inputBackground },
              ]}
              onPress={() => setStatusModalVisible(true)}
            >
              <Text style={[styles.customPickerText, { color: theme.text }]}>
                {status}
              </Text>
              <Feather name="chevron-down" size={20} color={theme.text} />
            </TouchableOpacity>
          </View>

          {/* Priority 自定义下拉菜单 */}
          <View style={styles.formRow}>
            <Text style={[styles.label, { color: theme.subText }]}>
              Priority
            </Text>
            <TouchableOpacity
              style={[
                styles.customPickerButton,
                { backgroundColor: theme.inputBackground },
              ]}
              onPress={() => setPriorityModalVisible(true)}
            >
              <Text style={[styles.customPickerText, { color: theme.text }]}>
                {priority}
              </Text>
              <Feather name="chevron-down" size={20} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 底部按钮 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleCancel}
            style={[
              styles.actionButton,
              styles.cancelButton,
              { backgroundColor: theme.cancelButton },
            ]}
          >
            <Text
              style={[
                styles.actionButtonText,
                { color: theme.cancelButtonText },
              ]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCreate}
            style={[
              styles.actionButton,
              styles.updateButton,
              { backgroundColor: theme.primary },
            ]}
          >
            {/* 按钮文本 */}
            <Text
              style={[styles.actionButtonText, { color: theme.buttonText }]}
            >
              Create Issue
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 模态框 */}
      <Modal
        visible={isStatusModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Select Status
            </Text>
            <FlatList
              data={statusOptionsUI}
              keyExtractor={item => item}
              renderItem={({ item }) =>
                renderOptionItem(item, value => {
                  setStatus(value);
                  setStatusModalVisible(false);
                })
              }
            />
            <TouchableOpacity
              onPress={() => setStatusModalVisible(false)}
              style={[
                styles.modalCloseButton,
                { backgroundColor: theme.inputBackground },
              ]}
            >
              <Text
                style={[styles.modalCloseButtonText, { color: theme.subText }]}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isPriorityModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setPriorityModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Select Priority
            </Text>
            <FlatList
              data={priorityOptionsUI}
              keyExtractor={item => item}
              renderItem={({ item }) =>
                renderOptionItem(item, value => {
                  setPriority(value);
                  setPriorityModalVisible(false);
                })
              }
            />
            <TouchableOpacity
              onPress={() => setPriorityModalVisible(false)}
              style={[
                styles.modalCloseButton,
                { backgroundColor: theme.inputBackground },
              ]}
            >
              <Text
                style={[styles.modalCloseButtonText, { color: theme.subText }]}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
    justifyContent: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
  },
  backButtonText: {
    marginLeft: 8,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  formCard: {
    borderRadius: 10,
    padding: 16,
  },
  formRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginLeft: 10,
  },
  actionButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {},
  cancelButtonText: {},
  updateButton: {},
  customPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  customPickerText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  modalOptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 16,
  },
});

export default AddIssueScreen;
