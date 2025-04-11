import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  RefreshControl,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {dismissKeyboard, height, messageList, width} from '../../utils/helpers';
import UserInfo from '../../components/Chat/UserInfo';
import Header from '../../components/Chat/Header';
import SvgAddImage from '../../assets/addImage';
import SvgSendBtn from '../../assets/sendBtn';
import {useEffect, useRef, useState} from 'react';
import Loader from '../../components/Loader';

const ChatScreen = () => {
  const flatListRef = useRef(null);

  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({animated: true});
      }, 500);
    }
  }, [messages]);

  const scrollToEnd = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({animated: true});
    }
  };
  const route = useRoute();
  const {messageId} = route.params;
  const {userInfo} = route.params || {};

  const selectedMessage = messageList.find(item => item.id === messageId);

  const lastMessage =
    selectedMessage.messages[selectedMessage.messages.length - 1];
  const lastMessageDate = new Date(lastMessage.timestamp);
  const formattedDate = lastMessage
    ? `${lastMessageDate.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: 'short',
      })}, ` +
      lastMessageDate
        .toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'Europe/Istanbul',
        })
        .replace(/^(\d{2}):(\d{2})\s(Ö[ÖS])$/, '$1:$2 $3')
    : '';

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [messages, setMessages] = useState(selectedMessage.messages);

  const onScroll = event => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    if (contentOffsetY < -100 && !loading) {
      setLoading(true);
      setRefreshing(true);
      setTimeout(() => {
        setMessages([...messageList]);
        setLoading(false);
        setRefreshing(false);
      }, 1500);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setLoading(true);
    setTimeout(() => {
      setMessages([...messageList]);
      setLoading(false);
      setRefreshing(false);
    }, 1500);
  };
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim().length > 0) {
      const newMsg = {
        id: messages.length + 1,
        text: newMessage,
        timestamp: new Date().getTime(),
        isMe: true,
      };
      setMessages(prevMessages => [...prevMessages, newMsg]);
      setNewMessage('');

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({animated: true});
      }, 300);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 60}>
      <TouchableWithoutFeedback onPress={dismissKeyboard} >
        <SafeAreaView style={styles.container}>
          <Header userInfo={userInfo} />

          <View style={{flex: 1}}>
            {loading && (
              <View style={styles.loaderContainer}>
                <Loader />
              </View>
            )}
            

            <FlatList
              data={selectedMessage.messages}
              keyExtractor={(item, index) => index.toString()}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
              onScroll={onScroll}
              scrollEnabled={true}
              onContentSizeChange={scrollToEnd}
              nestedScrollEnabled={false}
              ref={flatListRef}
              onLayout={scrollToEnd}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["transparent"]}
                  tintColor="transparent"
                />
              }
              ListHeaderComponent={
                <>
                  <UserInfo userInfo={userInfo} />
                  <Text style={styles.lastMessageDate}>{formattedDate}</Text>
                </>
              }
              renderItem={({item, index}) => {
                const isLastMessage =
                  !item.isMe && index === selectedMessage.messages.length - 1;

                return (
                  <View
                    style={[
                      styles.messageContainer,
                      item.isMe
                        ? styles.myMessageContainer
                        : styles.otherMessageContainer,
                    ]}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      {!item.isMe && (
                        <Image
                          source={isLastMessage ? userInfo?.userImage : null}
                          style={
                            isLastMessage
                              ? styles.userAvatar
                              : styles.emptyAvatar
                          }
                        />
                      )}
                      <View
                        style={[
                          styles.messageBubble,
                          item.isMe ? styles.myMessage : styles.otherMessage,
                        ]}>
                        <Text style={styles.messageText}>{item.text}</Text>
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          </View>

          {/* Input Alanı */}
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.inputBtn} activeOpacity={0.5}>
              <SvgAddImage />
            </TouchableOpacity>
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              style={styles.placeholder}
              placeholder="Mesaj yaz..."
              selectionColor="#D134AA"
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              style={styles.inputBtn}
              activeOpacity={0.5}>
              <SvgSendBtn />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  loaderContainer: {
    top: 0, 
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  lastMessageDate: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9D9C9C',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 35,
    marginBottom: 10,
  },
  messageContainer: {
    marginHorizontal: 7,
  },
  userAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 7,
    alignSelf: 'center',
  },
  emptyAvatar: {
    width: 30,
    height: 30,
    marginRight: 7,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 10,
    margin: 5,
    borderRadius: 10,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F1F1',
    borderRadius: 52,
  },
  messageText: {
    color: '#181818',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 59,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
    width: width * 0.88,
    height: height * (Platform.OS === 'android' ? 0.06 : 0.05),
    left: '6%',
  },
  placeholder: {
    flex: 1,
    fontWeight: '500',
    paddingVertical: 8,
  },
  inputBtn: {
    padding: 8,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },
});

