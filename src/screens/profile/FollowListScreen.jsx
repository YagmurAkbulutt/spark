import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFollowers, fetchFollowing } from '../../redux/slices/followSlice';
import SvgBack from "../../assets/back.js"
import { useFocusEffect, useNavigation } from '@react-navigation/native';


const FollowListScreen = ({ onClose,route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation()
  const { activeTab, userId } = route.params;
  
  console.log("userınfo",userId)
  const { followers, following, loading } = useSelector(state => state.follow);
  
  useFocusEffect(
    React.useCallback(() => {
      // Önce mevcut verileri temizle (geçici olarak boş dizi yap)
      if (activeTab === 'followers') {
        dispatch({ type: 'followers/reset' }); // Redux'ta followers'ı sıfırla
      } else {
        dispatch({ type: 'following/reset' }); // Redux'ta following'i sıfırla
      }
  
      // Sonra yeni verileri çek
      if (activeTab === 'followers') {
        dispatch(fetchFollowers(userId));
      } else {
        dispatch(fetchFollowing(userId));
      }
    }, [activeTab, userId])
  );
//   if (loading) {
//     return (
//         <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

  const currentData = activeTab === 'followers' ? followers : following;
  console.log("Current Data:", currentData);
  if (loading || currentData.loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
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
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <TouchableOpacity onPress={navigation.goBack}>
      <SvgBack/>
    </TouchableOpacity>
    <Text style={[styles.title, { marginLeft: 15 }]}>
      {activeTab === 'followers' ? 'Takipçiler' : 'Takip Edilenler'}
    </Text>
  </View>
</View>

      <FlatList
        data={currentData}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.userItem}
            onPress={() => navigation.navigate('FollowProfile', { user: item })}
          >
            <Image 
              source={{ uri: item.profilePicture }} 
              style={styles.profileImage}
            />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{item.fullName}</Text>
              <Text style={styles.username}>{item.username}</Text>
              
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
    
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center', // Dikeyde ortala
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginTop: 70,
    paddingHorizontal: 16, // Yan boşluk ekle
  },
  title: {
    marginLeft: 10, // İkon ile yazı arasına boşluk ekle
    fontSize: 18,
    fontWeight: 'bold',
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

export default FollowListScreen;