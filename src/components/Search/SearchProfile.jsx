import { View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
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
import { fetchFollowers, fetchFollowing, followUser, unfollowUser } from '../../redux/slices/followSlice';
import store from '../../redux/store';
import { getSafeUserId } from '../../api/api';

const SearchProfile = ({ user, closeModal }) => {
  const dispatch = useDispatch();
  const { followers, following, followStatus } = useSelector((state) => ({
    followers: state.follow.followers,
    following: state.follow.following,
    followStatus: state.follow.status
  }));
  const [isLoading, setIsLoading] = useState(false);
  const userId = getSafeUserId(user);
  const [optimisticState, setOptimisticState] = useState({
    isFollowing: false,
    followersCount: 0
  });

  // const userId = getSafeUserId(user);
  const randomUser = useMemo(() => {
    return users[Math.floor(Math.random() * users.length)];
  }, []); 

  // Başlangıç durumunu ve değişiklikleri yöneten tek useEffect
  useEffect(() => {
    if (!userId) return;

    // Redux'tan güncel takip durumunu kontrol et
    const isCurrentlyFollowing = following.some(f => 
      f.id === userId || f._id === userId || f.userId === userId
    );

    // Optimistik state'i güncelle (ancak zaten doğru değilse)
    setOptimisticState(prev => {
      if (prev.isFollowing !== isCurrentlyFollowing || 
          prev.followersCount !== followers.length) {
        return {
          isFollowing: isCurrentlyFollowing,
          followersCount: followers.length
        };
      }
      return prev;
    });

  }, [userId, following, followers]);

  const handleFollowToggle = async () => {
    if (!userId || isLoading) return;

    setIsLoading(true);
    const wasFollowing = optimisticState.isFollowing;

    // 1. Anında optimistik güncelleme
    setOptimisticState(prev => ({
      isFollowing: !wasFollowing,
      followersCount: wasFollowing ? prev.followersCount - 1 : prev.followersCount + 1
    }));

    try {
      // 2. API çağrısı yap
      if (wasFollowing) {
        await dispatch(unfollowUser(userId));
      } else {
        await dispatch(followUser(userId));
      }

      // 3. Yeni verileri çek
      await Promise.all([
        dispatch(fetchFollowing(userId)),
        dispatch(fetchFollowers(userId))
      ]);

      // Redux store güncellendiğinde useEffect otomatik olarak state'i senkronize edecek

    } catch (error) {
      console.error("İşlem başarısız:", error);
      // 4. Hata durumunda geri al
      setOptimisticState(prev => ({
        isFollowing: wasFollowing,
        followersCount: wasFollowing ? prev.followersCount + 1 : prev.followersCount - 1
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // DEBUG: Konsola takip durumunu yazdır
  useEffect(() => {
    console.log('Current follow status:', {
      isFollowing: optimisticState.isFollowing,
      followersCount: optimisticState.followersCount,
      actualFollowing: following.map(f => f.id || f._id || f.userId),
      userId
    });
  }, [optimisticState, following, userId]);

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
          followingCount: following.length
        }}
        handleFollowToggle={handleFollowToggle}
        isFollowingUser={optimisticState.isFollowing}
        isLoading={isLoading}
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