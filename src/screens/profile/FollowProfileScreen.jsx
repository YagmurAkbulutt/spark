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


const FollowProfileScreen = ({ route, closeModal }) => {
  const { user } = route.params;
  console.log("follow profile gelen user", user)
    const dispatch = useDispatch();
    const { isLogin } = useSelector(state => state.auth);
    const { userInfo: loggedInUserInfo } = useSelector((state) => state.user); 
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
  
    // Debug 
    console.log("follow profile Redux auth state:", { 
      user, 
      isLogin,
      hasUserId: !!getSafeUserId(user)
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
      // Mevcut giriş yapmış kullanıcı bilgisini al
      const { user: currentUser } = store.getState().auth;
      const currentUserId = currentUser?._id || currentUser?.id;
      
      if (!currentUserId) {
        console.log("Takip listesi yüklenemedi: Giriş yapılmamış");
        return;
      }

      // Profil sahibinin ID'si yerine giriş yapmış kullanıcının takip listesini çek
      console.log("Giriş yapmış kullanıcının takip listesi yükleniyor:", currentUserId);
      dispatch(fetchFollowing(currentUserId))
        .then((result) => {
          if (result.payload) {
            console.log("Takip listesi yüklendi. Eleman sayısı:", result.payload.length);
            
            // Takip durumunu hemen kontrol et
            if (userId) {
              const isFollowing = isUserFollowing(result.payload, userId);
              console.log(`${userId} kullanıcısını takip ediyor mu:`, isFollowing);
              
              setOptimisticState(prev => ({
                ...prev,
                isFollowing: isFollowing
              }));
            }
          }
        })
        .catch(error => {
          console.error("Takip listesi yüklenirken hata:", error);
        });
    }, [dispatch, userId]);
  
    useEffect(() => {
      if (!userId) return;
      
      // Profil sahibinin takipçilerini yükle
      console.log("Profil sahibinin takipçileri yükleniyor:", userId);
      dispatch(fetchFollowers(userId));
    }, [dispatch, userId]);
  
    // Takip durumu güncelleme
    useEffect(() => {
      if (!userId || !following || following.length === 0) return;
  
      // Mevcut kullanıcının takip listesini ve kullanıcının ID'sini alıyoruz
      const { user: currentUser } = store.getState().auth;
      const currentUserId = currentUser?._id || currentUser?.id;
      
      console.log('Takip durumu kontrol ediliyor:', {
        currentUserId,
        targetUserId: userId,
        following: following.map(f => ({id: f._id || f.id, username: f.username}))
      });
        
      // Takip durumunu kontrol ederken giriş yapmış kullanıcının takip listesini kontrol ediyoruz
      // Bu kullanıcının profilini görüntüleyen kişinin listesini değil
      const followingStatus = isUserFollowing(following, userId);
      console.log(`Takip durumu sonucu: ${followingStatus ? 'Takip ediyor' : 'Takip etmiyor'}`);
  
      setOptimisticState(prev => ({
        ...prev,
        isFollowing: followingStatus,
        followersCount: followers.length || user?.followersCount || 0,
        followingCount: following.length || user?.followingCount || 0,
      }));
    }, [userId, following, followers, user]);

  
    

    const handleFollowToggle = async () => {
      console.log('1. Following toggle başlatılıyor');
      
      // Redux store'dan mevcut giriş yapmış kullanıcı bilgisini al
      const { user: currentUser } = store.getState().auth;
      const currentUserId = currentUser?._id || currentUser?.id;
      
      console.log('2. Giriş yapmış kullanıcı ID:', currentUserId);
      console.log('3. Hedef kullanıcı ID:', userId);
      console.log('4. Yükleme durumu:', isLoading);

      if (!userId || !currentUserId || isLoading) {
        console.log('5. İşlem iptal - ID eksik veya yükleme devam ediyor', {
          userId,
          currentUserId,
          isLoading
        });
        return;
      }

      setIsLoading(true);
      console.log('6. Yükleme durumu true olarak ayarlandı');

      const wasFollowing = optimisticState.isFollowing;
      console.log('7. Önceki takip durumu:', wasFollowing);

      try {
        console.log('8. Optimistik durum güncellemesi başlatılıyor');
        setOptimisticState(prev => {
          const newState = {
            ...prev,
            isFollowing: !prev.isFollowing,
            followersCount: wasFollowing 
              ? prev.followersCount - 1 
              : prev.followersCount + 1
          };
          console.log('9. Yeni optimistik durum:', newState);
          return newState;
        });

        const action = wasFollowing ? unfollowUser : followUser;
        console.log('10. Dispatch ediliyor:', wasFollowing ? 'takipten çık' : 'takip et');
        
        const result = await dispatch(action(userId)).unwrap();
        console.log('11. İşlem başarıyla tamamlandı:', result);

        console.log('12. Güncel takip verilerini getirme başlatılıyor');
        // İşlem sonrası güncel takip listelerini al
        // 1. Giriş yapmış kullanıcının takip ettiği kişiler
        // 2. Hedef kullanıcının takipçileri
        await Promise.all([
          dispatch(fetchFollowing(currentUserId)),
          dispatch(fetchFollowers(userId))
        ]);
        
        console.log('13. Takip verileri güncellendi');

      } catch (error) {
        console.log('14. Hata oluştu:', error);
        
        console.log('15. Optimistik durum geri alınıyor');
        setOptimisticState(prev => {
          const revertedState = {
            ...prev,
            isFollowing: wasFollowing,
            followersCount: wasFollowing 
              ? prev.followersCount + 1 
              : prev.followersCount - 1
          };
          console.log('16. Geri alınan durum:', revertedState);
          return revertedState;
        });

      } finally {
        console.log('17. Son temizlik - yükleme durumu false olarak ayarlanıyor');
        setIsLoading(false);
        console.log('18. Takip işlemi tamamlandı');
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
          id: userId,
          username: user?.username,
          fullName: user?.fullName,
          bio: user?.bio,
          profilePicture: user?.profilePicture,
          followersCount: optimisticState.followersCount,
          followingCount: optimisticState.followingCount
        }}
        handleFollowToggle={handleFollowToggle}
        isFollowingUser={optimisticState.isFollowing}
        isLoading={isLoading || loading}
      />
      
      <SearchProfileDetail user={user} />
    </ScrollView>
  );
};

export default FollowProfileScreen;

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