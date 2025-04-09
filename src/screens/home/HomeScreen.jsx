import {useState, useEffect, useMemo, useCallback, useRef} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Modal,
  RefreshControl,
  ScrollView,
  FlatList,
  Dimensions,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from 'react-native';
import MasonryList from 'react-native-masonry-list';
import {height, imageData, width} from '../../utils/helpers';
import ImageCarousel from '../../components/Home/ImageCarousel';
import HomeSkeleton from '../../components/Home/HomeSkeleton';
import Header from '../../components/Home/Header';
import FullPostScreen from './FullPostScreen';
import Loader from '../../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../../redux/actions/userActions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getImageSize = async image => {
  return {
    width: Math.floor((width - 30) / 2),
    height: Math.floor(Math.random() * 100) + 250,
  };
};

const HomeScreen = () => {
  const {isLogin}=useSelector(state=>state.auth)
  const dispatch=useDispatch()
  const [formattedImages, setFormattedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [firstRefresh, setFirstRefresh] = useState(true);



  const handleRefresh = () => {
    setFirstRefresh(false);
    onRefresh();
  };

  const loadImages = async () => {
    setLoading(true);
    const updatedImages = await Promise.all(
      imageData.map(async item => {
        const firstImage = item.images[0];
        const {width, height} = await getImageSize(firstImage);

        return {
          id: item.id,
          uri: Image.resolveAssetSource(firstImage).uri,
          width: width,
          height: height,
          images: item.images,
          isCarousel: item.images.length > 1,
          username: item.username,
          description: item.description,
          tags: item.tags,
        };
      }),
    );

    setTimeout(() => {
      setFormattedImages(updatedImages);
      setLoading(false);
      setRefreshing(false);
    }, 1500);
  };

  useEffect(() => {
    loadImages();
  }, []);
  const getToken=async ()=>{
    const token =await AsyncStorage.getItem("token")
    console.log("tokenim",token)
  }

useEffect(() => {
  getToken()
isLogin && dispatch(getUserInfo({}))
}, [isLogin])

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setLoaderVisible(true);
    loadImages();
  }, []);

  const onScroll = (event) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    
    
    if (contentOffsetY < 100) {
      setLoaderVisible(false);
    } else {
      setLoaderVisible(true);
    }
  };
  
  const handleOpenImage = (image) => {
    // 1. Önce FlatList'i sıfırla (scroll'u en başa al)
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  
    // 2. Modal'ı kapat ve hemen yeni resmi aç (50ms gecikmeyle)
    setSelectedImage(null);
    setTimeout(() => {
      setSelectedImage(image);
    }, 50);
  };
  const customImageComponent = useMemo(
    () => item => {
      const foundItem = formattedImages.find(i => i.uri === item.source.uri);

      const handlePress = (item, index) => {
        setSelectedImage(item);
      };

      return foundItem ? (
        <ImageCarousel item={foundItem} onPress={() => handleOpenImage(foundItem)} />
      ) : null;
    },
    [formattedImages,handleOpenImage],
  );

  const dataToScroll = formattedImages.map(image => ({
    username: image.username,
    description: image.description,
    tags: image.tags ? image.tags.join(', ') : '',
  }));
  const masonryRef = useRef(null);
  const [previousScrollY, setPreviousScrollY] = useState(0);
  const handleScrollCloseModal = (event) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
  
    // Eğer aşağı kaydırılıyorsa ve 100 px geçmişse modalı kapat
    if (contentOffsetY < previousScrollY && contentOffsetY > 100) {
      setSelectedImage(null);
    }
  
    setPreviousScrollY(contentOffsetY); 
  };
  

  const posts = useSelector(state => state.posts.posts); 

  useEffect(() => {
    console.log("Redux'taki postlar:", posts);
  }, [posts]);

  const allPosts = useMemo(() => {
    return [...formattedImages, ...posts]; 
  }, [formattedImages, posts]);

  useEffect(() => {
    console.log("Tüm Postlar (formattedImages + posts):", allPosts);
  }, [allPosts]);

  const { height: screenHeight, width: screenWidth } = useWindowDimensions();

  const flatListRef = useRef(null);

  useEffect(() => {
    if (selectedImage) {
      const index = formattedImages.findIndex(img => img.id === selectedImage.id);
      flatListRef.current?.scrollToIndex({ index, animated: false });
    }
  }, [selectedImage]);
 
 
  
  const handleCloseModal = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    setSelectedImage(null);
  };
  
  return (
    <View style={styles.container}>
      <Header />
      <>
        {loading ? (
          <HomeSkeleton />
        ) : (
          <>
            {refreshing && !firstRefresh ? (
              <View style={styles.loaderContainer}>
                <Loader />
              </View>
            ) : null}

            <ScrollView
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
              scrollEventThrottle={16}
              onScroll={onScroll}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor="transparent"
                  colors={['transparent']}
                />
              }>
              <MasonryList
                images={allPosts}
                customImageComponent={customImageComponent}
                columns={2}
                spacing={1}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
            </ScrollView>
          </>
        )}
      </>
      {selectedImage && (
       <Modal
       key={selectedImage?.id || "default"}  
       visible={!!selectedImage}
       animationType="slide"
       onRequestClose={handleCloseModal}
       transparent={true}
     >
       {formattedImages.length > 0 ? (
         
         <View style={{ flex: 1 }}>
         <FlatList
           data={allPosts}
           keyExtractor={(item, index) => item.id?.toString() || index.toString()}
           onScroll={handleScrollCloseModal}
           showsVerticalScrollIndicator={false}
           pagingEnabled
           style={{ flex: 1 }} // Dış View ile aynı boyutta
           snapToAlignment="start" // Her kaydırmada tam ekran geçişi
           decelerationRate="fast" // Kaydırma hızı
           getItemLayout={(data, index) => ({
             length: screenHeight, // Her öğe ekran yüksekliğinde
             offset: screenHeight * index, // Kaydırma offset'i
             index,
           })}
           ref={flatListRef}
           initialScrollIndex={formattedImages.findIndex(
             (img) => img.id === selectedImage.id
           )}
           renderItem={({ item }) => (
             <View style={{ height: screenHeight }}> 
               <FullPostScreen
                 image={item}
                 onClose={() => setSelectedImage(null)}
                 extraData={dataToScroll}
               />
             </View>
           )}
         />
       </View>
         
       ) : (
         <Text style={{ textAlign: "center", marginTop: 20 }}>Yükleniyor...</Text>
       )}
     </Modal>
     
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    paddingTop: Platform.OS === 'android' && 5,
  },
  masonry: {
    flex: 1,
    paddingHorizontal: 50,
    paddingVertical: 20,
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  loaderContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
});

{
  /*
  
  <Modal
          visible={!!selectedImage}
          animationType="slide"
          onRequestClose={() => setSelectedImage(null)}>
          <FullPostScreen
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
            extraData={dataToScroll}
          />
        </Modal>
  */
}
