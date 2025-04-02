import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Token yenileme işlemi
export const refreshToken = createAsyncThunk("auth/refreshToken", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState().auth;
    const response = await api.post("/api/auth/refresh-token", { refreshToken: state.refreshToken });
    
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Token yenileme başarısız");
  }
});

// Kullanıcı giriş yapma işlemi
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    console.log("loginUser çalıştırıldı");
    try {
      console.log("API URL:", api.defaults.baseURL + "/api/auth/login");
      console.log("Gönderilen userData:", userData);
      const response = await api.post("/api/auth/login", userData, {
        headers: { "Content-Type": "application/json" },
      });
      
      return response.data;  
    } catch (error) {
      console.log("loginUser error", error);
      return rejectWithValue(error.response?.data || "Bir hata oluştu");
    }
  }
);

// Kayıt Olma - Adım 1 (Email, şifre, ad alma)
export const registerUserStep1 = createAsyncThunk(
  "auth/signupStep1",
  async (userData, { rejectWithValue }) => {
    try {
      console.log("registeruser")
      const response = await api.post("/api/auth/signup/step1", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Bir hata oluştu");
    }
  }
);

// Kayıt Olma - Adım 2 (Username belirleme ve tamamlanma)
export const registerUserStep2 = createAsyncThunk(
  "auth/signupStep2",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/signup/step2", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Kayıt işlemi sırasında bir hata oluştu:", error); 
      return rejectWithValue(error.response?.data || error.message || "Bir hata oluştu");
    }
  }
);


// Google ile giriş/kayıt (Email, şifre, ad alma)
export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (googleData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/google", googleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Bir hata oluştu");
    }
  }
);

// Google kayıt tamamla - Adım 2 (Username belirleme ve tamamlanma)
export const completeGoogleSignup = createAsyncThunk(
  "auth/completeGoogleSignup",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/signup/step2", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Bir hata oluştu");
    }
  }
);

// Apple ile giriş/kayıt
export const loginWithApple = createAsyncThunk(
  "auth/loginWithApple",
  async (appleData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/apple", appleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Bir hata oluştu");
    }
  }
);

// Apple kayıt tamamla - Adım 2
export const completeAppleSignup = createAsyncThunk(
  "auth/completeAppleSignup",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/signup/step2", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Bir hata oluştu");
    }
  }
);


// Şifremi unuttum işlemi
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/forgot-password', { email });
      console.log('API Response:', response.data); 
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response);
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.message || 
        'Şifre sıfırlama isteği gönderilirken bir hata oluştu'
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    refreshToken: null,
    tempToken: null,
    isLoading: false,
    error: null,
    username: "",
    userPhoto: "",
    message: "",
    bio: "",
    profilePicture: null,
    isNewUser: false,
    fullName: "", 
    identifier: "",     
    password: "",  
    forgotPasswordLoading: false,
    forgotPasswordError: null,
    forgotPasswordSuccess: null
  },
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.userToken = null;
      state.user = null;
      state.refreshToken = null;

      // AsyncStorage'den verileri sil
      AsyncStorage.removeItem("isLoggedIn");
      AsyncStorage.removeItem("userToken");
      AsyncStorage.removeItem("user");
      AsyncStorage.removeItem("refreshToken");
    },
    refreshTokens: (state, action) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
    setUserProfile: (state, action) => {
      state.fullName = action.payload.fullName || state.fullName;
      state.identifier = action.payload.identifier || state.identifier;
      state.password = action.payload.password || state.password;
    },
    setProfilePicture: (state, action) => {
      state.profilePicture = action.payload;
    },
    resetForgotPasswordState: (state) => {
      state.forgotPasswordLoading = false;
      state.forgotPasswordError = null;
      state.forgotPasswordSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(refreshToken.fulfilled, (state, action) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    })
    .addCase(refreshToken.rejected, (state, action) => {
      state.error = action.payload;
    })
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
    
    // Adım 1: Kayıt başlangıcı
    .addCase(registerUserStep1.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(registerUserStep1.fulfilled, (state, action) => {
      state.isLoading = false;
      state.fullName = action.payload.fullName; 
      state.identifier = action.payload.identifier;
      state.password = action.payload.password;
      state.tempToken = action.payload.tempToken;
      state.profilePicture = action.payload.profilePicture;
      state.isNewUser = true;
    })
    .addCase(registerUserStep1.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    
    // Adım 2: Kayıt tamamlanıyor
    .addCase(registerUserStep2.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.data.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.tempToken = null;
      state.isNewUser = false;
    })
    .addCase(registerUserStep2.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Bir hata oluştu";
      console.error("Kayıt işlemi başarısız:", action.payload); 
    })
    
    
    // Google ile giriş/kayıt
    .addCase(loginWithGoogle.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isGoogleLogin = true;
      if (action.payload.isNewUser) {
        state.tempToken = action.payload.tempToken;
        state.profilePicture = action.payload.profilePicture;
        state.isNewUser = true;
        state.isGoogleLogin = true;
      } else {
        state.user = action.payload.data.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isNewUser = false;
      }
    })
    .addCase(completeGoogleSignup.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.data.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.tempToken = null;
      state.isNewUser = false;
    })
    
    // Apple ile giriş/kayıt
    .addCase(loginWithApple.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.isNewUser) {
        state.tempToken = action.payload.tempToken;
        state.profilePicture = action.payload.profilePicture;
        state.isNewUser = true;
      } else {
        state.user = action.payload.data.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isNewUser = false;
      }
    })
    .addCase(completeAppleSignup.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.data.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.tempToken = null;
      state.isNewUser = false;
    })

    // Şifremi unuttum işlemleri
    .addCase(forgotPassword.pending, (state) => {
      state.forgotPasswordLoading = true;
      state.forgotPasswordError = null;
      state.forgotPasswordSuccess = null;
    })
    .addCase(forgotPassword.fulfilled, (state, action) => {
      state.forgotPasswordLoading = false;
      state.forgotPasswordSuccess = action.payload.message;
    })
    .addCase(forgotPassword.rejected, (state, action) => {
      state.forgotPasswordLoading = false;
      state.forgotPasswordError = action.payload;
    });
  },
});

export const { logout, setUserProfile, refreshTokens,setProfilePicture,resetForgotPasswordState } = authSlice.actions;
export default authSlice.reducer;
