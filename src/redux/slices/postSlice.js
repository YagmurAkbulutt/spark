import {createSlice} from '@reduxjs/toolkit';
import {likePost} from '../actions/postActions';

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    setPosts: (state, action) => {
      console.log('[setPosts] Posts yüklendi:', action.payload);
      state.posts = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(likePost.pending, state => {
        console.log('[likePost.pending] İstek gönderiliyor...');
        state.status = 'loading';
      })
      .addCase(likePost.fulfilled, (state, action) => {
        console.log('[likePost.fulfilled] Yanıt alındı:', action.payload);

        state.status = 'succeeded';
        const {postId, message} = action.payload;

        const post = state.posts.find(p => p.id === postId);
        if (post) {
          post.liked = message === 'Gönderi beğenildi';
          console.log(
            `[likePost.fulfilled] Post ${postId} için like durumu:`,
            post.liked,
          );
        }
      })
      .addCase(likePost.rejected, (state, action) => {
        console.error('[likePost.rejected] Hata:', action.payload);
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const {setPosts} = postsSlice.actions;
export default postsSlice.reducer;
