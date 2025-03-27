import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  commenters: [], // Yorum yapan kişilerin ID'leri
};

const commentersSlice = createSlice({
  name: 'commenters',
  initialState,
  reducers: {
    setCommenters: (state, action) => {
      state.commenters = action.payload.commenters;
    },
    addCommenter: (state, action) => {
      state.commenters.push(action.payload.userId);
    },
    removeCommenter: (state, action) => {
      state.commenters = state.commenters.filter(userId => userId !== action.payload.userId);
    },
  },
});

export const { setCommenters, addCommenter, removeCommenter } = commentersSlice.actions;
export default commentersSlice.reducer;
