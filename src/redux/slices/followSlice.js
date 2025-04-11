import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import Config from "react-native-config";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Helper fonksiyonlar
const handlePending = (state) => {
  state.status = "loading";
  state.loading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.status = "failed";
  state.loading = false;
  
  // Hata payload'u artık bir obje olacak
  const error = action.payload || {};
  state.error = error.message || "Bilinmeyen hata";
  
  console.error("API Error Details:", {
    timestamp: new Date().toISOString(),
    errorType: error.originalError?.name || 'UnknownError',
    message: error.message || 'No error message available',
    statusCode: error.originalError?.response?.status || 'N/A',
    requestUrl: error.originalError?.config?.url || 'Unknown endpoint',
    requestMethod: error.originalError?.config?.method?.toUpperCase() || 'N/A',
    stackTrace: error.originalError?.stack || 'No stack trace available',
    fullError: error.originalError || error
  });
};

// Takip listesindeki ID'leri normalize eden yardımcı fonksiyon
const normalizeId = (id) => {
  if (!id) return null;
  return typeof id === 'string' ? id : String(id);
};

// Kullanıcının takip durumunu kontrol eden yardımcı fonksiyon
export const isUserFollowing = (following, targetUserId) => {
  if (!following || !following.length || !targetUserId) return false;
  
  // Tüm olası ID formatlarını kontrol et
  const normalizedTargetId = normalizeId(targetUserId);
  
  return following.some(user => {
    const followingId = normalizeId(user.id) || normalizeId(user._id) || normalizeId(user.userId);
    return followingId === normalizedTargetId;
  });
};

// Async Thunk'lar
// export const fetchFollowers = createAsyncThunk(
//   "follow/fetchFollowers",
//   async (userId, { rejectWithValue }) => {
//     try {
//       if (!userId) throw new Error("Kullanıcı ID'si geçersiz");
//       console.log("Takipçiler getiriliyor, userId:", userId);
//       const response = await api.get(`follow/users/${userId}/followers`);
//       console.log("takpçiler bilgi", response)
//       return response.data.data.followers;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );


export const fetchFollowers = createAsyncThunk(
  "follow/fetchFollowers",
  async (userId, { rejectWithValue, getState }) => {
    try {
      if (!userId) throw new Error("Kullanıcı ID'si geçersiz");
      
      
      const baseUrl = Config.BASE_URL;
      const fullUrl = `${baseUrl}follow/users/${userId}/followers`;
      
      console.log('[API REQUEST] FetchFollowers URL:', fullUrl);
      console.log('[API REQUEST] Headers:', {
        Authorization: `Bearer ${getState().auth.token}`,
        'Content-Type': 'application/json'
      });

      const response = await api.get(`follow/users/${userId}/followers`);
      
      console.log('[API RESPONSE] FetchFollowers:', {
        status: response.status,
        data: response.data,
        config: {
          url: response.config.url,
          method: response.config.method,
          headers: response.config.headers
        }
      });

      return response.data.data.followers;
    } catch (error) {
      console.error('[API ERROR] FetchFollowers:', {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchFollowing = createAsyncThunk(
  "follow/fetchFollowing",
  async (userId, { rejectWithValue, getState }) => {
    try {
      if (!userId) throw new Error("Kullanıcı ID'si geçersiz");
      
      const baseUrl = Config.BASE_URL;
      const fullUrl = `${baseUrl}follow/users/${userId}/following`;
      
      console.log('[API REQUEST] FetchFollowing URL:', fullUrl);
      console.log('[API REQUEST] Headers:', {
        Authorization: `Bearer ${getState().auth.token}`,
        'Content-Type': 'application/json'
      });

      const response = await api.get(`follow/users/${userId}/following`);
      
      console.log('[API RESPONSE] FetchFollowing:', {
        status: response.status,
        data: response.data,
        config: {
          url: response.config.url,
          method: response.config.method,
          headers: response.config.headers
        }
      });

      return response.data.data.following;
    } catch (error) {
      console.error('[API ERROR] FetchFollowing:', {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// export const fetchFollowing = createAsyncThunk(
//   "follow/fetchFollowing",
//   async (userId, { rejectWithValue }) => {
//     try {
//       if (!userId) throw new Error("Kullanıcı ID'si geçersiz");
//       console.log("Takip edilenler getiriliyor, userId:", userId);
//       const response = await api.get(`follow/users/${userId}/following`);
//       console.log("takp edilenler bilgi", response)
//       // fetchFollowing içindeki logları güncelleyin
// console.log("API Response - Following:", {
//   status: response.status,
//   data: response.data
// });
//       return response.data.data.following;
      
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

export const followUser = createAsyncThunk(
  "follow/followUser",
  async (userId, { rejectWithValue, dispatch, getState }) => {
    try {
      // 1. userId kontrolü (hala önemli)
      if (!userId || userId === 'undefined' || userId === 'null') {
        return rejectWithValue("Geçersiz kullanıcı ID'si");
      }

      // 2. Giriş yapmış kullanıcının ID'sini direkt al
      const { auth } = getState();
      const currentUserId = auth.user.id || auth.user._id; // Artık null kontrolü yok
     
      console.log(`Takip işlemi - Kullanıcı ${currentUserId}, Hedef: ${userId}`);

      // 3. Zaten takip ediliyor mu kontrolü
      if (isUserFollowing(getState().follow.following, userId)) {
        return rejectWithValue("Bu kullanıcıyı zaten takip ediyorsunuz");
      }

      // 4. API isteği gönder
      const response = await api.post(`follow/users/${userId}`);

      // 5. Başarılı yanıtı işle
      if (response.data?.status === 'success') {
        // Optimistik update için 300ms bekle
        setTimeout(() => {
          dispatch(fetchFollowing(currentUserId));
          dispatch(fetchFollowers(userId));
        }, 300);
        
        return { 
          followData: response.data.data.follow, 
          userId 
        };
      }
      
      return rejectWithValue(response.data?.message || "Takip işlemi başarısız");

    } catch (error) {
      console.error("Takip hatası:", error);
      return rejectWithValue({
        message: error.response?.data?.message || "Takip işlemi sırasında hata",
        code: error.response?.status,
      });
    }
  }
);

export const unfollowUser = createAsyncThunk(
  "follow/unfollowUser",
  async (userId, { rejectWithValue, dispatch, getState }) => {
    try {
      if (!userId || userId === 'undefined' || userId === 'null') {
        console.error("Geçersiz kullanıcı ID'si:", userId);
        return rejectWithValue("Kullanıcı ID'si geçersiz");
      }
      
      const currentUser = getState().auth.user;
      if (!currentUser || (!currentUser._id && !currentUser.id)) {
        return rejectWithValue("Kullanıcı girişi yapılmamış");
      }
      
      const currentUserId = currentUser._id || currentUser.id;
      console.log(`Takipten çıkarma işlemi - Kullanıcı ${currentUserId}, Hedef: ${userId}`);
      
      // Takip ediliyor mu kontrol et
      const currentFollowing = getState().follow.following;
      if (!isUserFollowing(currentFollowing, userId)) {
        return rejectWithValue("Bu kullanıcıyı takip etmiyorsunuz");
      }
      
      // Web ile uyumlu endpoint kullanımı
      await api.delete(`follow/users/${userId}`);
      
      // İşlem başarılı olduktan sonra güncel listeleri al
      setTimeout(() => {
        dispatch(fetchFollowing(currentUserId));
        dispatch(fetchFollowers(userId));
      }, 300);
      
      return { userId }; // Takipten çıkarılan kullanıcının ID'sini döndür
    } catch (error) {
      console.error("Takipten çıkarma API hatası:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const followSlice = createSlice({
  name: "follow",
  initialState: {
    followers: [],
    following: [],
    status: "idle",
    error: null,
    loading: false
  },
  reducers: {
    clearFollowError: (state) => {
      state.error = null;
    },
    resetFollowStatus: (state) => {
      state.status = "idle";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowers.pending, handlePending)
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.followers = action.payload || [];
      })
      .addCase(fetchFollowers.rejected, handleRejected)
      .addCase(fetchFollowing.pending, handlePending)
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.following = action.payload || [];
      })
      .addCase(fetchFollowing.rejected, handleRejected)

      // followUser
      .addCase(followUser.pending, handlePending)
      .addCase(followUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        
        // Action payload'dan userId'yi al
        const userId = action.payload?.userId;
        
        if (userId) {
          // Eğer bu kullanıcı henüz takip edilenler listesinde yoksa ekle
          const existingIndex = state.following.findIndex(f => 
            f.id === userId || f._id === userId
          );
          
          if (existingIndex === -1) {
            state.following.push({ 
              id: userId, 
              _id: userId 
            });
          }
        }
      })
      .addCase(followUser.rejected, handleRejected)

      // unfollowUser
      .addCase(unfollowUser.pending, handlePending)
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        
        // Action payload'dan userId'yi al
        const userId = action.payload?.userId;
        
        if (userId) {
          // Takip edilen kullanıcıyı listeden çıkar (farklı ID formatlarını kontrol et)
          state.following = state.following.filter(f => 
            f.id !== userId && f._id !== userId
          );
        }
      })
      .addCase(unfollowUser.rejected, handleRejected)
  }
});

export const { clearFollowError, resetFollowStatus } = followSlice.actions;
export default followSlice.reducer;