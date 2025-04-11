import {createAsyncThunk} from '@reduxjs/toolkit';
import {postRequest} from '../../api/verbs';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const userLogin = createAsyncThunk('auth/userLogin', async payload => {
  try {
    const response = await postRequest(Config.LOGIN_URL, payload);
    if (response.data) {
      await AsyncStorage.setItem('token', response.data.token);
      return response.data; // Make sure to return this
    }
    throw new Error('No data in response'); // Handle case where response.data is empty
  } catch (error) {
    // You should reject with the error so it goes to the rejected case
    throw error.response?.data || error.message;
  }
});

const userCheck = createAsyncThunk('auth/userCheck', async (_, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem('token');
    
    if (token) {
      return true;
    }

    const refreshToken = await AsyncStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await api.post('/auth/refresh-token', { refreshToken });
      const newToken = response.data.accessToken;
      
      await AsyncStorage.setItem('token', newToken);
      
      return true;
    } catch (refreshError) {
      await AsyncStorage.removeItem('refreshToken');
      return false;
    }

  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const userLogout = createAsyncThunk('auth/userLogout', async () => {
  try {
    await AsyncStorage.removeItem('token');
    
    await AsyncStorage.removeItem('refreshToken');
    
    return true; 
  } catch (error) {
    console.error('Çıkış yapılırken hata:', error);
    throw error; 
  }
});
export {userLogin,userCheck, userLogout};
