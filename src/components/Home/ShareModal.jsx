import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Clipboard,
  TextInput,
  Image,
  Keyboard,
  Dimensions,
  Easing,
  Animated,
  KeyboardAvoidingView,
  TouchableWithoutFeedback
} from 'react-native';
import SvgLess from '../../assets/less';
import SvgCopyLink from '../../assets/copyLink';
import SvgWhatsapp from '../../assets/whatsapp';
import SvgInstagram from '../../assets/instagram';
import SvgFacebook from '../../assets/facebook';
import SvgSnapchat from '../../assets/snapchat';
import SvgX from '../../assets/x';
import SvgTelegram from '../../assets/telegram';
import SvgShareLink from '../../assets/shareLink';
import SvgClear from "../../assets/clear"
import {useEffect, useRef, useState} from 'react';
import SvgSearchPeople from '../../assets/searchpeople';
import {height, messageList, notifications, width} from '../../utils/helpers';


const ShareModal = ({modalVisible, setModalVisible}) => {
  const [copied, setCopied] = useState(false);
  const [like, setLike] = useState(false);
  const [searchText, setSearchText] = useState(''); 
  const [selectedUsers, setSelectedUsers] = useState([]);
  const hasSelectedUsers = selectedUsers.length > 1;
    const [filteredUsers, setFilteredUsers] = useState(notifications); 

    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const heightwindow = Dimensions.get('window').height;
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
  
    useEffect(() => {
      if (searchText.trim() === '') {
        setFilteredUsers(messageList); 
      } else {
        const filtered = messageList.filter(user =>
          user.username.toLowerCase().includes(searchText.toLowerCase()),
        );
        setFilteredUsers(filtered);
      }
    }, [searchText]);
  
    const toggleUserSelection = userId => {
      setSelectedUsers(prevSelected => {
        const newSet = new Set(prevSelected);
        newSet.has(userId) ? newSet.delete(userId) : newSet.add(userId);
        return Array.from(newSet);
      });
    };
    

  const handleCopyLink = () => {
    Clipboard.setString('https://example.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Platform seçilip paylaşım yapıldığında
      const handlePlatformShare = (platform) => {
        const postUrl = `https://example.com/post/${postId}`;
    
        // Paylaşım linkleri
        const shareLinks = {
          whatsapp: `https://wa.me/?text=${encodeURIComponent(postUrl)}`,
          instagram: `https://www.instagram.com/?url=${encodeURIComponent(postUrl)}`,
          facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
          snapchat: `https://www.snapchat.com/share?url=${encodeURIComponent(postUrl)}`,
          x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}`,
          telegram: `https://t.me/share/url?url=${encodeURIComponent(postUrl)}`,
          share: postUrl, // Genel paylaşım
        };
    
        // Platform linkini aç
        if (shareLinks[platform]) {
          window.open(shareLinks[platform], '_blank');
        }
    
        // Redux ile paylaşım sayısını artır
        dispatch(updateShareCount(postId));
        
        // Modalı kapat
        setModalVisible(false);
      };
  const shareOptions = [
    {
      id: 'copy',
      label: (
        <Text style={[styles.shareText, {textAlign: 'center', width: '100%'}]}>
          {copied ? 'Kopyalandı' : 'Bağlantıyı\nkopyala'}
        </Text>
      ),
      icon: () => <SvgCopyLink />,
      onPress: handleCopyLink,
    },
    { id: 'whatsapp', label: 'WhatsApp', icon: () => <SvgWhatsapp />, onPress: () => handlePlatformShare('whatsapp') },
    { id: 'instagram', label: 'Instagram', icon: () => <SvgInstagram />, onPress: () => handlePlatformShare('instagram') },
    { id: 'facebook', label: 'Facebook', icon: () => <SvgFacebook />, onPress: () => handlePlatformShare('facebook') },
    { id: 'snapchat', label: 'Snapchat', icon: () => <SvgSnapchat />, onPress: () => handlePlatformShare('snapchat') },
    { id: 'x', label: 'X', icon: () => <SvgX />, onPress: () => handlePlatformShare('x') },
    { id: 'telegram', label: 'Telegram', icon: () => <SvgTelegram />, onPress: () => handlePlatformShare('telegram') },
    { id: 'share', label: 'Paylaş', icon: () => <SvgShareLink />, onPress: () => handlePlatformShare('share') },
  ];
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setModalVisible(false);
      }}
    >
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <View style={styles.scontainer}>
                <View
                  style={[
                    styles.searchContainer,
                    hasSelectedUsers && { width: "75%" },
                  ]}
                >
                  <SvgSearchPeople style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Kişi ara"
                    placeholderTextColor="#BBBBBB"
                    onChangeText={setSearchText}
                    value={searchText}
                    selectionColor="#D134AA"
                  />
                  {searchText.length > 0 && (
                    <TouchableOpacity
                      onPress={() => setSearchText('')}
                      style={styles.clearIcon}
                    >
                      <SvgClear />
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity
                   onPress={() => {
                    setModalVisible(false);  // Önce modalı kapat
                    setTimeout(() => {
                      Keyboard.dismiss();  // Modal kapandıktan sonra klavyeyi kapat
                    }, 100); // 100ms gecikme ile klavye kapanacak
                  }}
                  activeOpacity={0.7}
                  style={styles.closeButton}
                >
                  <SvgLess style={styles.closeBtn} />
                </TouchableOpacity>
              </View>
  
              {/* Kullanıcı Listesi */}
              <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const isSelected = selectedUsers.includes(item.id);
                  return (
                    <TouchableOpacity
                      style={[
                        styles.userItem,
                        isSelected && styles.selectedUserItem,
                      ]}
                      onPress={() => toggleUserSelection(item.id)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.userImageWrapper,
                          isSelected && styles.selectedImageWrapper,
                        ]}
                      >
                        <Image source={item.userImage} style={styles.userImage} />
                      </View>
                      <Text style={styles.username}>{item.username}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
  
              <FlatList
                data={shareOptions}
                horizontal
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.shareButton}
                    onPress={item.onPress}
                    activeOpacity={0.7}
                  >
                    {item.icon()}
                    <Text style={styles.shareText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.shareScroll}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
  
};

export default ShareModal;

const styles = StyleSheet.create({
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
    maxHeight: height * 0.55,
  },
  closeButton: {
    right: 16,
    left:16
  },
  closeBtn: {
    width: 24,
    height: 24,
  },
  shareButton: {
    alignItems: 'center',
    height: 160
  },
  shareText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
  },
  shareScroll: {
    gap: 17,
    marginVertical: 10,
  },
  scontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width * 0.9,
    height: 38,
    flex:1,
    paddingVertical:20,
    marginBottom:20
    
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 10,
    height: 38,
    width: '85%',  
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    textAlignVertical: 'center',
  },
  clearIcon: {
    marginLeft: 10, 
    padding: 5,
  },
  userItem: {
    alignItems: 'center',
    justifyContent:"center",
    marginBottom: 25,
    width: width * 0.30
  },
  userImage: {
    width: 78,
    height: 78,
    borderRadius: 45,
  },
  username: {
    marginTop: 6,
    fontSize: 12,
  },
});
