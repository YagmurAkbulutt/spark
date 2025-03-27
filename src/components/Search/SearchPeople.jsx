import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SvgClose from '../../assets/close';
import SvgFollow from '../../assets/follow';
import {width} from '../../utils/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import SearchProfile from './SearchProfile';

const SearchPeople = ({filteredUsers}) => {
  const [savedUsers, setSavedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); 
  const [modalVisible, setModalVisible] = useState(false);
  const { height: screenHeight } = Dimensions.get('window');  
  const tabBarHeight = 80; 
  const modalHeight = screenHeight - tabBarHeight;

  useEffect(() => {
    const loadSavedUsers = async () => {
      const storedUsers = await AsyncStorage.getItem('savedUsers');
      if (storedUsers) {
        setSavedUsers(JSON.parse(storedUsers));
      }
    };
    loadSavedUsers();
  }, []);

  const handleSelectUser = async user => {
  
    if (!savedUsers.some(u => u.id === user.id)) {
      const updatedUsers = [...savedUsers, user];
      setSavedUsers(updatedUsers);
      await AsyncStorage.setItem('savedUsers', JSON.stringify(updatedUsers));
    }
  
    setSelectedUser(user); 
    setModalVisible(true);
  };
  

  const handleRemoveUser = async userId => {
    const updatedUsers = savedUsers.filter(user => user.id !== userId);
    setSavedUsers(updatedUsers);
    await AsyncStorage.setItem('savedUsers', JSON.stringify(updatedUsers));
  };

  const mergedUsers = [
    ...savedUsers,
    ...filteredUsers.filter(u => !savedUsers.some(su => su.id === u.id)),
  ];

  return (
    <View style={styles.userList}>
      <FlatList
        data={mergedUsers}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{width: '100%'}}
        renderItem={({item}) => (
          <View style={styles.userItemContainer}>
            <TouchableOpacity
              style={styles.userItem}
              activeOpacity={0.7}
              onPress={() => handleSelectUser(item)}>
              <View style={styles.imageContainer}>
                <Image source={item.profilePhoto} style={styles.userImage} />
                <SvgFollow style={styles.icon} />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.username}>{item.fullName}</Text>
                <Text style={styles.userHandle}>{item.username}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.closeIconContainer}>
              {savedUsers.some(u => u.id === item.id) ? (
                <TouchableOpacity onPress={() => handleRemoveUser(item.id)} activeOpacity={0.7}>
                  <SvgClose width={16} height={16} />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        )}
      />

<Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} style={{height:modalHeight}}>
         <View style={styles.modalContainer}>
    <View style={[styles.modalContent, { height: modalHeight }]}>
      <SearchProfile user={selectedUser} closeModal={() => setModalVisible(false)} />
    </View>
  </View>
      </Modal>

    </View>
  );
};

export default SearchPeople;

const styles = StyleSheet.create({
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
   paddingBottom: 5,
    width: width * 0.85,
    marginTop: 15,
  },
  userItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userImage: {
    width: 56,
    height: 56,
    borderRadius: 30,
    marginRight: 10,
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    bottom: -2,
    right: 5,
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  userHandle: {
    fontSize: 14,
    color: '#9D9C9C',
    fontWeight: '400',
  },
  closeIconContainer: {
    width: 24, // Sabit genişlik
    alignItems: 'center',
    justifyContent: 'center',
  },
  // modalContainer: {
  //   flex: 1,
  //   justifyContent: 'flex-end', // Modalın altta açılmasını sağlar
  //   backgroundColor: 'rgba(0, 0, 0, 0.5)', // Arka planı karartır
  // },
  // modalContent: {
  //   backgroundColor: '#fff',
  //   width: '100%',
  //   borderTopLeftRadius: 20,
  //   borderTopRightRadius: 20,
  //   padding: 20,
  // },
 
  
});
