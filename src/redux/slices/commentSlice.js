import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  commentCount: 0,
  comments: [],
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setComments: (state, action) => {
      state.commentCount = action.payload.commentCount;
      state.comments = action.payload.comments;
    },
    addComment: (state, action) => {
      state.comments.push(action.payload.comment);
      state.commentCount += 1;
    },
    removeComment: (state, action) => {
      state.comments = state.comments.filter(comment => comment.id !== action.payload.commentId);
      state.commentCount -= 1; 
    },
  },
});

export const { setComments, addComment, removeComment } = commentsSlice.actions;
export default commentsSlice.reducer;
