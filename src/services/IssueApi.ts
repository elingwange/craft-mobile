// issuesApi.ts
import api from './ApiService';
import axios from 'axios';

// 定义后端 API 返回的任务状态和优先级类型
type IssueStatusApi = 'open' | 'in_progress' | 'completed';
type IssuePriorityApi = 'low' | 'medium' | 'high';

// 定义从后端 API 获取的数据结构
interface IssueApiData {
  id: number;
  title: string;
  description: string;
  status: IssueStatusApi;
  priority: IssuePriorityApi;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

// 定义映射到前端 UI 的数据结构
interface IssueUIData {
  id: string;
  title: string;
  description: string;
  status: 'In Progress' | 'Done' | 'Low' | 'Medium' | 'High';
  priority: 'Low' | 'Medium' | 'High';
  created: string;
}

// 定义用于创建新 Issue 的数据结构
interface NewIssueData {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
}

const mapApiDataToUI = (issue: IssueApiData): IssueUIData => {
  // ✅ 修正 statusMap 的类型，使其只包含 In Progress 和 Done
  const statusMap: Record<IssueStatusApi, 'In Progress' | 'Done'> = {
    open: 'In Progress',
    in_progress: 'In Progress',
    completed: 'Done',
  };

  const priorityMap: Record<IssuePriorityApi, 'Low' | 'Medium' | 'High'> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  };

  return {
    id: issue.id.toString(),
    title: issue.title,
    description: issue.description,
    // ✅ 确保 status 和 priority 的映射正确
    status: statusMap[issue.status],
    priority: priorityMap[issue.priority],
    created: new Date(issue.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  };
};

// fetchIssues 函数现在接收一个 token 参数，并返回一个 Promise，该 Promise 解析为一个 IssueUIData 数组
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
    // ✅ 统一的 Axios 错误处理
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
    // ✅ 统一的 Axios 错误处理
    if (axios.isAxiosError(error) && error.response) {
      const serverErrorMessage = error.response.data?.message || 'Server error';
      console.error('获取 Issue 失败:', serverErrorMessage);
      throw new Error(serverErrorMessage);
    }
    console.error('获取 Issue 失败:', error);
    throw error;
  }
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
    // ✅ 统一的 Axios 错误处理
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
    // ✅ 统一的 Axios 错误处理
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
    // 使用已封装的 api 实例发送 DELETE 请求
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

export const fetchDashboardData = async () => {
  try {
    const response = await api.get('/issues/dashboard');
    // 在这里对数据进行处理和格式化，以匹配前端的 DashboardData 接口
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
