import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {userCheck, userLogin, userLogout} from '../actions/authActions';
import { getUserInfo } from '../actions/userActions';

// Token yenileme işlemi
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const refreshTokenValue = await AsyncStorage.getItem('refreshToken');
      
      if (!refreshTokenValue) {
        throw new Error('Refresh token bulunamadı');
      }
      
      const response = await api.post('/auth/refresh-token', {
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
      
      // API headers'a token'ı ekle
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
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

// Kullanıcı giriş işlemi
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('[AUTH] Login isteği gönderiliyor:', credentials.identifier);
      const response = await api.post('/auth/login', credentials);
      
      console.log('[AUTH] Login yanıtı:', {
        success: !!response.data?.token,
        hasUser: !!response.data?.user
      });
      
      if (!response.data?.token) {
        return rejectWithValue('Token bilgisi alınamadı');
      }
      
      // Token'ları hemen kaydet
      await AsyncStorage.setItem('token', response.data.token);
      
      if (response.data.refreshToken) {
        await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
      }
      
      // Token'ı API için ayarla
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      return response.data;
    } catch (error) {
      console.error('[AUTH] Login hatası:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || 'Giriş başarısız');
    }
  }
);

// Kayıt Olma - Adım 1 (Email, şifre, ad alma)
export const registerUserStep1 = createAsyncThunk(
  'auth/signupStep1',
  async (userData, {rejectWithValue}) => {
    try {
      console.log('registeruser');
      const response = await api.post('/auth/signup/step1', userData);
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
      const response = await api.post('/auth/signup/step2', formData,   {
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

      const response = await api.post('/auth/google', googleData);

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

      const response = await api.post('/auth/signup/step2', formData, {
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
      const response = await api.post('/auth/apple', appleData);
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
      const response = await api.post('/auth/signup/step2', formData, {
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
      const response = await api.post('/auth/forgot-password', {email});
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
      const response = await api.patch(`/auth/reset-password/${token}`, {
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

// Token'ı kontrol eden ve yeni token load eden işlem
export const checkAndLoadToken = createAsyncThunk(
  'auth/checkAndLoadToken',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      console.log('[AUTH] Kayıtlı token kontrol ediliyor...');
      const token = await AsyncStorage.getItem('token');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      
      if (!token) {
        console.log('[AUTH] Token bulunamadı');
        return { token: null, refreshToken: null, user: null, authLoaded: true };
      }
      
      console.log('[AUTH] Token bulundu, kullanıcı bilgileri alınıyor...');
      // Token varsa kullanıcı bilgilerini al
      try {
        // Axios instance'ına token'ı hemen ekle ki API çağrısı yetkilendirme ile gitsin
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const userResponse = await api.get('auth/me');
        const user = userResponse.data?.data?.user;
        
        if (!user) {
          console.error('[AUTH] Token var ama kullanıcı bilgisi alınamadı.');
          // Token geçersiz olabilir, temizleyelim
          await AsyncStorage.multiRemove(['token', 'refreshToken']);
          delete api.defaults.headers.common['Authorization'];
          return rejectWithValue('Kullanıcı bilgisi alınamadı, token geçersiz olabilir.');
        }
        
        console.log('[AUTH] Kullanıcı bilgisi başarıyla alındı:', user.id || user._id);
        // Token, refreshToken ve user bilgisini birlikte döndür
        return {
          token,
          refreshToken,
          user, // Alınan kullanıcı bilgisini ekle
          authLoaded: true
        };
        
      } catch (userError) {
        console.error('[AUTH] Kullanıcı bilgisi alınırken API hatası:', userError.response?.data || userError.message);
        // Kullanıcı bilgisi alınamazsa yine token geçersiz olabilir
        await AsyncStorage.multiRemove(['token', 'refreshToken']);
        delete api.defaults.headers.common['Authorization'];
        return rejectWithValue('Kullanıcı bilgisi alınamadı: ' + (userError.response?.data?.message || userError.message));
      }
      
    } catch (error) {
      console.error('[AUTH] Genel token kontrol hatası:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  status: 'idle',
  isLogin: false,
  user: null,
  userInfo: null,
  token: null,
  refreshToken: null,
  error: null,
  success: false,
  loading: false,
  authLoaded: false, // Kimlik doğrulama bilgilerinin yüklendiğini belirtmek için yeni alan
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
    logout: (state) => {
      console.log('[AUTH SLICE] Logout action dispatched');
      AsyncStorage.multiRemove(['token', 'refreshToken']);
      delete api.defaults.headers.common['Authorization'];
      
      // Reset state properties directly using Immer's draft state
      state.user = null;
      state.userInfo = null;
      state.token = null;
      state.refreshToken = null;
      state.isLogin = false;
      state.isLoading = false;
      state.error = null;
      state.success = false;
      state.authLoaded = true; // Indicate that auth state has been processed (even if logged out)
      state.isNewUser = false;
      state.tempToken = null;
      state.username = '';
      state.userPhoto = null;
      state.isGoogleLogin = false;
      state.message = '';
      state.forgotPasswordLoading = false;
      state.forgotPasswordError = null;
      state.forgotPasswordSuccess = null;
      state.resetPasswordLoading = false;
      state.resetPasswordError = null;
      state.resetPasswordSuccess = null;
      state.bio = '';
      state.profilePicture = null;
      state.fullName = '';
      state.identifier = '';
      state.password = '';
      state.status = 'idle';

      console.log('[AUTH SLICE] State after logout:', { token: state.token ? 'Var' : 'Yok', isLogin: state.isLogin });
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
    // Yeni loginUser case'leri
    .addCase(loginUser.pending, state => {
      console.log('[AUTH REDUCER] loginUser PENDING'); // Log pending
      state.status = 'loading';
      state.isLoading = true;
      state.error = null;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      console.log('[AUTH REDUCER] loginUser FULFILLED - Payload:', action.payload); // Log fulfilled payload
      state.status = 'succeeded';
      state.isLoading = false;
      state.isLogin = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      console.log('[AUTH REDUCER] loginUser FULFILLED - New State:', { token: state.token ? 'Var' : 'Yok', user: state.user ? 'Var' : 'Yok', isLogin: state.isLogin }); // Log new state
      
      // Ensure API header is set after login too
      if (state.token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
          console.log('[AUTH REDUCER] loginUser FULFILLED - API header set.');
      } else {
          console.warn('[AUTH REDUCER] loginUser FULFILLED - Token missing in payload!');
      }
      
      console.log('[AUTH] Login başarılı, token ve user store\'a kaydedildi');
    })
    .addCase(loginUser.rejected, (state, action) => {
      console.error('[AUTH REDUCER] loginUser REJECTED - Error:', action.payload || 'Giriş başarısız'); // Log rejection
      state.status = 'failed';
      state.isLoading = false;
      state.error = action.payload || 'Giriş başarısız';
      state.isLogin = false;
      state.token = null; // Clear token on failed login
      state.user = null;  // Clear user on failed login
      console.log('[AUTH REDUCER] loginUser REJECTED - State Cleared'); // Log state cleared
      
      console.error('[AUTH] Login hatası:', state.error);
    })
    
    // Mevcut userLogin case'leri
    .addCase(userLogin.pending, state => {
      state.status = 'loading';
      state.isLoading = true;
      state.error = null;
    })
    .addCase(userLogin.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isLogin = true;
      state.isLoading = false;
      
      // Token'ı API uç noktalarında kullanılabilmesi için güncel tut
      if (action.payload.token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
        console.log('[AUTH] Login başarılı - Token API headers\'a eklendi');
      }
    })
    .addCase(userLogin.rejected, (state, action) => {
      state.status = 'failed';
      state.isLoading = false;
      state.error = action.payload;
      state.isLogin = false;
      
      console.error('[AUTH] Login hatası:', state.error);
    })
    
    // userCheck cases
    .addCase(userCheck.pending, state => {
      state.isLoading = true;
    })
    .addCase(userCheck.fulfilled, (state, action) => {
      if (action.payload) {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isLogin = true;
      } else {
        state.isLogin = false;
      }
      state.isLoading = false;
    })
    .addCase(userCheck.rejected, (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isLogin = false;
    })

      .addCase(userLogout.fulfilled, (state) => {
        state.token = null;
        state.isLogin= false
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
      })

      // Token'ı kontrol eden ve yeni token load eden işlem
      .addCase(checkAndLoadToken.pending, (state) => {
        console.log('[AUTH REDUCER] checkAndLoadToken PENDING'); // Log pending
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(checkAndLoadToken.fulfilled, (state, action) => {
        console.log('[AUTH REDUCER] checkAndLoadToken FULFILLED - Payload:', action.payload); // Log fulfilled payload
        state.status = 'succeeded';
        state.loading = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user; // Kullanıcı bilgisini state'e kaydet
        state.authLoaded = action.payload.authLoaded;
        state.isLogin = !!action.payload.token; // Login durumu token varlığına göre belirlenir
        console.log('[AUTH REDUCER] checkAndLoadToken FULFILLED - New State:', { token: state.token ? 'Var' : 'Yok', user: state.user ? 'Var' : 'Yok', isLogin: state.isLogin }); // Log new state
        
        // Eğer token varsa ve API headers'da yoksa ekleyelim (güvenlik için)
        if (state.token && !api.defaults.headers.common['Authorization']) {
          api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
          console.log("[AUTH REDUCER] checkAndLoadToken FULFILLED - API header set.");
        }
      })
      .addCase(checkAndLoadToken.rejected, (state, action) => {
        console.error('[AUTH REDUCER] checkAndLoadToken REJECTED - Error:', action.payload || action.error.message); // Log rejection
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
        state.authLoaded = true;
        state.token = null; // Hata durumunda token'ı temizle
        state.refreshToken = null;
        state.user = null;
        state.isLogin = false;
        console.log('[AUTH REDUCER] checkAndLoadToken REJECTED - State Cleared'); // Log state cleared
      })

      // getUserInfo başarıyla tamamlandığında state.user'ı güncelle
      .addCase(getUserInfo.fulfilled, (state, action) => {
        console.log("[AUTH REDUCER] getUserInfo FULFILLED - Payload:", action.payload);
        const userData = action.payload;

        // Mevcut token'ı koru!
        const currentToken = state.token; 
        console.log("[AUTH REDUCER] getUserInfo FULFILLED - Güncelleme öncesi token:", currentToken ? 'Var' : 'Yok');

        if (userData) {
          // state.user objesi yoksa veya null ise, önce initialize et (en azından ID ile)
          if (!state.user) {
             state.user = { id: userData.id || userData._id }; 
          }
          
          // Gerekli alanları payload'dan state.user'a TEK TEK ata
          state.user._id = userData._id ?? state.user._id;
          state.user.username = userData.username ?? state.user.username;
          state.user.email = userData.email ?? state.user.email;
          state.user.profilePicture = userData.profilePicture ?? state.user.profilePicture;
          state.user.bio = userData.bio ?? state.user.bio;
          state.user.followers = userData.followers ?? state.user.followers;
          state.user.following = userData.following ?? state.user.following;
          state.user.posts = userData.posts ?? state.user.posts;
          state.user.savedPosts = userData.savedPosts ?? state.user.savedPosts;
          state.user.likedPosts = userData.likedPosts ?? state.user.likedPosts;
          state.user.isPrivate = userData.isPrivate ?? state.user.isPrivate;
          state.user.role = userData.role ?? state.user.role;
          state.user.createdAt = userData.createdAt ?? state.user.createdAt;
          state.user.updatedAt = userData.updatedAt ?? state.user.updatedAt;
          state.user.devices = userData.devices ?? state.user.devices;
          state.user.lastLogin = userData.lastLogin ?? state.user.lastLogin;
          state.user.provider = userData.provider ?? state.user.provider;
          state.user.passwordChangedAt = userData.passwordChangedAt ?? state.user.passwordChangedAt;
          state.user.followerCount = userData.followerCount ?? state.user.followerCount;
          state.user.followingCount = userData.followingCount ?? state.user.followingCount;
          state.user.postCount = userData.postCount ?? state.user.postCount;
          state.user.id = userData.id ?? state.user.id;
          state.user.fullName = userData.fullName ?? state.user.fullName;

          // state.userInfo'yu da benzer şekilde veya daha basitçe güncelle (payload'ı yayarak)
          state.userInfo = { ...state.userInfo, ...userData };

        } else {
          console.warn("[AUTH REDUCER] getUserInfo FULFILLED - Payload boş veya geçersiz!");
        }
        
        // Diğer state alanlarını güncelle
        state.loading = false;
        state.error = null;

        // Token'ın hala yerinde olduğunu kontrol et (ve gerekirse geri yükle - son çare)
        if (state.token !== currentToken) {
            console.warn("[AUTH REDUCER] getUserInfo FULFILLED - Token beklenmedik şekilde değişti! Önceki değere geri alınıyor.");
            state.token = currentToken; // Eğer bir şekilde değiştiyse, eski değeri geri yükle
        }
        
        console.log("[AUTH REDUCER] getUserInfo FULFILLED - State sonrası (token kontrol):", { token: state.token ? 'Var' : 'Yok' });
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        // Kullanıcı bilgisi alınamadıysa hata durumunu işle
        state.loading = false;
        state.error = action.payload || "Kullanıcı bilgileri alınamadı";
      })
      .addCase(getUserInfo.pending, (state) => {
        // Kullanıcı bilgisi alınırken yükleniyor durumunu ayarla
        state.loading = true;
        state.error = null;
      })
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