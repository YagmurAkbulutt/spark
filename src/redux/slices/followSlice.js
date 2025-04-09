import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Helper fonksiyonlar
const handlePending = (state) => {
  state.status = "loading";
  state.error = null;
};

const handleRejected = (state, action) => {
  state.status = "failed";
  
  // Enhanced error handling
  const error = action.payload;
  state.error = error;
  
  console.error("API Error Details:", {
    timestamp: new Date().toISOString(),
    errorType: error?.name || 'UnknownError',
    message: error?.message || 'No error message available',
    statusCode: error?.status || error?.response?.status || 'N/A',
    requestUrl: error?.config?.url || 'Unknown endpoint',
    requestMethod: error?.config?.method?.toUpperCase() || 'N/A',
    stackTrace: error?.stack || 'No stack trace available',
    fullError: error
  });
};

// takipçileri görüntüleme
export const fetchFollowers = createAsyncThunk(
  "follow/fetchFollowers",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error("Kullanıcı ID'si geçersiz");
      const response = await api.get(`/api/follow/users/${userId}/followers`);
      return response.data.data.followers;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
// takip edilenleri görüntüleme
export const fetchFollowing = createAsyncThunk(
  "follow/fetchFollowing",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error("Kullanıcı ID'si geçersiz");
      const response = await api.get(`/api/follow/users/${userId}/following`);
      return response.data.data.following;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const followUser = createAsyncThunk(
  "follow/followUser",
  async (userId, { rejectWithValue }) => {
    try {
      // ID değerini kontrol et
      if (!userId || userId === 'undefined' || userId === 'null') {
        console.error("Geçersiz kullanıcı ID'si:", userId);
        return rejectWithValue("Kullanıcı ID'si geçersiz");
      }

      console.log("followUser - Takip edilecek ID:", userId);
      
      const response = await api.post(`/api/follow/users/${userId}/follow`);
      
      // Başarılı yanıt kontrolü
      if (!response.data || !response.data.data || !response.data.data.follow) {
        console.error("API yanıtı beklenen formatta değil:", response.data);
        return rejectWithValue("API yanıtı geçersiz format");
      }
      
      return response.data.data.follow;
    } catch (error) {
      console.error("Takip işlemi API hatası:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const unfollowUser = createAsyncThunk(
  "follow/unfollowUser",
  async (userId, { rejectWithValue }) => {
    try {
      // ID değerini kontrol et
      if (!userId || userId === 'undefined' || userId === 'null') {
        console.error("Geçersiz kullanıcı ID'si:", userId);
        return rejectWithValue("Kullanıcı ID'si geçersiz");
      }

      console.log("unfollowUser - Takipten çıkarılacak ID:", userId);
      
      await api.delete(`/api/follow/users/${userId}/follow`);
      return userId;
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
        state.followers = action.payload || [];
      })
      .addCase(fetchFollowers.rejected, handleRejected)
      .addCase(fetchFollowing.pending, handlePending)
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.following = action.payload || [];
      })
      .addCase(fetchFollowing.rejected, handleRejected)

      // followUser
      .addCase(followUser.pending, handlePending)
      .addCase(followUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        const followedUser = action.payload?.following; // API yanıtına göre bu doğru olabilir
        if (followedUser && !state.following.some(f => f.id === followedUser)) {
          // API'den tam kullanıcı bilgisi gelmiyorsa, burada birleştirme yapmanız gerekebilir
          state.following.push({ id: followedUser }); // Sadece ID ekliyor, diğer bilgiler eksik
        }
      })
      .addCase(followUser.rejected, handleRejected)

      // unfollowUser
      .addCase(unfollowUser.pending, handlePending)
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        const unfollowedUserId = action.payload?.id || action.payload;
        state.following = state.following.filter(f => f.id !== unfollowedUserId);
      })
      .addCase(unfollowUser.rejected, handleRejected)
  }
});

export const { clearFollowError, resetFollowStatus } = followSlice.actions;
export default followSlice.reducer;
