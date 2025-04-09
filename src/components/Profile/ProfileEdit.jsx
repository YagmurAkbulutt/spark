import {
    Modal,
    SafeAreaView,
    View,
    TouchableOpacity,
    Text,
    TextInput,
    Image,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
  } from 'react-native';
  import SvgBack from "../../assets/back"; 
import { height, width } from '../../utils/helpers';
import { useSelector } from 'react-redux';

  
  const ProfileEdit = ({
    modalVisible,
  setModalVisible,
  userInfo,
  fullName,
  setFullName,
  username,
  setUsername,
  bio,
  setBio,
  selectImage,
  handleSave,
  formData
  }) => {
    const { isLoading } = useSelector((state) => state.user);
 
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
  
          <View style={styles.modalContent}>
            <View style={styles.updateImage}>
              <View style={styles.imageWrapper}>
              <Image
                            style={styles.userImage}
                            source={{ uri: userInfo.profilePicture }}
                          />
              </View>
              <TouchableOpacity onPress={selectImage}>
                <Text style={styles.updatePhotoText}>Fotoğrafı değiştir</Text>
              </TouchableOpacity>
            </View>
  
            <View style={styles.updateContainer}>
              <View style={styles.infoUpdate}>
                <Text style={styles.updateText}>Adı</Text>
                <TextInput
                  style={styles.updText}
                  value={formData.fullName}
                  onChangeText={formData.setFullName}
                  onSubmitEditing={handleSave}
                  onBlur={handleSave}
                  autoCapitalize="words"
                  placeholder="Ad Soyad"
                  returnKeyType="done"
                  selectionColor="#D134AA"
                />
              </View>
              <View style={styles.infoUpdate}>
                <Text style={styles.updateText}>Kullanıcı Adı</Text>
                <TextInput
                  style={styles.updText}
                  value={formData.username}
                  onChangeText={formData.setUsername}
                  onSubmitEditing={handleSave}
                  onBlur={handleSave}
                  autoCapitalize="words"
                  placeholder="Ad Soyad"
                  returnKeyType="done"
                  selectionColor="#D134AA"
                />
              </View>
              <View style={styles.infoUpdate}>
                <Text style={styles.updateText}>Biyografi</Text>
                <TextInput
                  style={styles.updText}
                  value={formData.bio}
                  onChangeText={formData.setBio}
                  onSubmitEditing={handleSave}
                  onBlur={handleSave}
                  autoCapitalize="words"
                  placeholder="Biyografi"
                  returnKeyType="done"
                  selectionColor="#D134AA"
                />
              </View>
              <View style={styles.infoUpdate}>
                <Text style={styles.updateText}>Bağlantılar</Text>
                <TouchableOpacity>
                  <Text style={styles.updText}>Bağlantı ekle</Text>
                </TouchableOpacity>
              </View>


              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              {isLoading ? (
  <ActivityIndicator />
) : (
  <Text style={styles.saveButtonText}>Kaydet</Text>
)}
              </TouchableOpacity>


            </View>
          </View>
        </SafeAreaView>
      </Modal>
      </TouchableWithoutFeedback>
    );
  };

  const styles = StyleSheet.create({
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
      userImage: {
          width: width * 0.26,
          height: width * 0.26,
          borderRadius:60
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
        fontSize: 14,
        padding: 10,
        
      },
  })

  export default ProfileEdit;