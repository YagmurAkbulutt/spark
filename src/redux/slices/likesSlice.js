import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import * as api from './apiService'; 


export const fetchLikes = createAsyncThunk('likes/fetchLikes', async (postId) => {
  const response = await api.fetchLikes(postId);  
  return response.data;
});

const initialState = {
  likes: 0,
  likedBy: [], // Beğenen kişilerin ID'leri
  status: 'idle', // Durum: loading, succeeded, failed
};

const likesSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {
    setLikes: (state, action) => {
      state.likes = action.payload.likes;
      state.likedBy = action.payload.likedBy;
    },
    addLike: (state, action) => {
      state.likes += 1;
      state.likedBy.push(action.payload.userId);
    },
    removeLike: (state, action) => {
      state.likes -= 1;
      state.likedBy = state.likedBy.filter(userId => userId !== action.payload.userId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLikes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLikes.fulfilled, (state, action) => {
        state.likes = action.payload.likes;
        state.likedBy = action.payload.likedBy;
        state.status = 'succeeded';
      })
      .addCase(fetchLikes.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { setLikes, addLike, removeLike } = likesSlice.actions;
export default likesSlice.reducer;
