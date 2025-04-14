import { View, StyleSheet, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import SvgBack from "../../assets/back"
import SvgMenu from "../../assets/hamburgerMenu"
import { users } from '../../utils/helpers';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFollowers, fetchFollowing, followUser, unfollowUser, isUserFollowing } from '../../redux/slices/followSlice';
import store from '../../redux/store';
import { getSafeUserId } from '../../api/api';
import ProfileInfo from '../../components/Profile/ProfileInfo';
import SearchProfileHidden from '../../components/Search/SearchProfileHidden';
import FollowCard from '../../components/Home/FollowCard';
import SearchProfileDetail from '../../components/Search/SearchProfileDetail';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const SearchProfileScreen = ({ route, closeModal }) => {
  const { user } = route.params;
  console.log("SearchProfileScreen - gelen user:", user);
  
  const dispatch = useDispatch();
  const { isLogin, user: currentAuthUser } = useSelector(state => state.auth);
  const followers = useSelector(state => state.follow.followers);
  const following = useSelector(state => state.follow.following);
  const followStatus = useSelector(state => state.follow.status);
  const loading = useSelector(state => state.follow.loading);
  const navigation = useNavigation();
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Component mount olduğunda tam Redux store'u logla
  useEffect(() => {
    const fullState = store.getState();
    console.log("=========== CURRENT REDUX STATE ===========");
    console.log("Auth State:", JSON.stringify(fullState.auth));
    console.log("Follow State:", JSON.stringify(fullState.follow));
    console.log("===========================================");
    
    // AsyncStorage'dan token'ı kontrol et
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      console.log("AsyncStorage Token:", token ? "VAR" : "YOK");
    };
    
    checkToken();
  }, []);
  
  // Hedef kullanıcı ID'si (profil sahibi)
  const targetUserId = getSafeUserId(user);
  
  // Daha güvenilir kullanıcı kimliği elde etme
  const getAuthenticatedUserId = () => {
    // 1. Redux store'dan direkt alma
    const authUser = store.getState().auth.user;
    const userId = authUser?.id || authUser?._id;
    
    if (userId) {
      console.log("User ID Redux'tan alındı:", userId);
      return userId;
    }
    
    // 2. Selector hook'tan alma
    if (currentAuthUser?.id || currentAuthUser?._id) {
      const id = currentAuthUser.id || currentAuthUser._id;
      console.log("User ID Selector'dan alındı:", id);
      return id;
    }
    
    console.error("UYARI: Kimlik doğrulanmış kullanıcı ID'si bulunamadı!");
    return null;
  };
  
  // Mevcut giriş yapmış kullanıcı ID'si
  const currentUserId = getAuthenticatedUserId();
  
  // Bilgileri logla
  useEffect(() => {
    console.log("SearchProfileScreen - Kullanıcı ID Kontrolü:", {
      targetUserId,
      currentUserId,
      isSameUser: currentUserId === targetUserId,
      profileUsername: user?.username,
      currentUsername: currentAuthUser?.username
    });
  }, [targetUserId, currentUserId, user, currentAuthUser]);
  
  const [optimisticState, setOptimisticState] = useState({
    isFollowing: false,
    followersCount: user?.followersCount || 0,
    followingCount: user?.followingCount || 0
  });
  
  // Debug 
  console.log("Redux auth state (should be current logged in user):", {
    currentUser: currentAuthUser ? { id: currentAuthUser.id || currentAuthUser._id, username: currentAuthUser.username } : null,
    isLogin,
    token: store.getState().auth.token ? 'Var' : 'Yok'
  });
  console.log("Current follow state:", {
    followersCount: followers.length,
    followingCount: following.length,
    optimisticState
  });
 
  const randomUser = useMemo(() => {
    return users[Math.floor(Math.random() * users.length)];
  }, []);  

  // Veri yükleme efektleri
  useEffect(() => {
    const currentUserId = getSafeUserId(targetUserId);
    if (!currentUserId) return;

    console.log("Fetching following for:", currentUserId);
    dispatch(fetchFollowing(targetUserId));
  }, [dispatch, user]);

  useEffect(() => {
    if (!targetUserId) return;
    
    console.log("Fetching followers for:", targetUserId);
    dispatch(fetchFollowers(targetUserId));
  }, [dispatch, targetUserId]);

  useEffect(() => {
      const loadData = async () => {
        try {
          if (!user?._id) return;
          
          console.log("Veriler çekiliyor...", { 
            userId: user._id,
            currentTime: new Date().toISOString() 
          });
          
          const [followersRes, followingRes] = await Promise.all([
            dispatch(fetchFollowers(user._id)),
            dispatch(fetchFollowing(user._id))
          ]);
          
          console.log("Çekilen veriler:", {
            followers: followersRes.payload,
            following: followingRes.payload,
            match: followersRes.payload?.length === user.followerCount && 
                   followingRes.payload?.length === user.followingCount
          });
          
        } catch (error) {
          console.error("Veri çekme hatası:", error);
        }
      };
      
      loadData();
    }, [user?._id, dispatch]);

  // Takip durumu güncelleme
  useEffect(() => {
    if (!targetUserId || !following) return;

    // Store'dan güncel kullanıcı bilgilerini al
    const currentAuthUser = store.getState().auth.user;
    const currentUserId = currentAuthUser?.id || currentAuthUser?._id;

    const followingStatus = isUserFollowing(following, targetUserId);

    setOptimisticState(prev => ({
      isFollowing: followingStatus,
      followersCount: followers.length,
      followingCount: following.length,
      profileId: targetUserId,
      currentUserId
    }));
  }, [targetUserId, following, followers]);

  // API test fonksiyonu
  const testAPI = async () => {
    try {
      console.log('[API TEST] Başlatılıyor...');
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        console.error('[API TEST] Token bulunamadı!');
        return;
      }
      
      // API temel URL'i al
      const baseURL = 'http://192.168.0.30:5000'; // .env'den alınan değer
      
      // 1. Kullanıcı bilgilerini al
      try {
        console.log('[API TEST] Kullanıcı bilgileri alınıyor...');
        const userResponse = await axios.get(`${baseURL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('[API TEST] Kullanıcı bilgileri başarıyla alındı:', userResponse.data);
      } catch (userError) {
        console.error('[API TEST] Kullanıcı bilgisi hatası:', userError.message);
      }
      
      // 2. Takip API testleri
      if (targetUserId) {
        try {
          console.log(`[API TEST] Takipçi listesi alınıyor (${targetUserId})...`);
          const followersResponse = await axios.get(`${baseURL}/api/follow/users/${targetUserId}/followers`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('[API TEST] Takipçi listesi başarıyla alındı:', followersResponse.data);
        } catch (followError) {
          console.error('[API TEST] Takipçi listesi hatası:', followError.message);
        }
      }
      
      console.log('[API TEST] Tamamlandı');
    } catch (error) {
      console.error('[API TEST] Genel hata:', error.message);
    }
  };
  
  // Component mount olduğunda API test et
  useEffect(() => {
    testAPI();
  }, []);

  const handleFollowToggle = async () => {
    console.log('1. Takip işlemi başlatılıyor');
    
    // Authenticate olmuş kullanıcıyı kontrol et
    const userId = getAuthenticatedUserId();
    
    console.log('2. Mevcut kullanıcı ID:', userId);
    console.log('3. Hedef kullanıcı ID:', targetUserId);
    console.log('4. Yükleme durumu:', isLoading);
    
    // Redux auth state'i yeniden kontrol et
    const authState = store.getState().auth;
    console.log('5. Redux Auth State:', {
      isLogin: authState.isLogin,
      token: authState.token ? "Var" : "Yok",
      user: authState.user ? `${authState.user.username} (${authState.user.id || authState.user._id})` : "Yok"
    });
  
    // Aynı kullanıcı mı kontrol et
    if (userId === targetUserId) {
      console.error('Kendinizi takip edemezsiniz');
      alert('Kendinizi takip edemezsiniz');
      return;
    }
    
    if (!targetUserId || !userId || isLoading) {
      console.log('6. Erken çıkış - eksik ID\'ler veya zaten yükleniyor', {
        targetUserId,
        userId,
        isLoading
      });
      return;
    }
  
    setIsLoading(true);
    console.log('7. Yükleme durumu: true');
  
    const wasFollowing = optimisticState.isFollowing;
    console.log('8. Önceki takip durumu:', wasFollowing);
  
    try {
      console.log('9. İyimser güncelleme başlatılıyor');
      setOptimisticState(prev => {
        const newState = {
          ...prev,
          isFollowing: !prev.isFollowing,
          followersCount: wasFollowing 
            ? prev.followersCount - 1 
            : prev.followersCount + 1
        };
        console.log('10. Yeni iyimser durum:', newState);
        return newState;
      });
  
      const action = wasFollowing ? unfollowUser : followUser;
      console.log('11. Eylem gönderiliyor:', wasFollowing ? 'takibi_bırak' : 'takip_et');
      
      // Burada doğru hedef kullanıcı ID'sini kullan
      const result = await dispatch(action(targetUserId)).unwrap();
      console.log('12. Eylem başarıyla tamamlandı:', result);
  
      console.log('13. Güncellenmiş takip verilerini çekmeye başlanıyor');
      // Güncel listeleri çek (İşlem sonrası)
      const [followingResult, followersResult] = await Promise.all([
        dispatch(fetchFollowing(currentUserId)),
        dispatch(fetchFollowers(targetUserId))
      ]);
      
      console.log('14. Takip verileri güncellendi:', {
        following: followingResult,
        followers: followersResult
      });
  
    } catch (error) {
      console.log('15. Hata oluştu:', error);
      
      console.log('16. İyimser durum geri alınıyor');
      setOptimisticState(prev => {
        const revertedState = {
          ...prev,
          isFollowing: wasFollowing,
          followersCount: wasFollowing 
            ? prev.followersCount + 1 
            : prev.followersCount - 1
        };
        console.log('17. Geri alınan durum:', revertedState);
        return revertedState;
      });
      
      alert('Takip işlemi sırasında bir hata oluştu');
  
    } finally {
      console.log('18. Son temizlik - yükleme durumu: false');
      setIsLoading(false);
      console.log('19. Takip işlemi tamamlandı');
    }
  };

  // Yükleme durumu
  if (loading || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
 

// Konsola takip durumunu yazdır
// useEffect(() => {
//   console.log('Current follow status:', {
//     isFollowing: optimisticState.isFollowing,
//     followersCount: optimisticState.followersCount,
//     followingCount: optimisticState.followingCount,
//     profileId: userId,
//     currentUserId: currentUser?._id || currentUser?.id
//   });
// }, [optimisticState, following, userId, currentUserId]);

if (!user) return null;

return (
  <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
    <View style={styles.header}>
      <TouchableOpacity onPress={navigation.goBack}>
        <SvgBack/>
      </TouchableOpacity>
      <TouchableOpacity>
        <SvgMenu/>
      </TouchableOpacity>
    </View>
    
    <ProfileInfo 
      user={{
        ...(user || {}), 
        id: targetUserId, 
        followersCount: optimisticState.followersCount,
        followingCount: optimisticState.followingCount,
        fullName: user?.fullName || user?.name || '',
      }}
      handleFollowToggle={handleFollowToggle}
      isFollowingUser={optimisticState.isFollowing}
      isLoading={isLoading || loading}
    />
    
    {optimisticState.isFollowing ? (
      <SearchProfileDetail user={user} />
    ) : (
      <>
        <SearchProfileHidden user={user} />
        <FollowCard randomUser={randomUser} />
      </>
    )}
  </ScrollView>
);
};

export default SearchProfileScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex:1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor:"#FFFFFF",
  },
  header:{
    flexDirection:"row",
    justifyContent:"space-between",
    marginHorizontal:20,
    marginTop:60

  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userHandle: {
    fontSize: 18,
    color: 'gray',
  },
})



// const SearchProfileScreen = ({ user, closeModal }) => {
//   const dispatch = useDispatch();
//   const { user: currentUser, isLogin } = useSelector(state => state.auth);
//   const followers = useSelector(state => state.follow.followers);
//   const following = useSelector(state => state.follow.following);
//   const followStatus = useSelector(state => state.follow.status);
//   const loading = useSelector(state => state.follow.loading || state.follow.status === "loading");
// //   const currentUser = useSelector(state => state.auth.user); // Giriş yapan kullanıcı
//   const [isLoading, setIsLoading] = useState(false);
//   const userId = getSafeUserId(user);
//   const [optimisticState, setOptimisticState] = useState({
//     isFollowing: false,
//     followersCount: 0,
//     followingCount: 0
//   });
// // Auth state'inizi kontrol edin
// console.log("Redux auth state:", useSelector(state => state.auth));
//   // const userId = getSafeUserId(user);
//   const randomUser = useMemo(() => {
//     return users[Math.floor(Math.random() * users.length)];
//   }, []); 

//   // Kullanıcının kendi takip ettiği kullanıcıları yükle
//   useEffect(() => {
//     if (currentUser?._id || currentUser?.id) {
//       const currentUserId = currentUser._id || currentUser.id;
//       console.log("Mevcut kullanıcının takip listesini yüklüyorum:", currentUserId);
//       dispatch(fetchFollowing(currentUserId));
//     } else {
//       console.log("Mevcut kullanıcı bilgisi bulunamadı");
//     }
//   }, [dispatch, currentUser]);

//   // Profil sahibinin takipçilerini yükle
//   useEffect(() => {
//     if (userId) {
//       console.log("Profil sahibinin takipçilerini yüklüyorum:", userId);
//       // Profil sahibinin takipçilerini getir
//       dispatch(fetchFollowers(userId));
//     }
//   }, [userId, dispatch]);

//   // Başlangıç durumunu ve değişiklikleri yöneten useEffect
//   useEffect(() => {
//     if (!userId || !currentUser) return;

//     const currentUserId = currentUser._id || currentUser.id;
//     const followingStatus = isUserFollowing(following, userId);
    
//     console.log('Takip durumu kontrolü:', { 
//       profileId: userId, 
//       currentUserId,
//       isFollowing: followingStatus
//     });

//     // Optimistik state'i güncelle
//     setOptimisticState(prev => {
//       // Eğer değişiklik varsa güncelle
//       if (prev.isFollowing !== followingStatus || 
//           prev.followersCount !== followers.length) {
//         return {
//           isFollowing: followingStatus,
//           followersCount: followers.length,
//           followingCount: following.length
//         };
//       }
//       return prev;
//     });

//   }, [userId, following, followers, currentUser]);

//   const handleFollowToggle = async () => {
//     if (!userId || !currentUser || isLoading || loading) return;
//     const currentUserId = currentUser._id || currentUser.id;
    
//     setIsLoading(true);
//     const wasFollowing = optimisticState.isFollowing;

//     try {
//       if (wasFollowing) {
//         const result = await dispatch(unfollowUser(userId)).unwrap();
//         console.log("Takibi bırakma işlemi sonucu:", result);
//       } else {
//         const result = await dispatch(followUser(userId)).unwrap();
//         console.log("Takip etme işlemi sonucu:", result);
//       }
      
//       // İşlem başarılı olursa güncel takip durumunu yeniden kontrol et
//       dispatch(fetchFollowing(currentUserId));
//       dispatch(fetchFollowers(userId));
      
//     } catch (error) {
//       console.error("İşlem başarısız:", error);
//       // Kullanıcıya hata mesajı göster
//       Alert.alert("Hata", error || "Takip işlemi başarısız oldu");
      
//       // Takip listesini yeniden yükle (hata durumunda bile doğru durumu görmek için)
//       dispatch(fetchFollowing(currentUserId));
//     } finally {
//       setIsLoading(false);
//     }
//   };