// apiService.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IP = '10.176.230.168';
const API_BASE_URL: string = `http://${IP}:8889`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// 请求拦截器
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default api;
