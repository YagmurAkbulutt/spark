import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFollowers, fetchFollowing } from '../../redux/slices/followSlice';
import SvgBack from "../../assets/back.js"
import { useNavigation } from '@react-navigation/native';


const FollowList = ({ activeTab, userId, onClose }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation()
  
  
  const { followers, following } = useSelector(state => state.follow);
  
  useEffect(() => {
    if (activeTab === 'followers') {
      dispatch(fetchFollowers(userId));
    } else {
      dispatch(fetchFollowing(userId));
    }
  }, [activeTab, userId, dispatch]);

  const currentData = activeTab === 'followers' ? followers : following;
  console.log("Current Data:", currentData);
  if (currentData.loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (currentData.error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Hata: {currentData.error.message || 'Beklenmeyen bir hata oluştu'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
        <TouchableOpacity onPress={onClose}>
          <SvgBack/>
        </TouchableOpacity>
          {activeTab === 'followers' ? 'Takipçiler' : 'Takip Edilenler'}
        </Text>
        
      </View>

      <FlatList
        data={currentData}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.userItem}
            onPress={() => navigation.navigate('SearchProfile', { user: item })}
          >
            <Image 
              source={{ uri: item.profilePicture || 'https://via.placeholder.com/150' }} 
              style={styles.profileImage}
            />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{item.fullName}</Text>
              <Text style={styles.username}>{item.username}</Text>
              <Text style={styles.bio} numberOfLines={1}>{item.bio}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {activeTab === 'followers' ? 'Takipçi bulunamadı' : 'Takip edilen kullanıcı bulunamadı'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
    marginTop:100
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    color: '#007AFF',
    fontSize: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5'
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15
  },
  userInfo: {
    flex: 1
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 3
  },
  bio: {
    color: '#666',
    fontSize: 14
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorText: {
    color: 'red',
    textAlign: 'center'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    color: '#888',
    fontSize: 16
  }
});

export default FollowList;