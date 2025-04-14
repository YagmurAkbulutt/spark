import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Text,
  Image,
  Modal,
} from 'react-native';
import SvgDown from '../../assets/down';
import SvgMenu from '../../assets/hamburgerMenu';
import SvgDot from '../../assets/dot';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import {height, users, width} from '../../utils/helpers';
import SearchProfileDetail from '../../components/Search/SearchProfileDetail';
import SvgBack from '../../assets/back';
import {launchImageLibrary} from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import ProfileEdit from '../../components/Profile/ProfileEdit';
import { userLogout } from '../../redux/actions/authActions';
import { getUserInfo, profileUpdate } from '../../redux/actions/userActions';


const ProfileScreen = ({ closeModal }) => {
  // Ayrı modal state'leri
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [followListModalVisible, setFollowListModalVisible] = useState(false);
  
  const [imageUri, setImageUri] = useState(null);
  const { userInfo } = useSelector((state) => state.user);
  
  // TextInput'lar için yerel state'ler
  const [fullName, setFullName] = useState(userInfo.fullName || '');
  const [username, setUsername] = useState(userInfo.username || '');
  const [bio, setBio] = useState(userInfo.bio || '');
  const [selectedImage, setSelectedImage] = useState(null);

  const [activeTab, setActiveTab] = useState('followers'); // 'followers' veya 'following'
  const [isMenuVisible, setIsMenuVisible] = useState(false); 
  const navigation = useNavigation();
  const dispatch = useDispatch();

   // Veriyi çeken fonksiyon
   const fetchData = useCallback(() => {
    dispatch(getUserInfo()) // Parametresiz çağırıyoruz (auth/me endpoint'i kullanıcı token'ını otomatik alır)
      .unwrap()
      .catch((err) => console.error("Hata:", err));
  }, [dispatch]);

  // Ekran her açıldığında veriyi çek
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Focus olduğunda yenile
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation, fetchData]);

   // Galeriden fotoğraf seçme işlemi
   const selectImage = async () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) return;
      if (response.errorMessage) {
        alert('Fotoğraf seçme hatası: ' + response.errorMessage);
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri); 
      }
    });
  };

 // Takipçi listesini aç
const openFollowers = () => {
  navigation.navigate('FollowList', { 
    activeTab: 'followers',
    userId: userInfo.id 
  });
};

// Takip edilenleri aç
const openFollowing = () => {
  navigation.navigate('FollowList', { 
    activeTab: 'following',
    userId: userInfo.id 
  });
};

  // Profil güncelleme fonksiyonu
  const handleSave = async () => {
    try {
      const formData = new FormData();
      
      if (fullName) formData.append('fullName', fullName);
      if (username) formData.append('username', username);
      if (bio) formData.append('bio', bio);
      if (selectedImage) {
        formData.append('profilePicture', {
          uri: selectedImage.uri,
          type: selectedImage.type || 'image/jpeg',
          name: selectedImage.fileName || 'profile.jpg',
        });
      }

      await dispatch(profileUpdate(formData)).unwrap();
      setEditProfileModalVisible(false);
    } catch (error) {
      console.error('Güncelleme hatası:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(userLogout()).unwrap();
      navigation.navigate('Entry');
    } catch (error) {
      console.error('Çıkış hatası:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.Scrollcontainer}
        showsVerticalScrollIndicator={false}>
        {/* Header kısmı */}
        <View style={styles.header}>
          <TouchableOpacity onPress={closeModal} style={styles.headerCont}>
            <Text style={styles.username}>{userInfo.username}</Text>
            <SvgDown />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsMenuVisible(!isMenuVisible)}>
            <SvgMenu />
          </TouchableOpacity>

          {isMenuVisible && (
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Çıkış Yap</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Profil bilgileri */}
        <View style={styles.profileContainer}>
          <View>
            <Image
              style={styles.userImage}
              source={{ uri: userInfo.profilePicture }}
            />
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.username}>{userInfo.fullName}</Text>
            <View style={styles.follow}>
              <TouchableOpacity onPress={openFollowers}>
                <Text style={styles.followCountText}>{userInfo.followerCount} takipçi</Text>
              </TouchableOpacity>
              
              <SvgDot />
              
              <TouchableOpacity onPress={openFollowing}>
                <Text style={styles.followCountText}>{userInfo.followingCount} takip</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.followBtn}>
              <TouchableOpacity
                style={styles.followButton}
                onPress={() => setEditProfileModalVisible(true)}>
                <Text style={styles.unfollowText}>Profili Düzenle</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dotContainer} activeOpacity={0.7}>
                <Text style={styles.dot}>...</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={styles.userBio}>{userInfo.bio}</Text>
        <SearchProfileDetail />
      </ScrollView>

      {/* Profil Düzenleme Modalı */}
      <ProfileEdit
        modalVisible={editProfileModalVisible}
        setModalVisible={setEditProfileModalVisible}
        userInfo={userInfo}
        selectImage={selectImage}
        handleSave={handleSave}
        formData={{
          fullName,
          setFullName,
          username,
          setUsername,
          bio,
          setBio
        }}
      />

      {/* Takipçi/Takip Edilenler Listesi Modalı */}
      {/* <Modal
        animationType="slide"
        transparent={false}
        visible={followListModalVisible}
        onRequestClose={() => setFollowListModalVisible(false)}
        style={{marginTop:100}}
      >
        <FollowList 
          activeTab={activeTab} 
          userId={userInfo.id} 
          onClose={() => setFollowListModalVisible(false)} 
        />
      </Modal> */}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container:{
flex:1,
backgroundColor:"#FFFFFF"
  },
  Scrollcontainer: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 70,
  },
  username: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  headerCont: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileContainer: {
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  userImage: {
    width: width * 0.26,
    height: width * 0.26,
    borderRadius:60
  },
  userInfo: {
    marginLeft: 20,
    gap: 8,
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
    backgroundColor: '#F0F0F0',
    width: width * 0.45,
    height: height * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  unfollowText: {
    color: '#000',
    fontWeight: '500',
    fontSize: 14,
  },
  dotContainer: {
    borderWidth: 1,
    borderColor: '#F0F0F0',
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

  // Modal Stilleri
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginHorizontal: 20,
    marginTop: 20,
  },
  modalheaderCont: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  imageWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  defaultImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ddd',
    borderRadius: 50,
  },
  infoUpdate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  updateText: {
    fontSize: 14,
    fontWeight: '600',
  },
  updText: {
    fontSize: 14,
    fontWeight: '500',
  },
  updateContainer: {
    gap: 25,
    marginTop: 25,
  },
  updateImage:{
    alignItems:"center",
    gap:15
  },
  updatePhotoText:{
    color:"#9D9C9C",
    fontSize:14,
    fontWeight:"500"
  },
  logoutButton: {
    position: "absolute",
    top: 40,
    right: 0,
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#000000",
    height: height * 0.05,
    marginHorizontal: 23,
    borderRadius: 4,
    marginTop: 10,
    justifyContent: "center", 
    alignItems: "center", 
  },
  
  saveButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 16,
  },
  updText: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});
