import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  savedPosts: [],
  savedCounts: {},
};

const savedPostsSlice = createSlice({
  name: "savedPosts",
  initialState,
  reducers: {
    savePost: (state, action) => {
      const postId = action.payload;
      if (!state.savedPosts.includes(postId)) {
        state.savedPosts.push(postId);
        state.savedCounts[postId] = (state.savedCounts[postId] || 0) + 1;
      }
    },
    unsavePost: (state, action) => {
      const postId = action.payload;
      state.savedPosts = state.savedPosts.filter(id => id !== postId);
      if (state.savedCounts[postId]) {
        state.savedCounts[postId] = Math.max(state.savedCounts[postId] - 1, 0);
      }
    },
  },
});

export const { savePost, unsavePost } = savedPostsSlice.actions;
export default savedPostsSlice.reducer;

