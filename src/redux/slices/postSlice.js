import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: (state, action) => {
      return { ...state, posts: [...state.posts, action.payload] }; 
    },
      
    updatePost: (state, action) => {
      const index = state.posts.findIndex(post => post.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
    },
  },
});

export const { addPost, updatePost, deletePost } = postSlice.actions;
export default postSlice.reducer;

// addPost: (state, action) => {
    //     state.posts.push({
    //       id: action.payload.id,
    //       photo: action.payload.photo,
    //       title: action.payload.title,
    //       description: action.payload.description,
    //       category: {
    //         name: action.payload.category.name,
    //         brand: action.payload.category.brand,
    //         color: action.payload.category.color,
    //       },
    //       poll: action.payload.poll,
    //       tags: action.payload.tags,
    //       mentions: action.payload.mentions,
    //     });
    //   },
