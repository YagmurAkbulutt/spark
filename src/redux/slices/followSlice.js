import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Helper fonksiyonlar
const handlePending = (state) => {
  state.status = "loading";
  state.error = null;
};

const handleRejected = (state, action) => {
  state.status = "failed";
  state.error = action.payload;
  console.error("API Error:", action.payload);
};

// Async Thunk'lar
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
      if (!userId) throw new Error("Kullanıcı ID'si geçersiz");
      const response = await api.post(`/api/follow/users/${userId}/follow`);
      return response.data.data.follow;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const unfollowUser = createAsyncThunk(
  "follow/unfollowUser",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error("Kullanıcı ID'si geçersiz");
      await api.delete(`/api/follow/users/${userId}/follow`);
      return userId;
    } catch (error) {
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
        if (action.payload && !state.following.some(f => f.id === action.payload.id)) {
          state.following.push(action.payload);
        }
      })
      .addCase(followUser.rejected, handleRejected)

      // unfollowUser
      .addCase(unfollowUser.pending, handlePending)
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.following = state.following.filter(f => f.id !== action.payload);
      })
      .addCase(unfollowUser.rejected, handleRejected);
  }
});

export const { clearFollowError, resetFollowStatus } = followSlice.actions;
export default followSlice.reducer;
