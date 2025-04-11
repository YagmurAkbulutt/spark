import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {userCheck, userLogin, userLogout} from '../actions/authActions';

// Token yenileme işlemi
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const refreshTokenValue = await AsyncStorage.getItem('refreshToken');
      
      if (!refreshTokenValue) {
        throw new Error('Refresh token bulunamadı');
      }
      
      const response = await api.post('/api/auth/refresh-token', {
        refreshToken: refreshTokenValue,
      });

      if (!response.data?.token) {
        throw new Error('Yeni token alınamadı');
      }
      
      // Yeni token'ları kaydet
      await AsyncStorage.multiSet([
        ['token', response.data.token],
        ['refreshToken', response.data.refreshToken || refreshTokenValue]
      ]);
      
      return {
        token: response.data.token,
        refreshToken: response.data.refreshToken || refreshTokenValue
      };
      
    } catch (error) {
      // Hata durumunda çıkış yap
      await AsyncStorage.multiRemove(['token', 'refreshToken']);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Kayıt Olma - Adım 1 (Email, şifre, ad alma)
export const registerUserStep1 = createAsyncThunk(
  'auth/signupStep1',
  async (userData, {rejectWithValue}) => {
    try {
      console.log('registeruser');
      const response = await api.post('/api/auth/signup/step1', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Bir hata oluştu');
    }
  },
);

// Kayıt Olma - Adım 2 (Username belirleme ve tamamlanma)
export const registerUserStep2 = createAsyncThunk(
  'auth/signupStep2',
  async (formData, {rejectWithValue}) => {
    try {
      const response = await api.post('/api/auth/signup/step2', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
      return response.data;
    } catch (error) {
      console.error('Kayıt işlemi sırasında bir hata oluştu:', error);
      return rejectWithValue(
        error.response?.data || error.message || 'Bir hata oluştu',
      );
    }
  },
);

// Google ile giriş/kayıt (Email, şifre, ad alma)
export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',

  async (googleData, {rejectWithValue}) => {
    // thunk içinde
    console.log('loginWithGoogle thunk tetiklendi!');
    try {
      // Gelen verileri loglayalım, sorunu teşhis etmek için
      console.log('Google login verileri:', googleData);

      const response = await api.post('/api/auth/google', googleData);

      // API yanıtını loglayalım
      console.log('Google login API yanıtı:', response.data);

      const userEmail = response.data?.user?.email;
      console.log('Google login kullanıcı email:', userEmail);

      return response.data;
    } catch (error) {
      console.error(
        'Google login hatası:',
        error.response?.data || error.message,
      );
      return rejectWithValue(error.response?.data || 'Bir hata oluştu');
    }
  },
);

// Google kayıt tamamla - Adım 2 (Username belirleme ve tamamlanma)
export const completeGoogleSignup = createAsyncThunk(
  'auth/completeGoogleSignup',
  async (formData, {rejectWithValue}) => {
    try {
      console.log('completeGoogleSignup isteniyor, veriler:', formData);

      const response = await api.post('/api/auth/signup/step2', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });

      console.log('completeGoogleSignup yanıtı:', response.data);
      return response.data;
    } catch (error) {
      console.error(
        'Google kayıt tamamlama hatası:',
        error.response?.data || error.message,
      );
      return rejectWithValue(error.response?.data || 'Bir hata oluştu');
    }
  },
);

// Apple ile giriş/kayıt
export const loginWithApple = createAsyncThunk(
  'auth/loginWithApple',
  async (appleData, {rejectWithValue}) => {
    try {
      const response = await api.post('/api/auth/apple', appleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Bir hata oluştu');
    }
  },
);

// Apple kayıt tamamla - Adım 2
export const completeAppleSignup = createAsyncThunk(
  'auth/completeAppleSignup',
  async (formData, {rejectWithValue}) => {
    try {
      const response = await api.post('/api/auth/signup/step2', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Bir hata oluştu');
    }
  },
);

// Şifremi unuttum işlemi
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, {rejectWithValue}) => {
    try {
      const response = await api.post('/api/auth/forgot-password', {email});
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response);
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Şifre sıfırlama isteği gönderilirken bir hata oluştu',
      );
    }
  },
);

// Şifre sıfırlama işlemi
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({token, password, confirmPassword}, {rejectWithValue}) => {
    try {
      const response = await api.patch(`/api/auth/reset-password/${token}`, {
        password,
        confirmPassword,
      });
      console.log('API Reset Password Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Şifre sıfırlama hatası:', error.response);
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Şifre sıfırlama sırasında bir hata oluştu',
      );
    }
  },
);
const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  tempToken: null,
  isLoading: false,
  isLogin: false,
  error: null,
  username: '',
  userPhoto: '',
  message: '',
  bio: '',
  profilePicture: null,
  isNewUser: false,
  fullName: '',
  identifier: '',
  password: '',
  forgotPasswordLoading: false,
  forgotPasswordError: null,
  forgotPasswordSuccess: null,
  resetPasswordLoading: false,
  resetPasswordError: null,
  resetPasswordSuccess: null,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.isLogin = false;
      state.userToken = null;
      state.user = null;
      state.refreshToken = null;

      // AsyncStorage'den verileri sil
      AsyncStorage.removeItem('isLoggedIn');
      AsyncStorage.removeItem('userToken');
      AsyncStorage.removeItem('user');
      AsyncStorage.removeItem('refreshToken');
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
    resetForgotPasswordState: state => {
      state.forgotPasswordLoading = false;
      state.forgotPasswordError = null;
      state.forgotPasswordSuccess = null;
    },
    resetPasswordResetState: state => {
      state.resetPasswordLoading = false;
      state.resetPasswordError = null;
      state.resetPasswordSuccess = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(userLogin.pending, state => {
        state.isLoading = true;
      })
      // .addCase(userLogin.fulfilled, (state, action) => {
      //   const { user, token, refreshToken } = action.payload; // API'den gelen veriler
      //   state.user = user; // Kullanıcı bilgilerini kaydet
      //   state.token = token;
      //   state.refreshToken = refreshToken || null;
      //   state.isLoading = false;
      //   state.isLogin = true;
      //   state.error = null; // Hata varsa temizle
      // })
      .addCase(userLogin.fulfilled, (state, action) => {
        if (!action.payload?.user || !action.payload?.token) {
          state.error = 'Incomplete login data';
          state.isLoading = false;
          return;
        }
        // ... rest of your code
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(userCheck.fulfilled, (state, action) => {
        state.isLogin = true;
      })
      .addCase(userCheck.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(userLogout.fulfilled, (state) => {
        state.token = null;
        state.isLogin= false
      })



      // Adım 1: Kayıt başlangıcı
      .addCase(registerUserStep1.pending, state => {
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
        state.error = action.payload || 'Bir hata oluştu';
        console.error('Kayıt işlemi başarısız:', action.payload);
      })

      // Google ile giriş/kayıt
      .addCase(loginWithGoogle.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isGoogleLogin = true;

        console.log(
          'loginWithGoogle.fulfilled action payload:',
          action.payload,
        );

        if (action.payload.isNewUser) {
          // Yeni kullanıcı
          state.tempToken = action.payload.tempToken;
          state.profilePicture =
            action.payload.profilePicture || '/images/default-profile.jpg';
          state.isNewUser = true;
          state.isGoogleLogin = true;

          // Google'dan gelen kullanıcı bilgilerini kaydet
          if (action.payload.data && action.payload.data.userInfo) {
            const {email, givenName, familyName} = action.payload.data.userInfo;
            state.fullName =
              action.payload.data.userInfo.name ||
              `${givenName || ''} ${familyName || ''}`.trim();
            state.identifier = email;
          }
        } else {
          // Mevcut kullanıcı
          if (action.payload.data && action.payload.data.user) {
            state.user = action.payload.data.user;
            state.username = action.payload.data.user.username || '';
            state.userPhoto =
              action.payload.data.user.profilePicture ||
              '/images/default-profile.jpg';
            state.bio = action.payload.data.user.bio || '';
            state.fullName = action.payload.data.user.fullName || '';
          }
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
          state.isNewUser = false;
        }
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.error('Google login hatası:', action.payload);
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
      .addCase(forgotPassword.pending, state => {
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
      })

      // Şifre sıfırlama işlemleri
      .addCase(resetPassword.pending, state => {
        state.resetPasswordLoading = true;
        state.resetPasswordError = null;
        state.resetPasswordSuccess = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.resetPasswordLoading = false;
        state.resetPasswordSuccess =
          action.payload.message || 'Şifreniz başarıyla sıfırlandı';
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        if (action.payload.data && action.payload.data.user) {
          state.user = action.payload.data.user;
        }
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPasswordLoading = false;
        state.resetPasswordError = action.payload;
      })

      // Google kayıt tamamla - Adım 2 (Username belirleme ve tamamlanma)
      .addCase(completeGoogleSignup.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeGoogleSignup.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload.data && action.payload.data.user) {
          state.user = action.payload.data.user;
          state.username = action.payload.data.user.username || '';
          state.userPhoto =
            action.payload.data.user.profilePicture ||
            '/images/default-profile.jpg';
          state.bio = action.payload.data.user.bio || '';
          state.fullName = action.payload.data.user.fullName || '';
        }

        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.tempToken = null;
        state.isNewUser = false;
      })
      .addCase(completeGoogleSignup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.error('Google kayıt tamamlama hatası:', action.payload);
      });
  },
});

export const {
  logout,
  setUserProfile,
  refreshTokens,
  setProfilePicture,
  resetForgotPasswordState,
  resetPasswordResetState,
} = authSlice.actions;
export default authSlice.reducer;
