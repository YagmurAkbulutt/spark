import { FlatList, Image, StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native'
import { height, users, width } from '../../utils/helpers'
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'

const FollowCard = ({ randomUser = null }) => {
  const [following, setFollowing] = useState({}) 
  const [showModal, setShowModal] = useState(false) 
  const navigation = useNavigation() 

  const toggleFollow = (id) => {
    setFollowing((prevState) => {
      const updatedFollowing = {
        ...prevState,
        [id]: !prevState[id], 
      }

      if (!randomUser && Object.values(updatedFollowing).filter(Boolean).length === 1) {
        setShowModal(true)
      }
      return updatedFollowing
    })
  }
  const handleYes = () => {
    navigation.navigate('Main') 
    setShowModal(false) 
  }

  const handleNo = () => {
    setShowModal(false) 
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Kullanıcının Fotoğraf Galerisi */}
      <FlatList
        data={item.posts} 
        keyExtractor={(photo, index) => index.toString()}
        horizontal
        renderItem={({ item: photo }) => (
          <Image source={photo} style={styles.galleryImage} />
        )}
        contentContainerStyle={styles.galleryContainer}
        showsHorizontalScrollIndicator={false}
      />

      {/* Kullanıcı Bilgileri ve Takip Butonu */}
      <View style={styles.userInfoContainer}>
        <View style={styles.userInfo}>
          <Image source={item.profilePhoto} style={styles.profileImage} />
          <View>
            <Text style={styles.username}>@{item.username}</Text>
            <Text style={styles.fullName}>{item.fullName}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.followButton, following[item.id] ? styles.unfollowButton : styles.followButton]} 
          onPress={() => toggleFollow(item.id)}
        >
          <Text style={following[item.id] ? styles.unfollowText : styles.followText}>
            {following[item.id] ? "Takibi Bırak" : "Takip"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>

  )

  return (
    <View style={styles.container}>
      {randomUser ? (
        // Eğer randomUser varsa sadece onu göster
        renderItem({ item: randomUser })
      ) : (
        // Eğer randomUser yoksa tüm kullanıcıları listele
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Yeterli mi?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleYes}>
                <Text style={styles.modalButtonText}>Evet</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleNo}>
                <Text style={styles.modalButtonText}>Hayır</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default FollowCard

const styles = StyleSheet.create({
  container: {
    alignItems:"center",
    justifyContent:"center",
    marginTop:10
  },
  card: {
    backgroundColor: "#F1F1F1",
    borderRadius: 10,
    marginBottom: 7,
    padding: 10,
    width: width * 0.89,
    height: height * 0.23,

  },
  galleryContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems:"center",
    justifyContent:"center",
    width: "100%"
  },
  galleryImage: {
    width: width * 0.19,
    height: height * 0.15,
    borderRadius: 4,
    marginRight:5
  },
  userInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width:"100%",
    paddingHorizontal:8
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"center"
  },
  profileImage: {
    width: width * 0.10,
    height: height * 0.05,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: "600",
    fontSize: 11,
    marginBottom:3
  },
  fullName: {
    fontSize: 11,
    color: "#9D9C9C",
    fontWeight: "500"
  },
  followButton: {
    borderRadius: 5,
    backgroundColor: "#000",
    width: width * 0.30,
    height: height * 0.04,
    justifyContent: "center", 
    alignItems: "center", 
    display: "flex" 
  },
  followText: {
    color: "#fff",
    fontSize:14,
    fontWeight: "500",
    textAlign: "center", 
    lineHeight: height * 0.04,
  },
  unfollowButton: {
    backgroundColor: "#F1F1F1",
    borderWidth: 1,
    borderColor: "#000",
  },
  unfollowText: {
    color: "#000",
    fontWeight: "500",
    fontSize:14
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})
