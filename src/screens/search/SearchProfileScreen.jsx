import { View, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
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
const SearchProfileScreen = ({ user, closeModal }) => {
    const dispatch = useDispatch();
    const { isLogin } = useSelector(state => state.auth);
    const followers = useSelector(state => state.follow.followers);
    const following = useSelector(state => state.follow.following);
    const followStatus = useSelector(state => state.follow.status);
    const loading = useSelector(state => state.follow.loading);
    const navigation = useNavigation()
    
    const [isLoading, setIsLoading] = useState(false);
    const userId = getSafeUserId(user);
    
    const [optimisticState, setOptimisticState] = useState({
      isFollowing: false,
      followersCount: user?.followersCount || 0,
      followingCount: user?.followingCount || 0,
      profileId: userId,
      userId : getSafeUserId(user)
    //   currentUserId: getSafeUserId(currentUser)
    });
  
    // Debug logları
    console.log("Redux auth state:", { 
      user, 
      isLogin,
      hasUserId: !!getSafeUserId(user)
    });
    console.log("Current follow state:", {
      followersCount: followers.length,
      followingCount: following.length,
      optimisticState
    });
   
    // 1. Giriş durumu kontrolü
    if (isLogin && !user) {
        console.error("Tutarsız durum: isLogin=true ama user=null");
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>Profil görüntülemek için giriş yapmalısınız</Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={styles.buttonText}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      );
    }
  
    // 2. Profil verisi kontrolü
    if (!user || !userId) {
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>Profil bilgileri yüklenemedi</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={closeModal}
          >
            <Text style={styles.buttonText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      );
    }
  
    // Veri yükleme efektleri
    useEffect(() => {
      const currentUserId = getSafeUserId(userId);
      if (!currentUserId) return;
  
      console.log("Fetching following for:", currentUserId);
      dispatch(fetchFollowing(userId));
    }, [dispatch, user]);
  
    useEffect(() => {
      if (!userId) return;
      
      console.log("Fetching followers for:", userId);
      dispatch(fetchFollowers(userId));
    }, [dispatch, userId]);

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
      if (!userId || !following) return;
  
      const followingStatus = isUserFollowing(following, userId);
      const currentUserId = getSafeUserId(user);
  
      setOptimisticState(prev => ({
        isFollowing: followingStatus,
        followersCount: followers.length,
        followingCount: following.length,
        profileId: userId,
        currentUserId
      }));
    }, [userId, following, followers, user]);

  
  
    const handleFollowToggle = async () => {
      const currentUserId = getSafeUserId(user);
      if (!userId || !currentUserId || isLoading) return;
  
      setIsLoading(true);
      const wasFollowing = optimisticState.isFollowing;
  
      try {
        // Optimistik güncelleme
        setOptimisticState(prev => ({
          ...prev,
          isFollowing: !prev.isFollowing,
          followersCount: wasFollowing 
            ? prev.followersCount - 1 
            : prev.followersCount + 1
        }));
  
        // API çağrısı
        const action = wasFollowing ? unfollowUser : followUser;
        await dispatch(action(userId)).unwrap();
  
        // Verileri yenile
        await Promise.all([
          dispatch(fetchFollowing(currentUserId)),
          dispatch(fetchFollowers(userId))
        ]);
  
      } catch (error) {
        // Hata durumunda state'i geri al
        setOptimisticState(prev => ({
          ...prev,
          isFollowing: wasFollowing,
          followersCount: wasFollowing 
            ? prev.followersCount + 1 
            : prev.followersCount - 1
        }));
  
        Alert.alert(
          "Hata",
          error.message || "Takip işlemi başarısız oldu",
          [{ text: "Tamam" }]
        );
      } finally {
        setIsLoading(false);
      }
    };
  
    // Yükleme durumu
    if (loading || isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

  // DEBUG: Konsola takip durumunu yazdır
  useEffect(() => {
    console.log('Current follow status:', {
      isFollowing: optimisticState.isFollowing,
      followersCount: optimisticState.followersCount,
      followingCount: optimisticState.followingCount,
      profileId: userId,
      currentUserId: currentUser?._id || currentUser?.id
    });
  }, [optimisticState, following, userId, currentUser]);

  if (!user) return null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={closeModal}>
          <SvgBack/>
        </TouchableOpacity>
        <TouchableOpacity>
          <SvgMenu/>
        </TouchableOpacity>
      </View>
      
      <ProfileInfo 
        user={{
          ...user,
          id: userId,
          followersCount: optimisticState.followersCount,
          followingCount: optimisticState.followingCount
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
  container: {
    flex: 1,
    backgroundColor:"#FFFFFF",
    marginTop:60,
    marginBottom:20
  },
  header:{
    flexDirection:"row",
    justifyContent:"space-between",
    marginHorizontal:20,
    marginTop:10

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