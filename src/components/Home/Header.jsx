import {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import SvgMessage from '../../assets/message';
import SvgNewMessage from '../../assets/messageNew';
import {messageList, width} from '../../utils/helpers';
import {useNavigation} from '@react-navigation/native';
import { MessageContext } from '../Message/MessageContext';

const Header = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Takip');
//   const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const { hasUnreadMessages } = useContext(MessageContext);

//   useEffect(() => {
//     // Okunmamış mesajları kontrol et
//     const unreadExists = messageList.some(chat =>
//       chat.messages.some(message => !message.isRead),
//     );
//     setHasUnreadMessages(unreadExists);
//   }, [messageList]);

  return (
    <SafeAreaView>
      <View style={styles.header}>
        {/* Sekmeler */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab('Takip')}
            style={styles.tabContainer}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'Takip' && styles.activeTabText,
              ]}>
              Takip
            </Text>
            {activeTab === 'Takip' && <View style={styles.underline} />}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('Sizin İçin')}
            style={styles.tabContainer}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'Sizin İçin' && styles.activeTabText,
              ]}>
              Sizin İçin
            </Text>
            {activeTab === 'Sizin İçin' && <View style={styles.underline} />}
          </TouchableOpacity>
        </View>

        {/* Mesaj İkonu */}
        <View style={styles.iconsContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Message')}>
            {hasUnreadMessages ? <SvgNewMessage /> : <SvgMessage />}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: width * 0.95,
    alignSelf: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  tabContainer: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: 'black',
  },
  underline: {
    width: '30%',
    height: 2,
    backgroundColor: 'black',
    marginTop: 2,
  },
  iconsContainer: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
});

export default Header;
