import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {height, width} from '../../utils/helpers';
import SvgDot from '../../assets/dot';

const ProfileInfo = ({user,toggleFollow, isFollowing}) => {

  const formatFollow = num => {
    if (num === 0) return '';
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
    } else {
      return num.toString();
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View>
          <Image style={styles.userImage} source={user.profilePhoto} />
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.username}>{user.fullName}</Text>
          <View style={styles.follow}>
            <Text style={styles.followCountText}>
              {formatFollow(user.followers)} takipçi
            </Text>
            <SvgDot />
            <Text style={styles.followCountText}>
              {formatFollow(user.following)} takip
            </Text>
          </View>

          <View style={styles.followBtn}>
            <TouchableOpacity
              style={[
                styles.followButton,
                isFollowing ? styles.unfollowButton : styles.followButton,
              ]}
              onPress={toggleFollow}>
              <Text style={isFollowing ? styles.unfollowText : styles.followText}>
                {isFollowing ? 'Takibi Bırak' : 'Takip'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dotContainer} activeOpacity={0.7}>
              <Text style={styles.dot}>...</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Text style={styles.userBio}>
        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
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
