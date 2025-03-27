import {Animated,Easing,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import SvgLess from '../../assets/less';
import SvgSearchPeople from '../../assets/searchpeople';
import SvgPeople from '../../assets/people';
import {useEffect, useRef, useState} from 'react';
import {height, messageList, width} from '../../utils/helpers';

const NewMessageModal = ({modalVisible, setModalVisible}) => {
  const [searchText, setSearchText] = useState(''); // Arama metni

  const [filteredUsers, setFilteredUsers] = useState(messageList); // Filtrelenmiş kullanıcılar
  const [selectedUsers, setSelectedUsers] = useState([]);
  const hasSelectedUsers = selectedUsers.length > 1;

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const animatedHeight = useRef(new Animated.Value(height * 0.85)).current; // Başlangıç yüksekliği

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener("keyboardDidShow", (event) => {
      const Modalheight = event.endCoordinates.height;
      setKeyboardHeight(Modalheight);
      

      // Modal yüksekliğini yumuşak bir geçişle değiştir
      Animated.timing(animatedHeight, {
        toValue: height * 0.85 - Modalheight, // Modalı küçült
        duration: 100, // Animasyon süresi (ms)
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    });

    const keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
      

      Animated.timing(animatedHeight, {
        toValue: height * 0.85, // Modalı eski haline getir
        duration: 50,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);
  // Arama metni değiştikçe filtreleme yap
  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredUsers(messageList); // Eğer arama metni boşsa tüm kullanıcıları göster
    } else {
      const filtered = messageList.filter(user =>
        user.username.toLowerCase().includes(searchText.toLowerCase()),
      );
      setFilteredUsers(filtered);
    }
  }, [searchText]);

  const toggleUserSelection = userId => {
    setSelectedUsers(
      prevSelected =>
        prevSelected.includes(userId)
          ? prevSelected.filter(id => id !== userId) // Seçiliyse çıkar
          : [...prevSelected, userId], // Seçili değilse ekle
    );
  };
  return (
    <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}>
  
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{ flex: 1 }}>
    
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.modalContainer, { height: animatedHeight }]}>
          
          {/* Başlık ve Kapatma Butonu */}
          <View style={styles.share}>
            <Text style={styles.title}>Yeni Mesaj</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              activeOpacity={0.7}
              style={styles.closeButton}>
              <SvgLess style={styles.closeBtn} />
            </TouchableOpacity>
          </View>

          {/* Arama ve Seçili Kullanıcılar */}
          <View style={styles.scontainer}>
            <View
              style={[
                styles.searchContainer,
                hasSelectedUsers && { width: "75%" },
              ]}>
              <SvgSearchPeople style={styles.searchIcon}/>
              <TextInput
                style={styles.searchInput}
                placeholder="Kişi ara"
                placeholderTextColor="#BBBBBB"
                onChangeText={setSearchText}
                value={searchText}
              />
            </View>

            {hasSelectedUsers && (
              <View style={styles.selectedCountContainer}>
                <Text style={styles.selectedCountText}>{selectedUsers.length}+</Text>
                <SvgPeople />
              </View>
            )}
          </View>

          {/* Kullanıcı Listesi */}
          <FlatList
            data={filteredUsers}
            keyExtractor={item => item.id.toString()}
            numColumns={3} 
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
              const isSelected = selectedUsers.includes(item.id);
              return (
                <TouchableOpacity
                  style={[
                    styles.userItem,
                    isSelected && styles.selectedUserItem,
                  ]}
                  onPress={() => toggleUserSelection(item.id)}
                  activeOpacity={0.7}>
                  <View
                    style={[
                      styles.userImageWrapper,
                      isSelected && styles.selectedImageWrapper,
                    ]}>
                    <Image source={item.userImage} style={styles.userImage} />
                  </View>
                  <Text style={styles.username}>{item.username}</Text>
                </TouchableOpacity>
              );
            }}
          />

          {/* Buton */}
          <TouchableOpacity style={styles.button} activeOpacity={0.7}>
            <Text style={styles.buttonText}>
              {selectedUsers.length > 1
                ? 'Grup Sohbetini Başlat'
                : 'Sohbeti Başlat'}
            </Text>
          </TouchableOpacity>

        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
</Modal>
  );
};

export default NewMessageModal;

const styles = StyleSheet.create({
  selectedUserItem: {
    padding: 5,
  },
  userImageWrapper: {
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 3, // Her zaman border olsun
    borderColor: 'transparent', // Varsayılan olarak görünmez
  },
  selectedImageWrapper: {
    backgroundColor: '#D134AA33', 
    borderWidth: 3,
    borderColor: '#D134AA',
    borderRadius: 50,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3, // Her zaman border olsun
    borderColor: 'transparent', // Varsayılan olarak görünmez
  },
  username: {
    marginTop: 5,
    fontSize: 14,
    color: '#000',
  },
  
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  scontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom:20,
    width: width * 0.90,
    height:38
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#000",
    paddingHorizontal: 10,
    height: 38,
    flex: 1, 
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
    fontWeight:"500",
    textAlignVertical:"center"
  },
  selectedCountContainer: {
    backgroundColor: "#000",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: 38,
    marginLeft: 10, 
  },
  selectedCountText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    marginRight: 5,
  },
  userItem: {
    alignItems: 'center',
    justifyContent:"center",
    marginBottom: 15,
    width: width * 0.30
  },
  userImage: {
    width: 78,
    height: 78,
    borderRadius: 45,
    // borderWidth: 2,
    // borderColor: '#ccc',
  },
  username: {
    marginTop: 6,
    fontSize: 12,
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 33,
    alignItems: 'center',
    marginTop: 10,
    width: width * 0.90,
    height:47
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    alignItems:"center",
    justifyContent:"center"
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    maxHeight: height * 0.83
  },
  share: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 25,
    position: 'relative',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
  },
  closeBtn: {
    width: 24,
    height: 24,
  },
});


