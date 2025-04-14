import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { post } from '../../utils/helpers'
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { clearPostDetail, fetchPostDetail } from '../../redux/actions/getPostDetailActions';

const ProfilePost = ({postIds}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
   // Tüm post detaylarını çek
  //  useEffect(() => {
  //   postIds.forEach(id => {
  //     dispatch(fetchPostDetail(id));
  //   });
  // }, [postIds]);

  // const { posts } = useSelector((state) => state.posts);
  // const { post, loading, error } = useSelector((state) => state.getPostDetail);
  // console.log('🔍 Component postId:', postId); // Props'tan gelen postId

  // useEffect(() => {
  //   console.log('🔄 useEffect postId:', postId); // useEffect içindeki postId
  //   dispatch(fetchPostDetail(postId));
  // }, [postId]);
  // useEffect(() => {
  //   console.log('🔄 useEffect tetiklendi - postId:', postId); // postId kontrolü

  //   dispatch(fetchPostDetail(postId))
  //     .then((action) => {
  //       if (fetchPostDetail.fulfilled.match(action)) {
  //         console.log('✅ Veri başarıyla çekildi:', action.payload);
  //       } else if (fetchPostDetail.rejected.match(action)) {
  //         console.error('❌ Hata:', action.payload || action.error);
  //       }
  //     });

  //   return () => {
  //     console.log('🧹 Component temizleniyor - state resetlenecek');
  //     dispatch(clearPostDetail());
  //   };
  // }, [dispatch, postId]);

  // // Redux state'ini konsola yazdır
  // console.log('📊 Redux State:', { post, loading, error });

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
              <Image source={{ uri: item.image }}  style={styles.image} />
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