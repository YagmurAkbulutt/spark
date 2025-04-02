import React, {useState} from 'react';
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
import {ScrollView} from 'react-native-gesture-handler';
import {height, users, width} from '../../utils/helpers';
import SearchProfileDetail from '../../components/Search/SearchProfileDetail';
import SvgBack from '../../assets/back';
import {launchImageLibrary} from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const ProfileScreen = ({user, closeModal}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  // Android için galeri izni isteme
  // const requestGalleryPermission = async () => {
  //   if (Platform.OS === "android") {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
  //     );
  //     return granted === PermissionsAndroid.RESULTS.GRANTED;
  //   }
  //   return true;
  // };

  // Galeriden fotoğraf seçme işlemi
  const selectImage = async () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) return;
      if (response.errorMessage) {
        alert('Fotoğraf seçme hatası: ' + response.errorMessage);
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri); // URI'yi state'e ata
      }
    });
  };

  const [isMenuVisible, setIsMenuVisible] = useState(false); // Menü açık mı?
  const navigation = useNavigation();
  const dispatch = useDispatch()

  const handleLogout = async () => {
    try {
      console.log("Çıkış işlemi başlatıldı...");
      dispatch(logout()); // Redux state güncelle
      setIsMenuVisible(false);
      console.log("Kullanıcı çıkış yaptı. SignIn ekranına yönlendiriliyor...");
      navigation.reset({
        index: 0,
        routes: [{ name: "SignIn" }],
      });
    } catch (error) {
      console.error("Çıkış sırasında hata oluştu:", error);
    }
  };
  
  
  
  
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.Scrollcontainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={closeModal} style={styles.headerCont}>
            <Text style={styles.username}>bengsel</Text>
            <SvgDown />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsMenuVisible(!isMenuVisible)}>
        <SvgMenu />
      </TouchableOpacity>

      {/* Menü Açıldığında Görünecek Çıkış Yap Butonu */}
      {isMenuVisible && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      )}
        </View>

        <View style={styles.profileContainer}>
          <View>
            <Image
              style={styles.userImage}
              source={require('../../assets/profilePhoto.png')}
            />
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.username}>Bengisu Çelebi</Text>
            <View style={styles.follow}>
              <Text style={styles.followCountText}>458 takipçi</Text>
              <SvgDot />
              <Text style={styles.followCountText}>764 takip</Text>
            </View>

            <View style={styles.followBtn}>
              <TouchableOpacity
                style={styles.followButton}
                onPress={() => setModalVisible(true)}>
                <Text style={styles.unfollowText}>Profili Düzenle</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dotContainer} activeOpacity={0.7}>
                <Text style={styles.dot}>...</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={styles.userBio}>
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout.
        </Text>

        <SearchProfileDetail />
      </ScrollView>

      {/* Fullscreen Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              activeOpacity={0.7}
              style={styles.closeButton}>
              <SvgBack style={styles.closeBtn} />
            </TouchableOpacity>
            <View style={styles.modalheaderCont}>
              <Text style={styles.headerText}>Profili düzenle</Text>
            </View>
          </View>

          {/* Profil düzenleme içeriklerini buraya ekleyebilirsin */}
          <View style={styles.modalContent}>
            <View style={styles.updateImage}>
              <View style={styles.imageWrapper}>
                <Image
                  source={
                    imageUri
                      ? {uri: imageUri}
                      : require('../../assets/profilePhoto.png')
                  }
                  style={styles.profileImage}
                />
              </View>
              <TouchableOpacity onPress={selectImage}>
                <Text style={styles.updatePhotoText}>Fotoğrafı değiştir</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.updateContainer}>
              <View style={styles.infoUpdate}>
                <Text style={styles.updateText}>Adı</Text>
                <Text style={styles.updText}>Mine Aladağ</Text>
              </View>
              <View style={styles.infoUpdate}>
                <Text style={styles.updateText}>Kullanıcı Adı</Text>
                <Text style={styles.updText}>minealada</Text>
              </View>
              <View style={styles.infoUpdate}>
                <Text style={styles.updateText}>Biyografi</Text>
                <TouchableOpacity>
                  <Text style={styles.updText}>Biyografi ekle</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.infoUpdate}>
                <Text style={styles.updateText}>Bağlantılar</Text>
                <TouchableOpacity>
                  <Text style={styles.updText}>Bağlantı ekle</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
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
    top: 40, // SvgMenu'nun altına konumlandır
    right: 0,
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
});
