import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { post } from '../../utils/helpers'
import { useNavigation } from '@react-navigation/native';

const ProfilePost = () => {
  const navigation = useNavigation();

  const getFirstImage = (item) => {
    if (item.postPhoto) return item.postPhoto;
    if (item.images && item.images.length > 0) return item.images[0];
    return null;
  };

  const handleImagePress = (item) => {
    navigation.navigate('UserPost', { selectedImage: item, allPosts: post });
  };

  return (
    <FlatList
      data={post}
      keyExtractor={(item) => item.id.toString()}
      numColumns={3}
      columnWrapperStyle={styles.columnWrapper}
      renderItem={({ item }) => {
        const imageSource = getFirstImage(item);
        return (
          imageSource && (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.itemContainer}
              onPress={() => handleImagePress(item)}
            >
              <Image source={imageSource} style={styles.image} />
            </TouchableOpacity>
          )
        );
      }}
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