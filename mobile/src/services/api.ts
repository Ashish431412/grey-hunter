import axios from 'axios';
import { API_URL, STORAGE_KEYS } from '@utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '@store/index';
import { logout } from '@store/slices/authSlice';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          const res = await axios.post(`${API_URL}/auth/refresh`, { token: refreshToken });
          if (res.data.accessToken) {
            await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (e) {
        // Refresh failed, force logout
        store.dispatch(logout());
      }
    }
    return Promise.reject(error);
  }
);

export default api;
