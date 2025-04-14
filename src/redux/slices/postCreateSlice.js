import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  isLoading: false,
  error: null,
};

const postCreateSlice = createSlice({
  name: 'postCreate',
  initialState,
  reducers: {
    postCreateStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    postCreateSuccess: (state, action) => {
      state.isLoading = false;
      state.posts.unshift(action.payload);
    },
    postCreateFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { postCreateStart, postCreateSuccess, postCreateFailure } = postCreateSlice.actions;
export default postCreateSlice.reducer;