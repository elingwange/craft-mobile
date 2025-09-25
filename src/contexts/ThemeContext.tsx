import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import { useColorScheme } from 'react-native';

// 定义主题的颜色类型
interface ThemeColors {
  background: string;
  card: string;
  text: string;
  subText: string;
  icon: string;
  primary: string;
  inputBackground: string;
  border: string;
  buttonText: string;
  chartBackgroundFrom: string;
  chartBackgroundTo: string;
  chartFillFrom: string;
  chartFillTo: string;
  danger: string;
}

// 定义亮色和暗色主题
const darkTheme: ThemeColors = {
  background: '#121212',
  card: '#1e1e1e',
  text: '#E0E0E0',
  subText: '#A0A0A0',
  icon: '#E0E0E0',
  primary: '#F0AD4E',
  inputBackground: '#333333',
  border: '#444444',
  buttonText: '#FFFFFF',
  chartBackgroundFrom: '#1e1e1e',
  chartBackgroundTo: '#1e1e1e',
  chartFillFrom: '#F08C3B',
  chartFillTo: '#1e1e1e',
  danger: '#751d13ff',
};

const lightTheme: ThemeColors = {
  background: '#F0F2F5',
  card: '#FFFFFF',
  text: '#333333',
  subText: '#666666',
  icon: '#333333',
  primary: '#2B6CB0',
  inputBackground: '#EAEAEA',
  border: '#CCCCCC',
  buttonText: '#FFFFFF',
  chartBackgroundFrom: '#FFFFFF',
  chartBackgroundTo: '#FFFFFF',
  chartFillFrom: '#6398D9',
  chartFillTo: '#FFFFFF',
  danger: '#d77b71ff',
};

// 定义上下文的类型
interface ThemeContextType {
  isDarkMode: boolean;
  theme: ThemeColors;
  toggleTheme: () => void;
}

// 创建主题上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 自定义 Hook，用于在组件中获取主题
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// 主题提供者组件
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const colorScheme = useColorScheme(); // 获取系统主题
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
  const theme = isDarkMode ? darkTheme : lightTheme;

  // 关键修改: 监听系统主题变化，并更新 isDarkMode 状态
  useEffect(() => {
    setIsDarkMode(colorScheme === 'dark');
  }, [colorScheme]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
