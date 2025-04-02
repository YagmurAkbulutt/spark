import axios from "axios";
import Config from 'react-native-config';
import store from "../redux/store";
import { refreshToken } from "../redux/slices/authSlice";

const api = axios.create({
  baseURL: Config.BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "User-Agent": "axios/ReactNative"
  }
});

// token ekleme
api.interceptors.request.use(config => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// token yenileme
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // 401 hatası ve token yenileme denenmemişse
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const response = await store.dispatch(refreshToken());
        const newToken = response.payload?.token;
        
        if (newToken) {
          // Yeni token ile isteği tekrarla
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token yenileme başarısız:', refreshError);
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);




export default api;

export const getSafeUserId = (user) => {
  if (!user) return null;
  
  // String kontrolü de ekleyebiliriz
  const userId = user.id || user._id;
  return typeof userId === 'string' ? userId : null;
};

