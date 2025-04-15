import {createAsyncThunk} from '@reduxjs/toolkit';
import {getRequest, patchRequest} from '../../api/verbs';
import {USER_INFO_URL, PROFILE_UPDATE_URL, BASE_URL} from '@env';

// USER_INFO_URL çevre değişkeni boş olabilir, bu yüzden doğrudan string kullanacağız.
const getUserInfo = createAsyncThunk('user/getUserInfo', async (params, { rejectWithValue }) => {
  try {
    // 'auth/me' endpoint'ini doğrudan string olarak kullanıyoruz
    const userInfoUrl = 'auth/me';
    console.log('Kullanıcı bilgileri alınıyor. URL:', userInfoUrl);
    console.log('Çevre değişkeni USER_INFO_URL:', USER_INFO_URL);
    console.log('BASE_URL:', BASE_URL);
    
    const response = await getRequest(userInfoUrl, params);
    console.log("Kullanıcı bilgileri cevabı:", response.data);
    console.log("kullanıcı id", response.data.data.user.id)
    
    if (response.data && response.data.data && response.data.data.user) {
      // API yanıtını kontrol edelim
      const user = response.data.data.user;
      console.log("API'den gelen kullanıcı bilgileri:", user);
      console.log("fullName var mı?", !!user.fullName);
      
      // fullName alan yok ise username'i fullName olarak ekleyelim
      if (!user.fullName && user.username) {
        user.fullName = user.name || user.username;
      }
      
      return user;
    } else {
      console.error("API cevabı beklenen formatta değil:", response.data);
      return rejectWithValue("Kullanıcı bilgileri alınamadı");
    }
  } catch (error) {
    console.error("Kullanıcı bilgileri alınırken hata:", error);
    return rejectWithValue(error.message || "Kullanıcı bilgileri alınamadı");
  }
});

const profileUpdate = createAsyncThunk(
  'user/profileUpdate',
  async (formData, { rejectWithValue }) => {
    try {
      // PROFILE_UPDATE_URL çevre değişkeni doğrudan string olarak kullanılabilir
      const profileUpdateUrl = 'users/profile';
      console.log('Profil güncelleniyor. URL:', profileUpdateUrl);
      const response = await patchRequest(profileUpdateUrl, formData);
      console.log("Profil güncelleme cevabı:", response.data);
      
      if (response.data && response.data.data && response.data.data.user) {
        return response.data.data.user;
      } else {
        console.error("API cevabı beklenen formatta değil:", response.data);
        return rejectWithValue("Profil güncellenemedi");
      }
    } catch (error) {
      console.error("Profil güncellenirken hata:", error);
      return rejectWithValue(error.message || "Profil güncellenemedi");
    }
  }
);

// kullanıcı profili görüntüleme 
export const getUserProfile = createAsyncThunk(
  'user/getUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`users/${userId}`);
      return response.data.data.user; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Profil yüklenemedi');
    }
  }
);

export {
    getUserInfo,
    profileUpdate
}