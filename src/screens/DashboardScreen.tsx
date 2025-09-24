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
    const colors = {
      open: '#70a1ff',
      in_progress: '#feca57',
      completed: '#1dd1a1',
      backlog: '#575fcf',
      done: '#5CB85C',
      low: '#3498DB',
      medium: '#9B59B6',
      high: '#D9534F',
    };

    return dashboardData.taskStatusDistribution.map(item => {
      const formattedStatus = item.status.replace(/_/g, ' ');
      return {
        name: formattedStatus,
        count: item.count,
        color: colors[item.status],
        legendFontColor: '#fff',
        legendFontSize: 14,
      };
    });
  };

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
  // ✅ 更新 chartConfig，添加渐变色配置
  const chartConfig = {
    backgroundGradientFrom: '#1e1e1e',
    backgroundGradientTo: '#1e1e1e',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
    // ✅ 新增渐变色配置
    fillShadowGradientFrom: '#F08C3B', // 渐变起始颜色 (橙色)
    fillShadowGradientTo: '#1e1e1e', // 渐变结束颜色 (与背景色一致)
    fillShadowGradientFromOpacity: 0.8, // 渐变起始颜色不透明度
    fillShadowGradientToOpacity: 0.0, // 渐变结束颜色透明度
    decimalPlaces: 0, // 如果数据是整数，可以设置小数位为0
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Issues Overview</Text>
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
            bezier // ✅ 启用贝塞尔曲线，使折线更平滑
            style={styles.chart}
          />
        </View>

        {/* 任务状态分布饼图 */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Task Status Distribution</Text>
          <PieChart
            data={getPieChartData()} // ✅ 使用格式化后的数据
            width={350}
            height={220}
            chartConfig={chartConfig}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
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
});

export default DashboardScreen;
