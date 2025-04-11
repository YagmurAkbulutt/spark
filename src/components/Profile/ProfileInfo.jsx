import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {height, width} from '../../utils/helpers';
import SvgDot from '../../assets/dot';

const ProfileInfo = ({
  user,
  handleFollowToggle,
  isFollowingUser,
  isLoading,
}) => {
  // Takipçi ve takip edilen sayılarını formatlama
  const formatFollow = num => {
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

  return (
    <>
      <View style={styles.container}>
        {/* Profil Resmi */}
        <View style={styles.profileImageContainer}>
          <Image
            source={{uri: user?.profilePicture}}
            style={styles.userImage}
            onError={e =>
              console.log('Resim yüklenemedi:', e.nativeEvent.error)
            }
          />
        </View>

        {/* Kullanıcı Bilgileri */}
        <View style={styles.userInfo}>
          <Text style={styles.username}>
            {user?.username || 'Kullanıcı Adı'}
          </Text>

          {/* Takipçi/Takip Bilgileri */}
          <View style={styles.follow}>
            <Text style={styles.followCountText}>
              {formatFollow(user?.followersCount)} takipçi
            </Text>
            <SvgDot />
            <Text style={styles.followCountText}>
              {formatFollow(user?.followingCount)} takip
            </Text>
          </View>

          {/* Takip Butonu */}
          <View style={styles.followBtn}>
          <TouchableOpacity
  style={[
    styles.followButton,
    isFollowingUser ? styles.unfollowButton : null,
    isLoading ? styles.disabledButton : null,
  ]}
  onPress={() => {
    console.log("Butona tıklandı!");
    handleFollowToggle();
  }}
  disabled={isLoading}
>
              <Text
                style={[
                  isFollowingUser ? styles.unfollowText : styles.followText,
                  isLoading ? styles.loadingText : null,
                ]}>
                {isFollowingUser ? 'Takibi Bırak' : 'Takip'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dotContainer} activeOpacity={0.7}>
              <Text style={styles.dot}>...</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Kullanıcı Bio */}
      <Text style={styles.userBio}>{user?.bio}</Text>
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
    borderRadius: 76,
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
  userBio: {
    marginHorizontal: 20,
    lineHeight: 18,
    fontSize: 14,
    color: '#454545',
    marginTop: 20,
  },
});
//  Debug log'ları
// useEffect(() => {
//   console.log("ProfileInfo - Current follow status:", {
//     optimisticIsFollowing,
//     followersCount,
//     followingCount: following.length
//   });
// }, [optimisticIsFollowing,  following]);
