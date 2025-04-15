import { Animated, Easing, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import SvgLess from '../../assets/closeWhite';
import { height, style } from '../../utils/helpers';
import SvgFilterWhite from "../../assets/filterWhite";
import SvgBookmarkS from "../../assets/bookmarkS";
import SvgBookmarksFill from "../../assets/bookmarksFill"
import { useEffect, useState } from 'react';
import { WebView } from "react-native-webview";
import WebViewModal from './WebViewModal';

const HangerModal = ({ hangerModal, setHangerModal, post }) => {
  const [selectedBookmark, setSelectedBookmark] = useState([]);
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);


  const handleBookmarkPress = (id) => {
    setSelectedBookmark(prevBookmarks => {
      if (prevBookmarks.includes(id)) {
        return prevBookmarks.filter(bookmarkId => bookmarkId !== id); 
      } else {
        return [...prevBookmarks, id]; 
      }
    });
  };

  const openWebView = (item) => {
    setSelectedItem(item);
    setWebViewUrl(item.websiteUrl);
    setWebViewVisible(true);
  };

  const overlayStyle = hangerModal
    ? { backgroundColor: 'rgba(0, 0, 0, 0.7)' }  // Modal açık
    : { backgroundColor: 'rgba(0, 0, 0, 0.5)' }; 
    const [fadeAnim] = useState(new Animated.Value(0)); // Opaklık için animasyon değeri
  
    useEffect(() => {
      if (hangerModal) {
        // Modal açıldığında yavaşça görünür hale gelsin
        Animated.timing(fadeAnim, {
          toValue: 1, // Tam görünürlük
          duration: 1000, // 800ms süresince animasyon
          useNativeDriver: true,
        }).start();
      } else {
        // Modal kapanırken yavaşça kaybolsun
        Animated.timing(fadeAnim, {
          toValue: 0, // Opaklığı 0 yapalım
          duration: 1000, // 800ms süresince animasyon
          useNativeDriver: true,
        }).start();
      }
    }, [hangerModal]);
    const [slideAnim] = useState(new Animated.Value(500)); // Animasyon için kayma başlangıcı
  
    useEffect(() => {
      if (hangerModal) {
        
        Animated.timing(slideAnim, {
          toValue: 0, 
          duration: 800, 
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();
      } else {
        
        Animated.timing(slideAnim, {
          toValue: 500, 
          duration: 800, 
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();
      }
    }, [hangerModal]);
  
  

    const renderItem = ({ item }) => {
      const isBookmarked = selectedBookmark.includes(item.id);
    
      return (
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => openWebView(item)}
        >
          <View style={styles.image}>
            {item.photo?.[0] && (
              <Image source={{ uri: item.photo[0] }} style={styles.photo} />
            )}
            <TouchableOpacity onPress={() => handleBookmarkPress(item.id)}>
              {isBookmarked ? (
                <SvgBookmarksFill style={styles.bookmark} />
              ) : (
                <SvgBookmarkS style={styles.bookmark} />
              )}
            </TouchableOpacity>
          </View>
    
          <View style={styles.textContainer}>
            <Text style={styles.store}>{item.brand}</Text>
            <Text style={styles.product} numberOfLines={1} ellipsizeMode="tail">
              {item.type}
            </Text>
            <Text style={styles.price}>
              {item.price?.toFixed(2) ?? "0.00"} TL
            </Text>
          </View>
        </TouchableOpacity>
      );
    };
    

  return (
    <Modal
  animationType="none"
  transparent={true}
  visible={hangerModal}
  onRequestClose={() => setHangerModal(false)}
>
  <TouchableWithoutFeedback
    onPress={() => {
      setHangerModal(false);
    }}
  >
    <View
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  backgroundColor: "rgba(0, 0, 0, 0.5)", 
                  position: 'absolute', 
                  top: 0, 
                  left: 0,
                  right: 0, 
                  bottom: 0, 
                }}
              >
          <Animated.View
            style={{
              transform: [{ translateY: fadeAnim }],
              // flex: 1,
              // justifyContent: "flex-end",
              // ...overlayStyle,
              // bottom: keyboardHeight, 
            }}
          >
    {/* <View style={{ flex: 1 }}>  
      <View style={styles.overlay}> */}
        <View style={styles.modalContainer}>
          <View style={styles.container}>
            <View style={styles.headerCont}>
              <Text style={styles.headerText}>Stile göz at</Text>
            </View>
            <TouchableOpacity
              onPress={() => setHangerModal(false)}
              activeOpacity={0.7}
              style={styles.closeButton}
            >
              <SvgLess style={styles.closeBtn} />
            </TouchableOpacity>
          </View>

          <View style={styles.container}>
            <View style={styles.headerCont}>
              <Text style={styles.intheaderText}>Aynı veya benzer ürünler</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} style={styles.closeButton}>
              <SvgFilterWhite style={styles.closeBtn} />
            </TouchableOpacity>
          </View>

          <FlatList
  data={post.clothingLinks}
  renderItem={renderItem}
  keyExtractor={(item, index) => index.toString()}
  horizontal={true}
  showsHorizontalScrollIndicator={false}
  style={styles.productList}
/>

        {/* </View>
      </View> */}

      {/* WebView Modal */}
      <WebViewModal
        visible={webViewVisible}
        onClose={() => setWebViewVisible(false)}
        initialUrl={webViewUrl}
        selectedItem={selectedItem}
        data={post.clothingLinks}
      />
    </View>
    </Animated.View>
          </View>
        </TouchableWithoutFeedback>
</Modal>

  );
};

export default HangerModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    maxHeight: height * 0.55,
  },
  textContainer: {
    alignItems: 'flex-start', 
    width: '100%',
    marginTop:-6
  },
  
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 7,
  },
  headerCont: {
    flex: 1,
  },
  headerText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  intheaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeButton: {
    right: 10,
  },
  closeBtn: {
    width: 24,
    height: 24,
    color: '#FFFFFF',
  },
  card: {
    marginRight: 15,
    alignItems: 'center',
    gap: 10, 
  },
  photo: {
    width: 113,
    height: 165,
    resizeMode: 'contain',
    marginBottom: 10,
    position: 'relative',
  },
  store: {
    fontWeight: '500',
    fontSize: 10,
    marginBottom: 5,
    textAlign: 'left',  
    color:"#B9B9B9"
  },
  product: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 5,
    textAlign: 'left', 
    maxWidth: 90
  },
  price: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'left', 
  },
  bookmark: {
    position: 'absolute',
    right: 5,
    bottom: 15,
  },
  productList: {
    gap: 3,
  },
});
