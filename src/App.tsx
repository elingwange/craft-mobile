import React from 'react';
import {
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import RootNavigator from './navigation/RootNavigator';

// AppContent 组件将使用 ThemeProvider 提供的上下文
const AppContent = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <RootNavigator />
      {/** 全局切换主题按钮 */}
      {/* <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
        <Text style={styles.toggleText}>
          {isDarkMode ? '🌞 Bright' : '🌙 Dark'}
        </Text>
      </TouchableOpacity> */}
    </View>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeToggle: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  toggleText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;
