import {createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../api/api';
import {getRequest} from '../../api/verbs';
import Config from 'react-native-config';

export const searchProfile = createAsyncThunk(
  'users/searchProfile',
  async (searchTerm, {rejectWithValue}) => {
    console.log(`Redux Thunk Başladı: searchProfile("${searchTerm}")`);

    if (!searchTerm.trim()) {
      console.error('❌ Hata: Arama sorgusu boş olamaz.');
      return rejectWithValue('Arama sorgusu gereklidir');
    }
    try {
      const response = await api.get(
        `${Config.SEARCH_PROFILE_URL}?query=${encodeURIComponent(searchTerm)}`,
      );
      return response.data;
    } catch (error) {
      console.error('❌ API Hatası:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || 'Bilinmeyen bir hata oluştu',
      );
    }
  },
);
