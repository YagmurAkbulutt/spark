import {createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../api/api';

const likePost = createAsyncThunk(
  'posts/likePost',
  async (postId, {rejectWithValue, getState}) => {
    try {
      const {auth} = getState();
      console.log('[likePost] Token:', auth.token);

      const response = await api.post(`posts/${postId}/like`, {});

      console.log('[likePost] API response:', response.data);

      return {
        postId,
        message: response.data.message,
      };
    } catch (error) {
      console.error('[likePost] API Error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export {likePost};
