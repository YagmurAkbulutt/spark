import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Clipboard,
} from 'react-native';
import SvgLess from '../../assets/less';
import SvgCopyLink from '../../assets/copyLink';
import SvgWhatsapp from '../../assets/whatsapp';
import SvgInstagram from '../../assets/instagram';
import SvgFacebook from '../../assets/facebook';
import SvgSnapchat from '../../assets/snapchat';
import SvgX from '../../assets/x';
import SvgTelegram from '../../assets/telegram';
import SvgShareLink from '../../assets/shareLink';
import SvgLike from "../../assets/like"
import SvgLikeFill from "../../assets/likeFill"
import SvgEyes from "../../assets/eyes"
import SvgAttention from "../../assets/attention"
import SvgEye from "../../assets/eye"
import {useState} from 'react';

const ShareBottomSheet = ({modalVisible, setModalVisible}) => {
  const [copied, setCopied] = useState(false);
  const [like, setLike] = useState(false)

  const handleCopyLink = () => {
    Clipboard.setString('https://example.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };
  const shareOptions = [
    {
      id: 'copy',
      label: <Text style={[styles.shareText, { textAlign: 'center', width: '100%' }]}>
      {copied ? 'Kopyalandı' : 'Bağlantıyı\nkopyala'}
    </Text>,
      icon: () => <SvgCopyLink />,
      onPress: handleCopyLink,
    },
    {id: 'whatsapp', label: 'WhatsApp', icon: () => <SvgWhatsapp />},
    {id: 'instagram', label: 'Instagram', icon: () => <SvgInstagram />},
    {id: 'facebook', label: 'Facebook', icon: () => <SvgFacebook />},
    {id: 'snapchat', label: '', icon: () => <SvgSnapchat />},
    {id: 'x', label: 'X', icon: () => <SvgX />},
    {id: 'telegram', label: 'Telegram', icon: () => <SvgTelegram />},
    {id: 'share', label: 'Paylaş', icon: () => <SvgShareLink />},
  ];
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.share}>
            <Text style={styles.title}>Paylaş</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              activeOpacity={0.7}
              style={styles.closeButton}>
              <SvgLess style={styles.closeBtn} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={shareOptions}
            horizontal
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.shareButton}
                onPress={item.onPress}
                activeOpacity={0.7}>
                {item.icon()}
                <Text style={styles.shareText}>{item.label}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.shareScroll}
            showsHorizontalScrollIndicator={false}
          />

          <TouchableOpacity style={styles.actionButton} onPress={() => setLike(!like)}>
            <Text style={styles.actionText}>Beğen</Text>
            {like ? <SvgLikeFill /> : <SvgLike />}
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Profili Gör</Text>
            <SvgEye/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={[styles.actionText, {color: '#E33629'}]}>Şikayet Et</Text>
            <SvgAttention/>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setModalVisible(false)}>
            <Text style={styles.actionText}>İlgilenmiyorum</Text>
            <SvgEyes/>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ShareBottomSheet;

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
  },
  share: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 25,
    position: 'relative',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
  },
  closeBtn: {
    width: 24,
    height: 24,
  },
  shareButton: {
    alignItems: 'center',
  },
  shareText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: '500',
    marginBottom:10,
    textAlign:"center",
  },
  shareScroll:{
    gap:17,
    borderBottomColor: "#F1F1F1",
    borderBottomWidth:1,
    marginVertical:10
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent:"space-between"
  },
  actionText: {
    fontSize: 20,
    marginLeft: 10,
    fontWeight:"600"
  },
});
