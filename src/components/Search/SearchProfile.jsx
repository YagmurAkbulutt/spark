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

const SearchProfile = ({ user, closeModal }) => {
  // Redux store'dan takipçi ve takip edilenleri al
  const followers = useSelector((state) => state.follow.followers);
  const following = useSelector((state) => state.follow.following);
  
  // Kullanıcının takip edilip edilmediğini kontrol et
  const isFollowingUser = useMemo(() => {
    return following.some((follow) => follow._id === user?._id);
  }, [following, user?.id]);

  const dispatch = useDispatch();

  const randomUser = useMemo(() => {
    return users[Math.floor(Math.random() * users.length)];
  }, []);

  // Kullanıcı bilgilerini konsola logla
  useEffect(() => {
    console.log("Aktarılan Kullanıcı Bilgileri:", {
      profilePicture: user?.profilePicture,
      fullName: user?.fullName,
      username: user?.username,
      followersCount: followers.length,
      followingCount: following.length
    });
  }, [user, followers, following]);

  // Takipçi ve takip edilenleri fetch et
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchFollowers(user.id));
      dispatch(fetchFollowing(user.id));
    }
  }, [dispatch, user?.id]);

  // Takip/Takibi bırak işlemi
  const handleFollowToggle = () => {
    if (!user?.id) return;
    
    if (isFollowingUser) {
      dispatch(unfollowUser(user.id));
    } else {
      dispatch(followUser(user.id));
    }
  };

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
      
      {/* ProfileInfo'ya tüm gerekli bilgileri aktar */}
      <ProfileInfo 
        user={{
          profilePicture: user.profilePicture,
          fullName: user.fullName,
          username: user.username,
          followersCount: followers.length,
          followingCount: following.length
        }}
        handleFollowToggle={handleFollowToggle} 
        isFollowingUser={isFollowingUser}
      />
      
      {isFollowingUser ? (
        <SearchProfileDetail />
      ) : (
        <>
          <SearchProfileHidden />
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
  
});