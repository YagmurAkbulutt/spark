import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  name: '',
  username: '',
  email: '',
  password: '',  // Kullanıcının şifresi (şifreleme için backend tarafında hashlenmelidir!)
  avatar: '',
  bio: '',
  website: '',
  followers: [],
  following: [],
  posts: [],
  likedPosts: [],
  savedPosts: [],
  notifications: [],
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Kullanıcı giriş yaparsa bilgileri güncelle
    loginUser: (state, action) => {
      return { ...state, ...action.payload, isAuthenticated: true };
    },
    
    // Kullanıcı çıkış yaparsa bilgileri sıfırla
    logoutUser: (state) => {
      return { ...initialState };
    },

    // Kullanıcı profil bilgilerini güncelle
    updateProfile: (state, action) => {
      return { ...state, ...action.payload };
    },

    // Kullanıcı adı güncelleme
    updateUsername: (state, action) => {
      state.username = action.payload;
    },

    // Profil fotoğrafını güncelleme
    updateAvatar: (state, action) => {
      state.avatar = action.payload;
    },

    // Biyografi güncelleme
    updateBio: (state, action) => {
      state.bio = action.payload;
    },

    // Şifre güncelleme (Backend tarafında hashlenmelidir!)
    updatePassword: (state, action) => {
      state.password = action.payload;
    },

    // Takipçi ekle veya çıkar
    toggleFollow: (state, action) => {
      const userId = action.payload;
      if (state.following.includes(userId)) {
        state.following = state.following.filter(id => id !== userId);
      } else {
        state.following.push(userId);
      }
    },

    // Gönderi paylaşma
    addPost: (state, action) => {
      state.posts.push(action.payload);
    },

    // Gönderiyi silme
    deletePost: (state, action) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
    },

    // Gönderiyi beğenme veya beğenmeyi kaldırma
    toggleLikePost: (state, action) => {
      const postId = action.payload;
      if (state.likedPosts.includes(postId)) {
        state.likedPosts = state.likedPosts.filter(id => id !== postId);
      } else {
        state.likedPosts.push(postId);
      }
    },

    // Gönderiyi kaydetme veya kaydedilmişse kaldırma
    toggleSavePost: (state, action) => {
      const postId = action.payload;
      if (state.savedPosts.includes(postId)) {
        state.savedPosts = state.savedPosts.filter(id => id !== postId);
      } else {
        state.savedPosts.push(postId);
      }
    },

    // Yeni bildirim ekleme
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },

    // Bildirimleri temizleme
    clearNotifications: (state) => {
      state.notifications = [];
    }
  }
});

export const { 
  loginUser, 
  logoutUser, 
  updateProfile, 
  updateUsername,
  updateAvatar,
  updateBio,
  updatePassword,
  toggleFollow, 
  addPost, 
  deletePost, 
  toggleLikePost, 
  toggleSavePost, 
  addNotification, 
  clearNotifications 
} = userSlice.actions;

export default userSlice.reducer;
