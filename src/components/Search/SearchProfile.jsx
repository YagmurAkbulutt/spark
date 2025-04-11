import { View, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import SvgBack from "../../assets/back"
import SvgMenu from "../../assets/hamburgerMenu"
import ProfileInfo from '../Profile/ProfileInfo';
import SearchProfileHidden from './SearchProfileHidden';
import FollowCard from '../Home/FollowCard';
import { users } from '../../utils/helpers';
import { useEffect, useMemo, useState } from 'react';
import SearchProfileDetail from './SearchProfileDetail';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFollowers, fetchFollowing, followUser, unfollowUser, isUserFollowing } from '../../redux/slices/followSlice';
import store from '../../redux/store';
import { getSafeUserId } from '../../api/api';

const SearchProfile = ({ user, closeModal }) => {
  const dispatch = useDispatch();
  const { followers, following, followStatus, loading } = useSelector((state) => ({
    followers: state.follow.followers,
    following: state.follow.following,
    followStatus: state.follow.status,
    loading: state.follow.loading || state.follow.status === "loading"
  }));
  const currentUser = useSelector(state => state.auth.user); // Giriş yapan kullanıcı
  const [isLoading, setIsLoading] = useState(false);
  const userId = getSafeUserId(user);
  const [optimisticState, setOptimisticState] = useState({
    isFollowing: false,
    followersCount: 0,
    followingCount: 0
  });

  // const userId = getSafeUserId(user);
  const randomUser = useMemo(() => {
    return users[Math.floor(Math.random() * users.length)];
  }, []); 

  // Kullanıcının kendi takip ettiği kullanıcıları yükle
  useEffect(() => {
    if (currentUser?._id || currentUser?.id) {
      const currentUserId = currentUser._id || currentUser.id;
      console.log("Mevcut kullanıcının takip listesini yüklüyorum:", currentUserId);
      dispatch(fetchFollowing(currentUserId));
    } else {
      console.log("Mevcut kullanıcı bilgisi bulunamadı");
    }
  }, [dispatch, currentUser]);

  // Profil sahibinin takipçilerini yükle
  useEffect(() => {
    if (userId) {
      console.log("Profil sahibinin takipçilerini yüklüyorum:", userId);
      // Profil sahibinin takipçilerini getir
      dispatch(fetchFollowers(userId));
    }
  }, [userId, dispatch]);

  // Başlangıç durumunu ve değişiklikleri yöneten useEffect
  useEffect(() => {
    if (!userId || !currentUser) return;

    const currentUserId = currentUser._id || currentUser.id;
    const followingStatus = isUserFollowing(following, userId);
    
    console.log('Takip durumu kontrolü:', { 
      profileId: userId, 
      currentUserId,
      isFollowing: followingStatus
    });

    // Optimistik state'i güncelle
    setOptimisticState(prev => {
      // Eğer değişiklik varsa güncelle
      if (prev.isFollowing !== followingStatus || 
          prev.followersCount !== followers.length) {
        return {
          isFollowing: followingStatus,
          followersCount: followers.length,
          followingCount: following.length
        };
      }
      return prev;
    });

  }, [userId, following, followers, currentUser]);

  const handleFollowToggle = async () => {
    if (!userId || !currentUser || isLoading || loading) return;
    const currentUserId = currentUser._id || currentUser.id;
    
    setIsLoading(true);
    const wasFollowing = optimisticState.isFollowing;

    try {
      if (wasFollowing) {
        const result = await dispatch(unfollowUser(userId)).unwrap();
        console.log("Takibi bırakma işlemi sonucu:", result);
      } else {
        const result = await dispatch(followUser(userId)).unwrap();
        console.log("Takip etme işlemi sonucu:", result);
      }
      
      // İşlem başarılı olursa güncel takip durumunu yeniden kontrol et
      dispatch(fetchFollowing(currentUserId));
      dispatch(fetchFollowers(userId));
      
    } catch (error) {
      console.error("İşlem başarısız:", error);
      // Kullanıcıya hata mesajı göster
      Alert.alert("Hata", error || "Takip işlemi başarısız oldu");
      
      // Takip listesini yeniden yükle (hata durumunda bile doğru durumu görmek için)
      dispatch(fetchFollowing(currentUserId));
    } finally {
      setIsLoading(false);
    }
  };

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

export default SearchProfile;

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