import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import {messageList} from '../../utils/helpers';
import {useNavigation} from '@react-navigation/native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import SvgTrash from '../../assets/trash';
import Loader from '../../components/Loader';
import { MessageContext } from '../../components/Message/MessageContext';
import LinearGradient from 'react-native-linear-gradient';

const formatTimeAgo = timestamp => {
  const now = new Date();
  const messageDate = new Date(timestamp);
  const diffInSeconds = Math.floor((now - messageDate) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `${diffInDays}g`;
  } else if (diffInHours > 0) {
    return `${diffInHours}s`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes}d`;
  } else {
    return `Şimdi`;
  }
};

const getDisplayMessage = (messages = [], isOpened) => {
  if (!Array.isArray(messages) || messages.length === 0) return 'Mesaj yok';

  const lastMessage = messages[messages.length - 1];
  const messageCount = messages.length;
  const timeAgo = formatTimeAgo(lastMessage.timestamp);

  let textPreview =
    lastMessage.text.length > 35
      ? lastMessage.text.substring(0, 30) + '...'
      : lastMessage.text;

  if (isOpened) {
    textPreview =
      lastMessage.text.length > 30
        ? lastMessage.text.substring(0, 30) + '...'
        : lastMessage.text;
  } else {
    if (messageCount === 1) {
      textPreview =
        lastMessage.text.length > 30
          ? lastMessage.text.substring(0, 30) + '...'
          : lastMessage.text;
    } else if (messageCount <= 3) {
      textPreview = `${messageCount} yeni mesaj`;
    } else {
      textPreview = '4+ yeni mesaj';
    }
  }

  return (
    <View style={styles.messageWrapper}>
      <Text style={[styles.messageText, isOpened && styles.readMessage]}>
        {textPreview}
      </Text>
      {!isOpened && (
        <>
          <Text style={styles.dot}> • </Text>
          <Text style={styles.timeAgo}>{timeAgo}</Text>
        </>
      )}
    </View>
  );
};



const MessageListScreen = () => {
  const [openedMessages, setOpenedMessages] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messages, setMessages] = useState(messageList);
  const [isLoading, setIsLoading] = useState(false); 
  const swipeableRefs = {};
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();
  const { markMessages, markAsRead } = useContext(MessageContext);

  const handlePress = (user) => {
    if (!openedMessages[user.id]) {
      setOpenedMessages(prev => ({
        ...prev,
        [user.id]: true, 
      }));
    }
    markAsRead(user.id);
    navigation.navigate('Chat', {
      messageId: user.id,
      userInfo: {
        userImage: user.userImage,
        name: user.name,
        username: user.username,
        followers: user.followers,
        post: user.post,
      }
    });
  };
  // const dispatch = useDispatch();
  // const messages = useSelector(state => state.messages.messages);
  // const openedMessages = useSelector(state => state.messages.openedMessages);
  // const [modalVisible, setModalVisible] = useState(false);
  // const [selectedMessage, setSelectedMessage] = useState(null);
  // const swipeableRefs = {};
  // const opacityAnim = useRef(new Animated.Value(1)).current;
  // const navigation = useNavigation();

  // const handlePress = (user) => {
  //   if (!openedMessages[user.id]) {
  //     dispatch(markAsRead(user.id));
  //   }
  //   navigation.navigate('Chat', {
  //     messageId: user.id,
  //     userInfo: {
  //       userImage: user.userImage,
  //       name: user.name,
  //       username: user.username,
  //       followers: user.followers,
  //       post: user.post,
  //     },
  //   });
  // };
  

  const handleDeletePress = id => {
    setSelectedMessage(id); 
    setModalVisible(true); 
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
    });
  };

  const confirmDelete = () => {
    if (selectedMessage !== null) {
      setMessages(prevMessages =>
        prevMessages.filter(item => item.id !== selectedMessage),
      );
    }
    setModalVisible(false);
    setSelectedMessage(null);
  };

  const cancelDelete = () => {
    setModalVisible(false);
    setSelectedMessage(null);

    if (selectedMessage && swipeableRefs[selectedMessage]) {
      swipeableRefs[selectedMessage]?.close(); 
    }
  };
  

  const renderRightActions = id => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleDeletePress(id)}>
      <SvgTrash style={styles.trash} />
    </TouchableOpacity>
  );
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onScroll = (event) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    if (Platform.OS === 'android') {
      return;
    }
    if (contentOffsetY < -100 && !loading) {
      setLoading(true);
      setRefreshing(true);
      setTimeout(() => {
        setMessages([...messageList])
        setLoading(false);
        setRefreshing(false);
      }, 1500); 
    }
  };
  
  

  return (
    <>
    
            <FlatList
  data={messages}
  keyExtractor={(item) => item.id.toString()}

  onScroll={onScroll}
  refreshControl={null}
  windowSize={21}
  ListHeaderComponent={loading ? <Loader /> : null}
  showsVerticalScrollIndicator={false}
  renderItem={({ item, index }) => {
    const isOpened = openedMessages[item.id] || false;
    const displayMessage = getDisplayMessage(item.messages, isOpened);
    console.log("props.children", displayMessage.props.children);


    
    return (
      <Swipeable
        ref={ref => (swipeableRefs[item.id] = ref)}
        renderRightActions={() => renderRightActions(item.id)}
        friction={2}
        overshootRight={false}
      >
        {index === 0 ? (
          // İlk öğe için LinearGradient kullan
          <>
          <LinearGradient
  start={{ x: 0, y: 0 }}
  end={{ x: 1.25, y: 0 }}
  colors={['#000000', '#D134AA']}
  style={styles.chatbotContainer}
>
  <TouchableOpacity 
    onPress={() => handlePress(item)} 
    style={styles.innerChatbotCont}
  >
    {/* Kullanıcı Resmi */}
    <Image source={item.userImage} style={styles.chatuserImage} />
    
    {/* Metin Konteyneri */}
    <View style={styles.chatbotTextContainer}>
      <Text style={styles.chatbotusername}>{item.username}</Text>
      
      <View style={styles.chatbotMessageRow}>
      <Text style={{ color: "white" }}>
  {Array.isArray(displayMessage.props.children)
    ? displayMessage.props.children
        .filter((child) => child) // false, null veya undefined olanları filtreliyoruz
        .map((child, index) =>
          typeof child === "string"
            ? child
            : React.cloneElement(child, {
                key: index,
                style: [
                  typeof child.props.style === "object" ? child.props.style : {},
                  { color: "white" },
                ],
              })
        )
    : displayMessage.props.children}
</Text>

      </View>
    </View>
  </TouchableOpacity>
</LinearGradient>

        </>


        ) : (
          // Diğer öğeler için varsayılan stil
          <TouchableOpacity onPress={() => handlePress(item)} style={styles.messageContainer}>
            <Image source={item.userImage} style={styles.userImage} />
            <View style={styles.textContainer}>
              
              <Text style={styles.username}>{item.username}</Text>
              <View style={styles.messageRow}>
              
                <Text style={[styles.message, !isOpened && styles.unreadMessage]}>
                  {displayMessage}
                </Text>
                {!isOpened && <View style={styles.unreadDot} />}
              </View>
            </View>
          </TouchableOpacity>
          
        )}
      </Swipeable>
    );
  }}
/>

      <Modal visible={modalVisible} transparent animationType="none">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Sohbeti kalıcı olarak sil?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={confirmDelete}>
                <Text style={styles.deleteButtonText}>Sil</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={cancelDelete}>
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
    backgroundColor: '#FFFF',
    marginHorizontal: 20,
  },
  chatbotContainer: {
    borderRadius: 59, 
    marginVertical: 5,
    overflow: 'hidden',
    marginHorizontal:20
  },
  innerChatbotCont: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  chatuserImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    top:"2%",
    left: 10
  },
  chatbotTextContainer: {
    flex: 1,
    justifyContent: 'center',
    top:"2%",
    left:5
  },
  chatbotusername: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E987D0',
  },
  chatbotMessageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatbotmessage: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  chatbotunreadMessage: {
    color: 'white', 
    fontSize: 14,
    fontWeight: '600',
  },

  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex:1
    
  },
  username: {
    fontWeight: '600',
    fontSize: 14,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  messageText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'black',
  },
  readMessage: {
    color: '#9D9C9C',
    fontWeight: '500',
  },
  dot: {
    fontSize: 14,
    color: '#9D9C9C',
    marginHorizontal: 3,
  },
  timeAgo: {
    fontSize: 14,
    color: '#9D9C9C',
  },
  messageWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: '#D134AA',
    position: 'absolute',
    right: -5,
    top: '50%',
    transform: [{translateY: -10}],
  },
  deleteButton: {
    backgroundColor: '#E33629',
    justifyContent: 'center',
    alignItems: 'center',
    width: 73,
    height: 80,
  },
  trash: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -7,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#F9F9F9',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    fontWeight: '600',
  },
  modalButtons: {
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#F1F1F1',
  },
  deleteButtonText: {
    color: '#E33629',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    fontSize: 16,
  },
});

export default MessageListScreen;