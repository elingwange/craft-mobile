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
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import {
  updateIssue,
  statusOptionsUI,
  priorityOptionsUI,
  // 导入新的辅助函数
  getStatusApiValue,
  getPriorityApiValue,
} from '../services/IssueApi';

const EditIssueScreen: React.FC = () => {
  const route =
    useRoute<RouteProp<{ EditIssue: { issue: any } }, 'EditIssue'>>();
  const navigation = useNavigation();
  const { issue } = route.params;

  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(issue.description);
  const [status, setStatus] = useState(issue.status);
  const [priority, setPriority] = useState(issue.priority);

  // 管理模态框状态
  const [isStatusModalVisible, setStatusModalVisible] = useState(false);
  const [isPriorityModalVisible, setPriorityModalVisible] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleUpdate = async () => {
    console.log('更新 Issue:', { title, description, status, priority });
    if (!title || !description) {
      Alert.alert('提示', '标题和描述不能为空');
      return;
    }

    // 使用新的辅助函数将 UI 值转换为正确的 API 值
    const updatedIssueData = {
      id: Number(issue.id),
      title,
      description,
      status: getStatusApiValue(status), // 修复：使用辅助函数进行转换
      priority: getPriorityApiValue(priority), // 修复：使用辅助函数进行转换
    };

    try {
      await updateIssue(issue.id, updatedIssueData);
      console.log('Issue 更新成功！');
      navigation.goBack();
    } catch (error) {
      console.error('Issue 更新失败:', error);
      Alert.alert('错误', '更新任务失败，请稍后重试。');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  // 渲染下拉列表项
  const renderOptionItem = (
    item: string,
    onSelect: (value: string) => void,
  ) => (
    <TouchableOpacity style={styles.modalOption} onPress={() => onSelect(item)}>
      <Text style={styles.modalOptionText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* 顶部导航 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#E0E0E0" />
            <Text style={styles.backButtonText}>Back to Issue</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.screenTitle}>Edit Issue</Text>

        {/* 表单卡片 */}
        <View style={styles.formCard}>
          <View style={styles.formRow}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.formRow}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>

          {/* Status 自定义下拉菜单 */}
          <View style={styles.formRow}>
            <Text style={styles.label}>Status</Text>
            <TouchableOpacity
              style={styles.customPickerButton}
              onPress={() => setStatusModalVisible(true)}
            >
              <Text style={styles.customPickerText}>{status}</Text>
              <Feather name="chevron-down" size={20} color="#E0E0E0" />
            </TouchableOpacity>
          </View>

          {/* Priority 自定义下拉菜单 */}
          <View style={styles.formRow}>
            <Text style={styles.label}>Priority</Text>
            <TouchableOpacity
              style={styles.customPickerButton}
              onPress={() => setPriorityModalVisible(true)}
            >
              <Text style={styles.customPickerText}>{priority}</Text>
              <Feather name="chevron-down" size={20} color="#E0E0E0" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 底部按钮 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleCancel}
            style={[styles.actionButton, styles.cancelButton]}
          >
            <Text style={[styles.actionButtonText, styles.cancelButtonText]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleUpdate}
            style={[styles.actionButton, styles.updateButton]}
          >
            <Text style={styles.actionButtonText}>Update Issue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* tatus 模态框 */}
      <Modal
        visible={isStatusModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Status</Text>
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
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Priority 模态框 */}
      <Modal
        visible={isPriorityModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setPriorityModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Priority</Text>
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
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
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
    backgroundColor: '#121212',
  },
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'column',
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
    color: '#E0E0E0',
    marginLeft: 8,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E0E0E0',
    // textAlign: 'center',
    marginVertical: 20,
  },
  formCard: {
    backgroundColor: '#2b2b2b',
    borderRadius: 10,
    padding: 16,
  },
  formRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#A0A0A0',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#333333',
    color: '#E0E0E0',
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
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: '#2b2b2b',
  },
  cancelButtonText: {
    color: '#A0A0A0',
  },
  updateButton: {
    backgroundColor: '#F0AD4E',
  },
  // ✅ 新增自定义下拉菜单样式
  customPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#333333',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  customPickerText: {
    color: '#E0E0E0',
    fontSize: 16,
  },
  // ✅ 新增模态框样式
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#2b2b2b',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    color: '#E0E0E0',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444444',
  },
  modalOptionText: {
    color: '#E0E0E0',
    fontSize: 16,
    textAlign: 'center',
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: '#333333',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#A0A0A0',
    fontSize: 16,
  },
});

export default EditIssueScreen;
