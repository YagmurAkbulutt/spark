import {Image, StyleSheet, Text, View} from 'react-native';
import {height, width} from '../../utils/helpers';

const UserInfo = ({userInfo}) => {
  return (
    <View style={styles.userInfoContainer}>
      <Image source={userInfo?.userImage} style={styles.userImage} />
      <View style={styles.info}>
        <Text style={styles.name}>{userInfo?.name}</Text>
        <Text style={styles.username}>@{userInfo?.username}</Text>
        <View style={styles.status}>
          <Text style={styles.stat}>{userInfo?.followers} takipçi</Text>
          <View style={styles.dot} />
          <Text style={styles.stat}>{userInfo?.post} gönderi</Text>
        </View>
      </View>
    </View>
  );
};

export default UserInfo;

const styles = StyleSheet.create({
  userInfoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 25,
  },
  userImage: {
    width: width * 0.25,
    height: height * 0.12,
    borderRadius: 55,
  },
  info:{
    alignItems:"center"
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  username: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9D9C9C',
    marginTop: 5,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:5
  },
  dot: {
    width: 3,
    height: 3,
    backgroundColor: '#D134AA',
  },
  stat:{
    fontSize:14,
    fontWeight:"500",
    color:"#9D9C9C"
  }
});
