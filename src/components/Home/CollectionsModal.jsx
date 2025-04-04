import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Animated,
  Easing,
} from 'react-native';
import SvgLess from '../../assets/less';
import { height } from '../../utils/helpers';
import Collections from './Collections';
import { useEffect, useState } from 'react';

const CollectionsModal = ({ collectionModal, setCollectionModal }) => {

   const overlayStyle = collectionModal
    ? { backgroundColor: 'rgba(0, 0, 0, 0.7)' }  // Modal açık
    : { backgroundColor: 'rgba(0, 0, 0, 0.5)' }; 
    const [fadeAnim] = useState(new Animated.Value(0)); // Opaklık için animasyon değeri
  
    useEffect(() => {
      if (collectionModal) {
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
    }, [collectionModal]);
    const [slideAnim] = useState(new Animated.Value(500)); // Animasyon için kayma başlangıcı
  
    useEffect(() => {
      if (collectionModal) {
        
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
    }, [collectionModal]);

  return (
    <Modal
    animationType="none"
    transparent={true}
    visible={collectionModal}
    onRequestClose={() => setCollectionModal(false)}
  >
    <TouchableWithoutFeedback onPress={() => setCollectionModal(false)}>

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
      {/* <View style={styles.overlay}> */}
        <View style={styles.modalContainer}>
          <View style={styles.container}>
            <View style={styles.headerCont}>
              <Text style={styles.headerText}>Koleksiyon</Text>
            </View>
            <TouchableOpacity
              onPress={() => setCollectionModal(false)}
              activeOpacity={0.7}
              style={styles.closeButton}
            >
              <SvgLess style={styles.closeBtn} />
            </TouchableOpacity>
          </View>
  
          <Collections />
        </View>
      {/* </View> */}
      </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
  
  );
};

export default CollectionsModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    maxHeight: height * 0.55,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 38,
    paddingVertical: 10,
    marginBottom: 10,
  },
  headerCont: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  closeButton: {
    right: 10,
  },
  closeBtn: {
    width: 24,
    height: 24,
  }
});
