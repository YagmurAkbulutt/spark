import { createSlice } from '@reduxjs/toolkit';
import { fetchPostDetail } from '../actions/getPostDetailActions';


const initialState = {
    posts: [], // Artık bir dizi olarak tanımlandı
    loading: false,
    error: null
  };
  
  const postDetailSlice = createSlice({
    name: 'postDetail',
    initialState,
    reducers: {
      // Tüm postları temizle
      clearPostDetail: (state) => {
        state.posts = [];
        state.loading = false;
        state.error = null;
      },
      // Tek bir post eklemek için (isteğe bağlı)
      addPost: (state, action) => {
        state.posts.push(action.payload);
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchPostDetail.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchPostDetail.fulfilled, (state, action) => {
          state.loading = false;
          // API'den gelen veriyi diziye ekleyin
          state.posts = [...state.posts, action.payload]; // Veya direkt atama: state.posts = action.payload;
        })
        .addCase(fetchPostDetail.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    }
  });
  
  export const { clearPostDetail, addPost } = postDetailSlice.actions;
  export default postDetailSlice.reducer;

