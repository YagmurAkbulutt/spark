import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {height, width} from '../../utils/helpers';
import SvgDot from '../../assets/dot';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFollowers, fetchFollowing, followUser, unfollowUser } from '../../redux/slices/followSlice';
import { useEffect, useState } from 'react';
import { getSafeUserId } from '../../api/api';

const ProfileInfo = ({ user,  isFollowingUser }) => {
  const dispatch = useDispatch();
  const followers = useSelector((state) => state.follow.followers);
  const following = useSelector((state) => state.follow.following);
  const [isFollowing, setIsFollowing] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const userId = getSafeUserId(user); // user.id || user._id şeklinde
  
// Kullanıcının takip edilip edilmediğini kontrol et
useEffect(() => {
  if (userId && following) {
    const followingStatus = following.some(follow => follow.id === userId);
    setIsFollowing(followingStatus);
  }
}, [userId, following]);

// Takipçi ve takip edilen verilerini yükle
useEffect(() => {
  if (userId) {
    dispatch(fetchFollowers(userId));
    dispatch(fetchFollowing(userId));
  }
}, [userId, dispatch]);

// Takipçi ve takip edilen sayılarını formatlama
const formatFollow = (num) => {
  if (num === undefined || num === null) return '0';
  if (num >= 1_000_000) {
    const formatted = (num / 1_000_000).toFixed(1).replace('.', ',');
    return formatted.endsWith(',0') 
      ? formatted.slice(0, -2) + ' M' 
      : formatted + ' M';
  } else if (num >= 1_000) {
    const formatted = (num / 1_000).toFixed(1).replace('.', ',');
    return formatted.endsWith(',0') 
      ? formatted.slice(0, -2) + ' B' 
      : formatted + ' B';
  }
  return num.toString();
};


useEffect(() => {
  console.log("Kullanıcı Bilgileri:", {
    profilePicture: user?.profilePicture,
    fullName: user?.fullName,
    username: user?.username,
    bio: user?.bio,
    followersCount: followers.length,
    followingCount: following.length,
    userId 
  });
}, [user, followers, following, userId]);

const [localFollowing, setLocalFollowing] = useState(false);
const [localFollowersCount, setLocalFollowersCount] = useState(user?.followersCount || 0);

// Takip durumunu senkronize et
useEffect(() => {
  if (userId && following) {
    const isFollowing = following.some(f => f.id === userId);
    setLocalFollowing(isFollowing);
  }
}, [following, userId]);

const handleFollowToggle = async () => {
  if (!userId) {
    console.error("Takip işlemi için geçerli kullanıcı ID'si yok");
    return;
  }

  try {
    if (localFollowing) {
      await dispatch(unfollowUser(userId)).unwrap();
      setLocalFollowersCount(prev => prev - 1);
    } else {
      await dispatch(followUser(userId)).unwrap();
      setLocalFollowersCount(prev => prev + 1);
    }
    setLocalFollowing(!localFollowing);
    
    dispatch(fetchFollowing(userId));
  } catch (err) {
    console.error("Takip işlemi hatası:", err);
  }
};

  return (
    <>
      <View style={styles.container}>
        {/* Profil Resmi */}
        <View style={styles.profileImageContainer}>
          <Image 
            source={{ uri: user?.profilePicture }} 
            style={styles.userImage}
            onError={(e) => console.log("Resim yüklenemedi:", e.nativeEvent.error)}
          />
        </View>

        {/* Kullanıcı Bilgileri */}
        <View style={styles.userInfo}>
          <Text style={styles.username}>{user?.username || 'Fullname'}</Text>
          
          {/* Takipçi/Takip Bilgileri */}
          <View style={styles.follow}>
            <Text style={styles.followCountText}>
              {formatFollow(followers.length)} takipçi
            </Text>
            <SvgDot />
            <Text style={styles.followCountText}>
              {
              formatFollow(following.length)
              } takip
            </Text>
          </View>

          {/* Takip Butonu */}
          <View style={styles.followBtn}>
            <TouchableOpacity
              style={[
                styles.followButton,
                isFollowing ? styles.unfollowButton : null,
              ]}
              onPress={handleFollowToggle}
            >
              <Text style={isFollowing ? styles.unfollowText : styles.followText}>
                {localFollowing ? "Takibi Bırak" : "Takip"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dotContainer} activeOpacity={0.7}>
              <Text style={styles.dot}>...</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Kullanıcı Bio */}
      <Text style={styles.userBio}>
{user?.bio || "Bio"}      
</Text>
    </>
  );
};

export default ProfileInfo;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  userImage: {
    width: width * 0.26,
    height: width * 0.26,
    borderRadius:76
  },
  userInfo: {
    marginLeft: 20,
    gap: 8,
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
  },
  follow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  followCountText: {
    fontSize: 14,
    color: '#9D9C9C',
    fontWeight: '500',
  },
  followBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  followButton: {
    borderRadius: 5,
    backgroundColor: '#000',
    width: width * 0.45,
    height: height * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  followText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: height * 0.04,
  },
  unfollowButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000',
  },
  unfollowText: {
    color: '#000',
    fontWeight: '500',
    fontSize: 14,
  },
  dotContainer: {
    borderWidth: 1,
    borderColor: ' #000000',
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  dot: {
    fontSize: 14,
    fontWeight: '600',
    alignSelf: 'center',
  },
  userBio:{
    marginHorizontal:20,
    lineHeight:18,
    fontSize:14,
    color:"#454545",
    marginTop:20
  }
});
