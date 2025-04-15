import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../api/api';

// Async işlem: Post detayını çek
export const fetchPostDetail = createAsyncThunk(
  'postDetail/fetchPostDetail',
  async (postId, { rejectWithValue }) => {
    try {
      console.log('Fetching post with ID:', postId); // postId kontrolü
      const response = await api.get(`posts/${postId}`);
      console.log('API Response post detail:', response.data.data.post); // Tüm yanıtı logla
      
      // API yanıtı { data: { post: {...} } } şeklinde
      return response.data.data.post; // Doğrudan post objesini döndür
    } catch (error) {
      console.error('Error fetching post:', error);
      return rejectWithValue(error.response?.data?.message || 'Post yüklenemedi');
    }
  }
);

// Post detayını temizle (component unmount olduğunda)
export const clearPostDetail = () => ({ type: 'postDetail/clearPostDetail' });