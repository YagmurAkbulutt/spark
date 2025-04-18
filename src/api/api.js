import axios from 'axios';
import Config from 'react-native-config';
import store from '../redux/store';
import {refreshToken} from '../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: Config.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'User-Agent': 'axios/ReactNative',
  },
});

// token ekleme
api.interceptors.request.use(
  async function (config) {
    const token =await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization =`Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// token yenileme
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // 401 hatası ve token yenileme denenmemişse
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Yeni token al
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const response = await api.post('/auth/refresh-token', { refreshToken });
        const newToken = response.data.token;

        if (newToken) {
          // AsyncStorage'e yeni token'ı kaydet
          await AsyncStorage.setItem('token', newToken);

          // Yeni token ile isteği tekrarla
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token yenileme başarısız:', refreshError);
        await AsyncStorage.removeItem('token'); // Token'ı temizle
        await AsyncStorage.removeItem('refreshToken'); // Refresh token'ı temizle
        store.dispatch(logout()); // Kullanıcıyı çıkış yap
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

export const getSafeUserId = user => {
  if (!user) return null;

  // ID alanlarına erişmeyi dene (farklı formatlar için)
  const userId = user.id || user._id;

  // Debug için
  console.log('getSafeUserId - user:', user);
  console.log('getSafeUserId - extracted userId:', userId);

  // ID yoksa veya geçersizse null döndür
  if (!userId) return null;

  // Eğer ID bir string değilse, string'e çevir
  return typeof userId === 'string' ? userId : String(userId);
};
