import {createAsyncThunk} from '@reduxjs/toolkit';
import {postRequest} from '../../api/verbs';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const userLogin = createAsyncThunk('auth/userLogin', async payload => {
  try {
    const response = await postRequest(Config.LOGIN_URL, payload);
    if (response.data) {
      await AsyncStorage.setItem('token', response.data.token);
    }
  } catch (error) {
    return error;
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


const userCheck = createAsyncThunk('auth/userCheck', async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      return true;
    }
  } catch (error) {
    return error;
  }
});
export {userLogin,userCheck, userLogout};
