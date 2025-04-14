import {createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../api/api';
import {getRequest} from '../../api/verbs';
import {SEARCH_PROFILE_URL} from '@env';

export const searchProfile = createAsyncThunk(
  'users/searchProfile',
  async (searchTerm, {rejectWithValue}) => {
    console.log(`Redux Thunk Başladı: searchProfile("${searchTerm}")`);

    if (!searchTerm.trim()) {
      console.error('❌ Hata: Arama sorgusu boş olamaz.');
      return rejectWithValue('Arama sorgusu gereklidir');
    }

    // Çevre değişkeni yerine doğrudan string kullanıyoruz
    const searchUrl = 'users/search';
    console.log('🔍 Arama URL:', searchUrl);
    console.log('🔍 Çevre değişkeni SEARCH_PROFILE_URL:', SEARCH_PROFILE_URL);
    
    try {
      console.log(`📡 API çağrısı: ${searchUrl}?query=${encodeURIComponent(searchTerm)}`);
      const response = await api.get(
        `${searchUrl}?query=${encodeURIComponent(searchTerm)}`,
      );
      console.log('✅ Arama sonuçları:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ API Hatası:', error.response?.data || error.message);
      console.error('❌ Hata detayları:', {
        status: error.response?.status,
        config: error.config,
        message: error.message
      });
      return rejectWithValue(
        error.response?.data || 'Bilinmeyen bir hata oluştu',
      );
    }
  },
);
