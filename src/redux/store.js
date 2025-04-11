import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import likesReducer from './slices/likesSlice';
import commentsReducer from './slices/commentSlice';
import savedPostsReducer from './slices/savedPostSlice';
import userReducer from "./slices/userSlice"
import categorisReducer from "./slices/categoriesSlice"
import postReducer from "./slices/postSlice"
import searchReducer from "./slices/searchProfileSlice"
import followReducer from "./slices/followSlice"

const store = configureStore({
  reducer: {
    posts : postReducer,
    auth: authReducer,
    user: userReducer,
    likes: likesReducer,
    comments: commentsReducer,
    savedPosts: savedPostsReducer,
    category: categorisReducer,
    searchProfile: searchReducer,
    follow: followReducer
    
  },
});

export default store;
