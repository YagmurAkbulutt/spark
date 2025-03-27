import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import SvgLess from '../../assets/less';
import { height } from '../../utils/helpers';
import Collections from './Collections';

const CollectionsModal = ({ collectionModal, setCollectionModal }) => {

  return (
    <Modal
    animationType="slide"
    transparent={true}
    visible={collectionModal}
    onRequestClose={() => setCollectionModal(false)}
  >
    <TouchableWithoutFeedback onPress={() => setCollectionModal(false)}>
      <View style={styles.overlay}>
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
