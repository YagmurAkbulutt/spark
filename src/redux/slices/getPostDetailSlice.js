import { createSlice } from '@reduxjs/toolkit';
import { fetchPostDetail } from '../actions/getPostDetailActions';


const initialState = {
  currentPost: [], // Store single post instead of array
  loading: false,
  error: null
};

const postDetailSlice = createSlice({
  name: 'postDetail',
  initialState,
  reducers: {
    clearPostDetail: (state) => {
      state.currentPost = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload; // Store single post
      })
      .addCase(fetchPostDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});
  
  export const { clearPostDetail, addPost } = postDetailSlice.actions;
  export default postDetailSlice.reducer;

