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
import brandReducer from "./slices/brandSlice"
import photoReducer from "./slices/photoSlice"
import colorReducer from "./slices/colorSlice"
import postDetailReducer from "./slices/postDetailSlice"
import productLinkReducer from "./slices/productLinkSlice"
import postCreateReducer from "./slices/postCreateSlice"
import getPostDetailReducer from "./slices/getPostDetailSlice"

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
    follow: followReducer,
    brands: brandReducer,
    photo: photoReducer,
    colors:colorReducer,
    postDetail: postDetailReducer,
    productLink: productLinkReducer,
    postCreate: postCreateReducer,
    getPostDetail: getPostDetailReducer
    
  },
});

export default store;
