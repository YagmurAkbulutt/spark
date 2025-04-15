import {createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../api/api';


// Tüm feed postlarını çekme 
export const fetchFeedPosts = createAsyncThunk(
  'posts/fetchFeedPosts', 
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('posts/feed');
      console.log('API Response:', response.data.data.posts); 
      return response.data.data.posts; 
    } catch (error) {
      console.error('API Error:', error); 
      return rejectWithValue(error.response?.data?.message || 'Network Error');
    }
  }
);

// kullanıcı postlarını çekme
export const fetchUserPosts = createAsyncThunk(
  'posts/fetchUserPosts', // Burada action type'ı daha anlamlı yaptım
  async (userId, { rejectWithValue }) => { // userId parametre olarak alınıyor
    try {
      const response = await api.get(`users/${userId}/posts`); // Backtick kullanımı ve userId
      console.log('user post API response:', response.data.data.posts); 
      return response.data.data.posts; 
    } catch (error) {
      console.error('API Error:', error); 
      return rejectWithValue(error.response?.message || 'Network Error');
    }
  }
);




// Postları temizleme 
export const clearPosts = () => ({ type: 'posts/clearPosts' });

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
