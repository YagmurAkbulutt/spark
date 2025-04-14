import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {height, width} from '../../utils/helpers';
import SvgDot from '../../assets/dot';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import store from '../../redux/store';

const ProfileInfo = ({
  user,
  handleFollowToggle,
  isFollowingUser,
  isLoading,
}) => {
  console.log("profileinfo user", user);
  
  // Şu anki kullanıcıyı al
  const currentUser = useSelector(state => state.auth.user);
  
  useEffect(() => {
    // Kullanıcı bilgilerini ve ID karşılaştırmasını logla
    console.log("ProfileInfo - Kullanıcı Bilgileri:", {
      profileUserId: user?.id,
      profileUsername: user?.username,
      isFollowingUser: isFollowingUser,
      currentUserId: currentUser?.id || currentUser?._id
    });
  }, [user, currentUser, isFollowingUser]);
  
  // Kendi profili mi kontrolü
  const isSelfProfile = (currentUser?.id || currentUser?._id) === user?.id;

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
            source={{uri: user.profilePicture}}
            style={styles.userImage}
            onError={e =>
              console.log('Resim yüklenemedi:', e.nativeEvent.error)
            }
          />
        </View>

        {/* Kullanıcı Bilgileri */}
        <View style={styles.userInfo}>
          <Text style={styles.username}>
            {user.username || 'Kullanıcı Adı'}
          </Text>
          
          {/* Tam Ad (fullName) */}
          {user.fullName && (
            <Text style={styles.fullName}>
              {user.fullName}
            </Text>
          )}

          {/* Takipçi/Takip Bilgileri */}
          <View style={styles.follow}>
            <Text style={styles.followCountText}>
              {formatFollow(user.followersCount)} takipçi
            </Text>
            <SvgDot />
            <Text style={styles.followCountText}>
              {formatFollow(user.followingCount)} takip
            </Text>
          </View>

          {/* Takip Butonu - Sadece başka kullanıcılar için göster */}
          {!isSelfProfile ? (
            <View style={styles.followBtn}>
              <TouchableOpacity
                style={[
                  styles.followButton,
                  isFollowingUser ? styles.unfollowButton : null,
                  isLoading ? styles.disabledButton : null,
                ]}
                onPress={() => {
                  console.log("Takip Butonu - Tıklanıldı:", {
                    action: isFollowingUser ? "takipten_çık" : "takip_et",
                    durumGörünümü: isFollowingUser ? "Takibi Bırak" : "Takip",
                    currentUserId: currentUser?.id || currentUser?._id,
                    profileUserId: user?.id
                  });
                  console.log("1. Takip işlemi başlatılıyor");
                  
                  // Mevcut oturum bilgisini kontrol et
                  const userId = currentUser?.id || currentUser?._id;
                  console.log("2. Mevcut kullanıcı ID:", userId);
                  console.log("3. Hedef kullanıcı ID:", user?.id);
                  console.log("4. Yükleme durumu:", isLoading);
                  
                  // Redux auth state'ini logla
                  const authState = store.getState().auth;
                  console.log("5. Redux Auth State:", {
                    isLogin: authState.isLogin,
                    token: authState.token ? "Var" : "Yok",
                    user: authState.user ? "Var" : "Yok"
                  });
                  
                  console.log("6. Erken çıkış - eksik ID'ler veya zaten yükleniyor", {
                    isLoading,
                    targetUserId: user?.id, 
                    userId
                  });
                  
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
          ) : (
            <View style={styles.followBtn}>
              <TouchableOpacity
                style={[styles.editProfileButton]}
                onPress={() => console.log("Profil düzenle butonuna tıklandı")}
              >
                <Text style={styles.editProfileText}>Profili Düzenle</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.dotContainer} activeOpacity={0.7}>
                <Text style={styles.dot}>...</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Kullanıcı Bio */}
      <Text style={styles.userBio}>{user.bio}</Text>
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
  fullName: {
    fontSize: 16,
    color: '#444444',
    fontWeight: '500',
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
  editProfileButton: {
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000',
    width: width * 0.45,
    height: height * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  editProfileText: {
    color: '#000',
    fontWeight: '500',
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loadingText: {
    opacity: 0.7,
  },
});
