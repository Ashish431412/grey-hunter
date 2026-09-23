import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@utils/constants';

class AuthService {
  async login(credentials: Record<string, string>) {
    const response = await api.post('/auth/login', credentials);
    const { user, tokens } = response.data;
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
    return { user, tokens };
  }

  async register(userData: Record<string, any>) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  }

  async logout() {
    try {
      const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      await api.post('/auth/logout', { token: refreshToken });
    } finally {
      await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    }
  }

  async biometricRegister(publicKey: string) {
    const response = await api.post('/auth/biometric/register', { publicKey });
    return response.data;
  }

  async biometricLogin(signature: string, payload: string) {
    const response = await api.post('/auth/biometric/login', { signature, payload });
    const { user, tokens } = response.data;
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
    return { user, tokens };
  }
}

export default new AuthService();
