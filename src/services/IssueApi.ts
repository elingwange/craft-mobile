import api from './ApiService';
import axios from 'axios';

// --- API 层类型定义 (与后端精确匹配) ---
export type IssueStatusApi = 'backlog' | 'todo' | 'in_progress' | 'done';
export type IssuePriorityApi = 'low' | 'medium' | 'high';

export interface IssueApiData {
  id: number;
  title: string;
  description: string;
  status: IssueStatusApi;
  priority: IssuePriorityApi;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

// 定义用于创建新 Issue 的数据结构，使用 API 类型
export interface NewIssueData {
  title: string;
  description: string;
  status: IssueStatusApi;
  priority: IssuePriorityApi;
}

// --- UI 层类型定义 (与前端UI显示匹配) ---
// 定义统一的数据映射，包含 API 值、UI 值和颜色
export const statusData = {
  backlog: { ui: 'Backlog', color: '#777' },
  todo: { ui: 'Todo', color: '#dd9127ff' },
  in_progress: { ui: 'In Progress', color: '#70297aff' },
  done: { ui: 'Done', color: '#5CB85C' },
} as const;

export const priorityData = {
  low: { ui: 'Low', color: '#4e4e7fff' },
  medium: { ui: 'Medium', color: '#8d5e2fff' },
  high: { ui: 'High', color: '#ad2f2bff' },
} as const;

// 从数据映射中自动生成 UI 选项数组
export const statusOptionsUI = Object.values(statusData).map(d => d.ui);
export const priorityOptionsUI = Object.values(priorityData).map(d => d.ui);

// 从上面的常量数组推断出类型，确保类型和数组值永远同步
export type IssueStatusUI = (typeof statusOptionsUI)[number];
export type IssuePriorityUI = (typeof priorityOptionsUI)[number];

export interface IssueUIData {
  id: string;
  title: string;
  description: string;
  status: IssueStatusUI;
  priority: IssuePriorityUI;
  created: string;
}

// 辅助函数，用于根据 UI 值获取对应的颜色
export const getStatusColor = (status: IssueStatusUI): string => {
  const statusEntry = Object.values(statusData).find(d => d.ui === status);
  return statusEntry ? statusEntry.color : '#373535';
};

export const getPriorityColor = (priority: IssuePriorityUI): string => {
  const priorityEntry = Object.values(priorityData).find(
    d => d.ui === priority,
  );
  return priorityEntry ? priorityEntry.color : '#373535';
};

// 新增辅助函数：根据 UI 值获取对应的 API 值
export const getStatusApiValue = (uiValue: IssueStatusUI): IssueStatusApi => {
  // 遍历 statusData 对象，找到 UI 值匹配的条目，并返回其键（即 API 值）
  const apiEntry = Object.entries(statusData).find(
    ([, value]) => value.ui === uiValue,
  );
  return apiEntry ? (apiEntry[0] as IssueStatusApi) : 'backlog'; // 如果未找到则返回默认值
};

// 新增辅助函数：根据 UI 值获取对应的 API 值
export const getPriorityApiValue = (
  uiValue: IssuePriorityUI,
): IssuePriorityApi => {
  // 遍历 priorityData 对象，找到 UI 值匹配的条目，并返回其键（即 API 值）
  const apiEntry = Object.entries(priorityData).find(
    ([, value]) => value.ui === uiValue,
  );
  return apiEntry ? (apiEntry[0] as IssuePriorityApi) : 'low'; // 如果未找到则返回默认值
};

// 映射函数：将 API 数据转换为 UI 数据
const mapApiDataToUI = (issue: IssueApiData): IssueUIData => {
  return {
    id: issue.id.toString(),
    title: issue.title,
    description: issue.description,
    status: statusData[issue.status].ui,
    priority: priorityData[issue.priority].ui,
    created: new Date(issue.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  };
};

/**
 * 创建一个新的 Issue。
 * @param issueData 包含新 Issue 数据的对象。
 * @returns Promise<any> 返回服务器的响应数据。
 */
export const createIssue = async (issueData: NewIssueData) => {
  try {
    const response = await api.post('/issues/bulk-add', [issueData]);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const serverErrorMessage = error.response.data?.message || 'Server error';
      console.error('新建 Issue 失败:', serverErrorMessage);
      throw new Error(serverErrorMessage);
    }
    console.error('新建 Issue 失败:', error);
    throw new Error('An unexpected error occurred.');
  }
};

/**
 * 编辑一个 Issue。
 * @param issueData 包含新 Issue 数据的对象。
 * @returns Promise<any> 返回服务器的响应数据。
 */
export const updateIssue = async (issueId: string, issueData: NewIssueData) => {
  try {
    const response = await api.put(`/issues/${issueId}`, issueData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const serverErrorMessage = error.response.data?.message || 'Server error';
      console.error('编辑 Issue 失败:', serverErrorMessage);
      throw new Error(serverErrorMessage);
    }
    console.error('编辑 Issue 失败:', error);
    throw new Error('An unexpected error occurred.');
  }
};

/**
 * 根据 ID 删除一个 Issue。
 * @param issueId 要删除的 Issue 的 ID。
 * @returns Promise<void>
 */
export const deleteIssue = async (issueId: string): Promise<void> => {
  try {
    await api.delete(`/issues/${issueId}`);
    console.log(`Issue with ID ${issueId} deleted successfully.`);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const serverErrorMessage = error.response.data?.message || 'Server error';
      console.error('删除 Issue 失败:', serverErrorMessage);
      throw new Error(serverErrorMessage);
    }
    console.error('删除 Issue 失败:', error);
    throw new Error('An unexpected error occurred.');
  }
};

export const fetchIssues = async (): Promise<IssueUIData[]> => {
  try {
    const response = await api.get('/issues/list');
    console.log('fetchIssues successful, received data:', response.data);

    if (!Array.isArray(response.data)) {
      console.error('API did not return an array:', response.data);
      return [];
    }

    return response.data.map(mapApiDataToUI);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const serverErrorMessage = error.response.data?.message || 'Server error';
      console.error('获取 Issues 失败:', serverErrorMessage);
      throw new Error(serverErrorMessage);
    }
    console.error('获取 Issues 失败:', error);
    throw new Error('An unexpected error occurred.');
  }
};

export const fetchIssueById = async (id: number): Promise<IssueUIData> => {
  try {
    const response = await api.get(`/issues/${id}`);
    // 假设 API 返回单个对象，直接映射
    return mapApiDataToUI(response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const serverErrorMessage = error.response.data?.message || 'Server error';
      console.error('获取 Issue 失败:', serverErrorMessage);
      throw new Error(serverErrorMessage);
    }
    console.error('获取 Issue 失败:', error);
    throw error;
  }
};

export const fetchDashboardData = async () => {
  try {
    const response = await api.get('/issues/dashboard');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const serverErrorMessage = error.response.data?.message || 'Server error';
      console.error('fetchDashboardData 失败:', serverErrorMessage);
      throw new Error(serverErrorMessage);
    }
    console.error('fetchDashboardData:', error);
    throw new Error('An unexpected error occurred.');
  }
};
