import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Kullanıcı giriş yapma işlemi
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    console.log("loginuser");
    try {
      console.log("try deneme");
      console.log("API URL:", api.defaults.baseURL + "/api/auth/login");
      const response = await api.post("/api/auth/login", userData);
      
      return response.data;  
      

    } catch (error) {
      console.log("error", error);
      return rejectWithValue(error.response?.data || "Bir hata oluştu"); // Hata mesajını döndür
    }
  }
);





// Kullanıcı kayıt işlemi
export const registerUser = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await authApi.register(userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Şifremi unuttum işlemi
export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (email, { rejectWithValue }) => {
  try {
    const response = await authApi.forgotPassword(email);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    refreshToken: null,
    isLoading: false,
    error: null,
    username: "",
    userPhoto: "",
    message: "",
    bio: ""
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.username = "";
      state.userPhoto = "";
      state.message = "";
      state.bio = "";
    },
    refreshTokens: (state, action) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.data.user;
      state.username = action.payload.data.user.username;
      state.userPhoto = action.payload.data.user.profilePicture;
      state.bio = action.payload.data.user.bio;
    })
    .addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload; 
      console.error("Hata:", action.payload); 
    })
    
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.message = "E-posta başarıyla gönderildi. Lütfen e-posta adresinizi kontrol edin."; // Mesajı buraya ekledik
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setUserProfile, refreshTokens } = authSlice.actions;
export default authSlice.reducer;
