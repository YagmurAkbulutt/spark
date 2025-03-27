import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  commentCount: 0,
  comments: [], // Yorumlar [{ id, userId, comment }]
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
      // Yeni yorum eklendiğinde yorum sayısını artırıyoruz
      state.comments.push(action.payload.comment);
      state.commentCount += 1; // Yorum sayısını artır
    },
    removeComment: (state, action) => {
      // Yorum silindiğinde yorum sayısını azaltıyoruz
      state.comments = state.comments.filter(comment => comment.id !== action.payload.commentId);
      state.commentCount -= 1; // Yorum sayısını azalt
    },
  },
});

export const { setComments, addComment, removeComment } = commentsSlice.actions;
export default commentsSlice.reducer;
