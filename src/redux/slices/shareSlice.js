import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Başlangıç durumu
const initialState = {
  shareCount: 0,
  loading: false,
  error: null,
};

// API'dan paylaşım sayısını çekmek için asenkron thunk
export const fetchShareCount = createAsyncThunk(
  'share/fetchShareCount',
  async () => {
    const response = await fetch('https://api.example.com/share-count');
    const data = await response.json();
    return data.shareCount;
  }
);

// API'ya paylaşım sayısını güncellemek için thunk
export const updateShareCount = createAsyncThunk(
  'share/updateShareCount',
  async (postId) => {
    const response = await fetch(`https://api.example.com/share/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ increment: 1 }),
    });
    const data = await response.json();
    return data.newShareCount;
  }
);

// Slice oluşturma
const shareSlice = createSlice({
  name: 'share',
  initialState,
  reducers: {
    incrementShareCount: (state) => {
      state.shareCount += 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShareCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShareCount.fulfilled, (state, action) => {
        state.loading = false;
        state.shareCount = action.payload;
      })
      .addCase(fetchShareCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateShareCount.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateShareCount.fulfilled, (state, action) => {
        state.loading = false;
        state.shareCount = action.payload;
      })
      .addCase(updateShareCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Reducer'ı export etme
export default shareSlice.reducer;
