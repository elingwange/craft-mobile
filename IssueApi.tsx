// issuesApi.ts
import api from './ApiService';

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
  status: 'In Progress' | 'Done' | 'Low' | 'Medium' | 'High';
  priority: 'Low' | 'Medium' | 'High';
  created: string;
}

// 这是一个将后端返回的状态和优先级字符串映射到前端显示文本的函数
// 这样可以确保后端字段与前端 UI 的一致性
const mapApiDataToUI = (issue: IssueApiData): IssueUIData => {
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
    const response = await api.get('/issues/list', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Login successful, received data:', response.data);

    return response.data.map(mapApiDataToUI);
  } catch (error) {
    console.error('Could not fetch issues:', error);
    return [];
  }
};
