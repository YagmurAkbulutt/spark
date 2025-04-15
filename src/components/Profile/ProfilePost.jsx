import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostDetail } from '../../redux/actions/getPostDetailActions';
import { fetchUserPosts } from '../../redux/actions/postActions';

const ProfilePost = ({posts}) => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const userInfo = useSelector((state) => state.user);
  const  userId  = userInfo?.userInfo.id
  // Log the posts in a readable format
  console.log("Profile Posts Data:", JSON.stringify(posts, null, 2));

  const getFirstImage = (item) => {
    if (item.postPhoto) return item.postPhoto;
    if (item.images && item.images.length > 0) return item.images[0];
    return null;
  };
console.log("profile post", posts)

const handleImagePress = async (item) => {
  try {
    if (!userId) {
      throw new Error("User ID is missing in the post data");
    }

    // Find the index of the clicked post in the existing posts array
    const postIndex = posts.findIndex(post => post._id === item._id);
    
    if (postIndex === -1) {
      throw new Error("Post not found in the current posts array");
    }

    navigation.navigate('UserPost', { 
      postId: item._id,
      selectedImage: item,
      initialIndex: postIndex,
      userPosts: posts // Pass the entire posts array if needed in UserPost screen
    });
  } catch (error) {
    console.error('Failed to navigate to post details:', error.message);
  }
};

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item._id}
      numColumns={3}
      columnWrapperStyle={styles.columnWrapper}
      renderItem={({ item }) => (
        item.image ? (
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.itemContainer}
            onPress={() => handleImagePress(item)}
          >
            <Image 
              source={{ uri: item.image }}
              style={styles.image} 
            />
          </TouchableOpacity>
        ) : null
      )}
    />
  );
};

export default ProfilePost

const styles = StyleSheet.create({
    columnWrapper: {
        justifyContent: "space-between", 
        marginHorizontal: -2, 
      },
    itemContainer: {
        flex: 1,
        margin:1
      },
      image: {
        width: 120,
        height: 177,
        borderRadius: 4,
      },
})