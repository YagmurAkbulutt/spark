import {createAsyncThunk} from '@reduxjs/toolkit';
import {getRequest, patchRequest} from '../../api/verbs';
import Config from 'react-native-config';

const getUserInfo = createAsyncThunk('user/getUserInfo', async params => {
  try {
    const response = await getRequest(Config.USER_INFO_URL, params);
    console.log("kullanıcı versi:",response.data.data)
    return response.data.data.user;
  } catch (error) {
    return error;
  }
});

const profileUpdate = createAsyncThunk(
  'user/profileUpdate',
  async (formData) => {
    try {
      const response = await patchRequest(Config.PROFILE_UPDATE_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, 
      });
      return response.data.data.user; 
    } catch (error) {
      throw error; 
    }
  }
);

export {
    getUserInfo,
    profileUpdate
}