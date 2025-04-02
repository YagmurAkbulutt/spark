import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../api/api';

export const searchProfile = createAsyncThunk(
  'users/searchProfile',
  async (searchTerm, { rejectWithValue }) => {
    console.log(`Redux Thunk Başladı: searchProfile("${searchTerm}")`);

    if (!searchTerm.trim()) {
      console.error('❌ Hata: Arama sorgusu boş olamaz.');
      return rejectWithValue('Arama sorgusu gereklidir');
    }

    try {
      // Use 'query' parameter instead of 'q' to match your backend
      const response = await api.get(`/api/users/search?query=${encodeURIComponent(searchTerm)}`);
      console.log('API Yanıtı:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ API Hatası:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || 'Bilinmeyen bir hata oluştu');
    }
  }
);


const searchProfileSlice = createSlice({
  name: 'searchProfile',
  initialState: {
    users: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload.data.users.map(user => ({
          id: user.id,
          username: user.username,
          profilePicture: user.profilePicture,
          bio: user.bio
        }));
      })
      .addCase(searchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export default searchProfileSlice.reducer;
