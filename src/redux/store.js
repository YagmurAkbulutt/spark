import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import likesReducer from './slices/likesSlice';
import commentsReducer from './slices/commentSlice';
import commentersReducer from './slices/commenterSlice';
import savedPostsReducer from './slices/savedPostSlice';
import shareReducer from "./slices/shareSlice"
import userReducer from "./slices/userSlice"
import messageReducer from "./slices/messagesSlice"
import photoReducer from "./slices/photoSlice"
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
    commenters: commentersReducer,
    savedPosts: savedPostsReducer,
    share: shareReducer,
    messages: messageReducer,
    photo: photoReducer,
    category: categorisReducer,
    searchProfile: searchReducer,
    follow: followReducer
    
  },
});

export default store;
