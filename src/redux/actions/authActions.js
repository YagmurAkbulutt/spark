import {createAsyncThunk} from '@reduxjs/toolkit';
import {postRequest} from '../../api/verbs';
import {LOGIN_URL, BASE_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/api';

const userLogin = createAsyncThunk('auth/userLogin', async payload => {
  try {
    console.log('[AUTH ACTIONS] Login attempt with payload:', payload);
    console.log('[AUTH ACTIONS] Environment variables:', { BASE_URL, LOGIN_URL });
    console.log('[AUTH ACTIONS] Login URL:', LOGIN_URL);
    
    const response = await postRequest(LOGIN_URL, payload);
    console.log('[AUTH ACTIONS] Login response:', response.data ? 'Success' : 'No Data');
    
    if (!response.data) {
      throw new Error('No data in response');
    }
    
    if (!response.data.token) {
      throw new Error('No token in response');
    }
    
    // Token ve refreshToken'ı kaydet
    await AsyncStorage.setItem('token', response.data.token);
    
    // RefreshToken varsa kaydet
    if (response.data.refreshToken) {
      await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
    }
    
    // Token'ı Axios headers'a ekle
    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    
    console.log('[AUTH ACTIONS] Token ve user bilgileri kaydedildi');
    
    return response.data;
  } catch (error) {
    console.error('[AUTH ACTIONS] Login error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
});

const userCheck = createAsyncThunk('auth/userCheck', async (_, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem('token');
    
    if (token) {
      // Token'ı Axios headers'a ekle
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('[AUTH ACTIONS] Mevcut token kullanılıyor');
      return true;
    }

    const refreshToken = await AsyncStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await api.post('/auth/refresh-token', { refreshToken });
      const newToken = response.data.token || response.data.accessToken;
      
      if (!newToken) {
        throw new Error('Refresh token response does not include new token');
      }
      
      await AsyncStorage.setItem('token', newToken);
      
      // Token'ı Axios headers'a ekle
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      console.log('[AUTH ACTIONS] Token yenilendi');
      
      return true;
    } catch (refreshError) {
      console.error('[AUTH ACTIONS] Token yenileme hatası:', refreshError);
      await AsyncStorage.removeItem('refreshToken');
      return false;
    }

  } catch (error) {
    console.error('[AUTH ACTIONS] Token kontrol hatası:', error);
    return rejectWithValue(error.message);
  }
});

const userLogout = createAsyncThunk('auth/userLogout', async () => {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('refreshToken');
    
    // API headers'dan token'ı kaldır
    delete api.defaults.headers.common['Authorization'];
    
    console.log('[AUTH ACTIONS] Kullanıcı çıkış yaptı, token temizlendi');
    return true; 
  } catch (error) {
    console.error('[AUTH ACTIONS] Çıkış yapılırken hata:', error);
    throw error; 
  }
});

export {userLogin, userCheck, userLogout};
