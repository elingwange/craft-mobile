import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { LineChart, PieChart } from 'react-native-chart-kit';

// 定义 API 返回的概览数据类型
interface DashboardApiData {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  taskCompletionTrend: {
    label: string;
    data: number;
  }[];
  taskStatusDistribution: {
    status: string;
    count: number;
  }[];
}

const screenWidth = Dimensions.get('window').width;

import { fetchDashboardData } from '../services/IssueApi';

const DashboardScreen: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardApiData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const data = await fetchDashboardData();
          setDashboardData(data);
        } catch (error) {
          console.error('Failed to fetch dashboard data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }, []),
  );

  if (isLoading || !dashboardData) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  // 为饼图数据添加颜色和标签
  const getPieChartData = () => {
    // 预设颜色
    const predefinedColors = {
      done: '#1dd1a1',
      completed: '#1dd1a1',
      todo: '#feca57',
      open: '#feca57',
      in_progress: '#575fcf',
      backlog: '#a0a0a0',
    };

    // 定义所有需要显示的固定状态
    const allStatuses = ['done', 'todo', 'in_progress', 'backlog'];

    // 创建一个 Map，用于快速查找 API 返回的数据
    const statusMap = new Map(
      dashboardData.taskStatusDistribution.map(item => [
        item.status,
        item.count,
      ]),
    );

    // 强制包含所有状态，即使计数为0
    return allStatuses.map(status => {
      const count = statusMap.get(status) || 0;
      const formattedStatus = status.replace(/_/g, ' ');

      return {
        name: `${formattedStatus}`, // 移除百分比，只保留状态名称
        count: count,
        color:
          predefinedColors[status] ||
          `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        legendFontColor: '#fff',
        legendFontSize: 14,
      };
    });
  };

  // 检查扇形图数据是否全部为零，用于条件渲染
  const pieChartData = getPieChartData();
  const hasPieChartData = pieChartData.some(item => item.count > 0);

  // 格式化折线图数据
  const getLineChartData = () => {
    return {
      labels: dashboardData.taskCompletionTrend.map(item => item.label),
      datasets: [
        {
          data: dashboardData.taskCompletionTrend.map(item => item.data),
        },
      ],
    };
  };

  // 图表配置
  const chartConfig = {
    backgroundGradientFrom: '#1e1e1e',
    backgroundGradientTo: '#1e1e1e',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
    fillShadowGradientFrom: '#F08C3B',
    fillShadowGradientTo: '#1e1e1e',
    fillShadowGradientFromOpacity: 0.8,
    fillShadowGradientToOpacity: 0.0,
    decimalPlaces: 0,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Overview</Text>
      <ScrollView style={styles.container}>
        {/* 统计卡片 */}
        <View style={styles.statsCard}>
          <Text style={styles.statNumber}>{dashboardData.totalTasks}</Text>
          <Text style={styles.statLabel}>Total Tasks</Text>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statNumber}>{dashboardData.completedTasks}</Text>
          <Text style={styles.statLabel}>Completed Tasks</Text>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statNumber}>
            {`${(dashboardData.completionRate * 100).toFixed(0)}%`}
          </Text>
          <Text style={styles.statLabel}>Completion Rate</Text>
        </View>

        {/* 任务完成趋势图 */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Task Completion Trend</Text>
          <LineChart
            data={getLineChartData()}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        {/* 任务状态分布饼图 */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Task Status Distribution</Text>
          {hasPieChartData ? (
            <PieChart
              data={pieChartData}
              width={350}
              height={220}
              chartConfig={chartConfig}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="15"
              style={styles.chart}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>暂无数据</Text>
            </View>
          )}
        </View>

        <View style={styles.chartBottom} />
      </ScrollView>
    </SafeAreaView>
  );
};

// 样式表
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    padding: 16,
  },
  title: {
    paddingLeft: 16,
    paddingVertical: 10,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#E0E0E0',
  },
  statsCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 16,
    color: '#a0a0a0',
  },
  chartCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  chart: {
    borderRadius: 10,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartBottom: {
    marginBottom: 30,
  },
  noDataContainer: {
    width: 350,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
