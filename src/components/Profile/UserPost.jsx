import {useState, useEffect, useRef} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Animated,
  TouchableWithoutFeedback,
  useWindowDimensions,
  Dimensions,
  FlatList,
} from 'react-native';
import SvgCloseLight from '../../assets/closeLight';
import SvgHeart from '../../assets/heart';
import SvgComments from '../../assets/comments';
import SvgBookmark from '../../assets/bookmark';
import SvgShare from '../../assets/share';
import SvgHanger from '../../assets/hanger';
import SvgPlusPinkB from '../../assets/plusPinkB';
import LinearGradient from 'react-native-linear-gradient';
import ShareModal from '../../components/Home/ShareModal';
import CommentModal from '../../components/Home/CommentModal';
import CollectionsModal from '../../components/Home/CollectionsModal';
import HangerModal from '../../components/Home/HangerModal';
import {height, width} from '../../utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { addLike, removeLike } from '../../redux/slices/likesSlice';
import { savePost, unsavePost } from '../../redux/slices/savedPostSlice';
import { useNavigation, useRoute } from '@react-navigation/native';

const UserPost = ({  onClose }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation()
  const route = useRoute();
  const { image, item } = route.params;

  const likesCount = useSelector((state) => state.likes.likesCount);
  const commentsCount = useSelector((state) => state.comments.commentsCount);
  // const savedPosts = useSelector((state) => state.savedPosts.savedPosts);
  // const shareCount = useSelector((state) => state.share.shareCount);

  const [scrollY] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(1));
  const [translateY] = useState(new Animated.Value(0));
  const [modalVisible, setModalVisible] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [collectionModal, setCollectionModal] = useState(false);
  const [hangerModal, setHangerModal] = useState(false);
  const [isHangerOpen, setIsHangerOpen] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const likes = useSelector((state) => state.likes.likes);
  const likedBy = useSelector((state) => state.likes.likedBy);
  const userId = 1; 
  const commentCount = useSelector((state) => state.comments.commentCount);
  const savedCounts = useSelector(state => state.savedPosts.savedCounts);
  // const isSaved = savedPosts.includes(item.id);
// const saveCount = savedCounts[item.id] || 0;


const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigation.goBack();
    }
  };
  

  const handleLike = () => {
    if (likedBy.includes(userId)) {
      dispatch(removeLike({ userId }));
    } else {
      dispatch(addLike({ userId }));
    }
  };

  // Yorum butonuna tıklandığında
  const handleComment = () => {
    setCommentModal(true);
  };
  // Yorum gönderildiğinde
  const handleSubmitComment = (commentText) => {
    const newComment = {
      id: Date.now(), 
      userId: 1,
      comment: commentText,
    };
    dispatch(addComment({ comment: newComment }));
    setCommentModal(false); 
  };

  
  const handleSave = () => {
    setCollectionModal(true)
    if (savedPosts.includes(image.id)) {
      dispatch(unsavePost(image.id));
    } else {
      dispatch(savePost(image.id));
    }
  };

    // Paylaş butonuna tıklandığında
    const handleShare = () => {
      setModalVisible(true);
    };
  
    

 
//   useEffect(() => {
//     const listener = scrollY.addListener(({ value }) => {
//       if (value < -150) {
//         Animated.parallel([
//           Animated.timing(fadeAnim, {
//             toValue: 0,
//             duration: 300,
//             useNativeDriver: true,
//           }),
//           Animated.timing(translateY, {
//             toValue: -500,
//             duration: 300,
//             useNativeDriver: true,
//           }),
//         ]).start(() => {
//           onClose();
//         });
//       }
//     });

//     return () => {
//       scrollY.removeListener(listener);
//     };
//   }, [scrollY, fadeAnim, translateY, onClose]);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false },
  );

  const toggleHangerModal = () => {
    if (!hangerModal) {
      setIsHangerOpen(true);
    } else {
      setTimeout(() => setIsHangerOpen(false), 300);
    }
    setHangerModal(!hangerModal);
  };
  const { sheight, swidth } = useWindowDimensions();

  const { selectedImage, allPosts } = route.params; // selectedImage ve allPosts alınıyor
  const flatListRef = useRef(null);
  const screenHeight = Dimensions.get('window').height;

  // Görsellerin sırasını ayarlamak için
  const selectedIndex = allPosts.findIndex((img) => img.id === selectedImage.id);

  useEffect(() => {
    // Seçilen görselin bulunduğu indekse scroll etme
    if (selectedIndex !== -1 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToIndex({ index: selectedIndex, animated: false });
      }, 100);
    }
  }, [selectedIndex]);
  
  return (
    <FlatList
    data={allPosts}
    keyExtractor={(item) => item.id.toString()}
    ref={flatListRef}
    pagingEnabled
    horizontal={false}
    showsVerticalScrollIndicator={false}
    getItemLayout={(data, index) => ({
      length: screenHeight,
      offset: screenHeight * index,
      index,
    })}
    renderItem={({ item }) => (
      <View style={{ height: screenHeight }}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={{ flex: 1 }}>
            <Animated.ScrollView
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              onScroll={onScroll} // Scroll işlemi
              scrollEventThrottle={16}
            >
              <Animated.View
                style={[
                  styles.container,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY }],
                  },
                ]}
              >
                {/* Üst Gölge */}
                <LinearGradient
                  colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0)']}
                  style={styles.topGradient}
                />

                {/* Fotoğraf */}
                <Image source={item.postPhoto} style={styles.image} />

                {/* Alt Gölge */}
                <LinearGradient
                  colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                  style={styles.bottomGradient}
                />
              </Animated.View>

              <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                <SvgCloseLight />
              </TouchableOpacity>

              {/* Action Buttons */}
              <View style={styles.action}>
                {hangerModal ? null : (
                  <>
                    {/* Beğeni Butonu */}
                    <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
                      <SvgHeart />
                      <Text style={styles.actionText}>{likes}</Text>
                    </TouchableOpacity>

                    {/* Yorum Butonu */}
                    <View>
                      <TouchableOpacity style={styles.actionBtn} onPress={handleComment}>
                        <SvgComments />
                        <Text style={styles.actionText}>{commentCount}</Text>
                      </TouchableOpacity>
                      <CommentModal
                        commentModal={commentModal}
                        setCommentModal={setCommentModal}
                        onSubmitComment={handleSubmitComment}
                      />
                    </View>

                    {/* Kaydet Butonu */}
                    <View>
                      <TouchableOpacity style={styles.actionBtn} onPress={handleSave}>
                        <SvgBookmark />
                        <Text style={styles.actionText}>
                          {/* {saveCount} */}
                        </Text>
                      </TouchableOpacity>
                      <CollectionsModal
                        collectionModal={collectionModal}
                        setCollectionModal={setCollectionModal}
                      />
                    </View>

                    {/* Paylaş Butonu */}
                    <View>
                      <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
                        <SvgShare />
                        <Text style={styles.actionText}>
                          {/* {shareCount} */}
                        </Text>
                      </TouchableOpacity>
                      <ShareModal
                        modalVisible={modalVisible}
                        setModalVisible={setModalVisible}
                      />
                    </View>
                  </>
                )}
                {!hangerModal && (
                  <View>
                    <TouchableOpacity style={styles.actionBtn} onPress={toggleHangerModal}>
                      <SvgHanger />
                    </TouchableOpacity>
                  </View>
                )}

                <HangerModal
                  hangerModal={hangerModal}
                  setHangerModal={toggleHangerModal}
                />
              </View>

              {/* Profil */}
              {hangerModal ? null : (
                <View style={styles.profile}>
                  <View style={styles.profileContainer}>
                    <View style={styles.imageWrapper}>
                      <Image
                        source={require('../../assets/profilePhoto.png')}
                        style={styles.profileImage}
                      />
                    </View>
                    <TouchableOpacity style={styles.plusButton}>
                      <SvgPlusPinkB />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.title}>
                    <Text style={styles.username}>
                      @<Text style={styles.boldUsername}>{item?.username}</Text>
                    </Text>
                    <Text style={styles.caption}>
                      {item?.description}
                      {Array.isArray(item?.tags) && item?.tags.length > 0
                        ? item?.tags.map((tag, index) => (
                            <Text key={index} style={styles.hashtag}>
                              {tag}{' '}
                            </Text>
                          ))
                        : null}
                    </Text>
                  </View>
                </View>
              )}
            </Animated.ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )}
  />
  );
};

export default UserPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: width,
    height: height,
  },
  image: {
    width: '100%',
    height: '100%',
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
  },
  closeBtn: {
    position: 'absolute',
    top: 80,
    right: 30,
    zIndex: 10,
  },
  scrollContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  action: {
    position: 'absolute',
    zIndex: 10,
    bottom: 60,
    right: 20,
    gap: 16,
  },
  actionBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  profile: {
    position: 'absolute',
    zIndex: 10,
    bottom: 60,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  imageWrapper: {
    position: 'relative',
    width: 55,
    height: 55,
    borderRadius: 50,
    overflow: 'hidden',
  },
  profileImage: {
    width: 55,
    height: 55,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  plusButton: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 19,
    height: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    maxWidth: 220,
    flexDirection: 'column',
  },
  username: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  boldUsername: {
    fontWeight: '700',
  },
  description: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  caption: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '400',
  },
  hashtag: {
    color: '#FFC2F0',
    fontSize: 14,
    fontWeight: '400',
  },
  additionalData: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    width: '90%',
  },
  item: {
    marginBottom: 10,
  },
  itemText: {
    color: '#fff',
    fontSize: 16,
  },
});
