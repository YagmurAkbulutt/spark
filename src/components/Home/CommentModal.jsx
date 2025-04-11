import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  Keyboard,
  Easing,
} from 'react-native';
import {
  commentsData,
  dismissKeyboard,
  height,
  width,
} from '../../utils/helpers';
import SvgLess from '../../assets/less';
import SvgLike from '../../assets/like-s';
import SvgLikeFill from '../../assets/likeFill-s';
import SvgSendBtn from '../../assets/sendBtn';

const CommentModal = ({commentModal, setCommentModal,onSubmitComment}) => {
  const [comments, setComments] = useState(commentsData);
  const [newComment, setNewComment] = useState('');
  const [expandedComments, setExpandedComments] = useState({});
  const [replyingTo, setReplyingTo] = useState(null); 
  const emojis = ["👏", "🙌", "😎", "😍", "❤️‍🔥", "🫵"];
  const [commentText, setCommentText] = useState('');

  const [keyboardHeight, setKeyboardHeight] = useState(new Animated.Value(0));

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", (event) => {
      const { height } = event.endCoordinates;
      setKeyboardHeight(height);
      
      Animated.timing(animatedHeight, {
        toValue: height * 0.6 - height * 0.1, // Klavye yüksekliğine göre ayarla
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    });

    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
      Animated.timing(animatedHeight, {
        toValue: height * 0.6,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  
  



  const addEmojiToInput = (emoji) => {
    setNewComment(prev => prev + emoji); 
  };
  const toggleLike = (commentId, replyId = null) => {
    setComments(prevComments => 
      prevComments.map(comment => {
        if (comment.id === commentId) {
          if (replyId) {
            // Eğer alt yorumsa, replies içindeki ilgili reply'yi bul
            return {
              ...comment,
              replies: comment.replies.map(reply => {
                if (reply.id === replyId) {
                  return {
                    ...reply,
                    liked: !reply.liked, // Alt yorumun beğeni durumunu değiştir
                    likes: reply.liked ? reply.likes - 1 : reply.likes + 1, // Beğeni sayısını güncelle
                  };
                }
                return reply;
              })
            };
          } else {
            // Ana yorumun beğeni durumunu değiştir
            return {
              ...comment,
              liked: !comment.liked,
              likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
            };
          }
        }
        return comment;
      })
    );
  };

    // Yorum gönderildiğinde
    const handleSubmit = () => {
      if (commentText.trim()) {
        onSubmitComment(commentText);
        setCommentText(''); 
      }
    };
  

  const toggleReplies = commentId => {
    setExpandedComments(prevState => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  const addComment = () => {
    if (newComment.trim() !== '') {
      const newReply = {
        id: `${Date.now()}`, 
        user: 'minealada',
        text: newComment,
        avatar: require('../../assets/profilePhoto.png'),
        likes: 0,
        liked: false,
      };

      if (replyingTo) {
        setComments(prevComments =>
          prevComments.map(comment =>
            comment.id === replyingTo
              ? {...comment, replies: [...comment.replies, newReply]}
              : comment,
          ),
        );
      } else {
        // Yanıtlanmamışsa, ana yorumlara ekleniyor
        setComments(prevComments => [
          ...prevComments,
          {
            id: `${Date.now()}`, 
            user: 'minealada',
            text: newComment,
            avatar: require('../../assets/profilePhoto.png'),
            likes: 0,
            liked: false,
            replies: [], 
          },
        ]);
      }
      
      setNewComment('');
      setReplyingTo(null); 
    }
  };

  const formatLikes = num => {
    if (num === 0) return '';
    if (num >= 1_000_000) {
      const formatted = (num / 1_000_000).toFixed(1).replace('.', ',');
      return formatted.endsWith(',0') ? formatted.slice(0, -2) + ' M' : formatted + ' M';
    } else if (num >= 1_000) {
      const formatted = (num / 1_000).toFixed(1).replace('.', ',');
      return formatted.endsWith(',0') ? formatted.slice(0, -2) + ' B' : formatted + ' B';
    } else {
      return num.toString();
    }
  };
  
  const overlayStyle = commentModal
  ? { backgroundColor: 'rgba(0, 0, 0, 0.7)' }  // Modal açık
  : { backgroundColor: 'rgba(0, 0, 0, 0.5)' }; 
  const [fadeAnim] = useState(new Animated.Value(0)); // Opaklık için animasyon değeri

  useEffect(() => {
    if (commentModal) {
      // Modal açıldığında yavaşça görünür hale gelsin
      Animated.timing(fadeAnim, {
        toValue: 1, // Tam görünürlük
        duration: 1000, // 800ms süresince animasyon
        useNativeDriver: false,
      }).start();
    } else {
      // Modal kapanırken yavaşça kaybolsun
      Animated.timing(fadeAnim, {
        toValue: 0, // Opaklığı 0 yapalım
        duration: 1000, // 800ms süresince animasyon
        useNativeDriver: false,
      }).start();
    }
  }, [commentModal]);
  const [slideAnim] = useState(new Animated.Value(500)); // Animasyon için kayma başlangıcı

  useEffect(() => {
    if (commentModal) {
      
      Animated.timing(slideAnim, {
        toValue: 0, 
        duration: 800, 
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    } else {
      
      Animated.timing(slideAnim, {
        toValue: 500, 
        duration: 800, 
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    }
  }, [commentModal]);

  const animatedHeight = useRef(new Animated.Value(height * 0.85)).current;
  
  return (
//     <Modal
//   animationType="none"
//   transparent={true}
//   visible={commentModal}
//   onRequestClose={() => setCommentModal(false)}
// >
//   <TouchableWithoutFeedback onPress={() => setCommentModal(false)}>
//   <View
//           style={{
//             flex: 1,
//             justifyContent: "flex-end",
//             backgroundColor: "rgba(0, 0, 0, 0.5)", 
//             position: 'absolute', 
//             top: 0, 
//             left: 0,
//             right: 0, 
//             bottom: 0, 
//           }}
//         >
//     <Animated.View
//       style={{
//         transform: [{ translateY: slideAnim }],
//         // flex: 1,
//         // justifyContent: "flex-end",
//         // ...overlayStyle,
//         bottom: keyboardHeight, 
//       }}
//     >
//         {/* <View style={styles.overlay}> */}
//         <View style={styles.modalContainer}>
//               <View style={styles.commentHeader}>
//                 <Text style={styles.title}>Yorumlar</Text>
//                 <TouchableOpacity
//                   onPress={() => setCommentModal(false)}
//                   activeOpacity={0.7}
//                   style={styles.closeButton}>
//                   <SvgLess style={styles.closeBtn} />
//                 </TouchableOpacity>
//               </View>

//               <FlatList
//                 data={comments}
//                 keyExtractor={item => item.id.toString()}
//                 showsVerticalScrollIndicator={false}
//                 renderItem={({item}) => (
//                   <View style={{marginBottom: 20}}>
//                     <View style={styles.comment}>
//                       <Image
//                         source={item.avatar || item.profilePhoto}
//                         style={styles.commentProfilePhoto}
//                       />
//                       <View style={styles.commentBody}>
//                         <View style={{gap: 2}}>
//                           <Text style={styles.username}>{item.user}</Text>
//                           <Text style={styles.text}>{item.text}</Text>
//                         </View>

//                         <TouchableOpacity
//                           onPress={() => toggleLike(item.id)}
//                           style={styles.likeButton}>
//                           {item.liked ? <SvgLikeFill /> : <SvgLike />}
//                           <Text style={styles.likeText}>
//                             {formatLikes(item.likes)}
//                           </Text>
//                         </TouchableOpacity>
//                       </View>
//                     </View>
//                     <TouchableOpacity onPress={() => setReplyingTo(item.id)}>
//                       <Text style={styles.comText}>Yanıtla</Text>
//                     </TouchableOpacity>

//                     {item.replies.length > 0 && !expandedComments[item.id] && (
//                       <TouchableOpacity
//                         onPress={() => toggleReplies(item.id)}
//                         style={styles.showRepliesButton}>
//                         <Text style={styles.showRepliesText}>
//                           {item.replies.length} diğer yorumu gör
//                         </Text>
//                       </TouchableOpacity>
//                     )}

//                     {expandedComments[item.id] && (
//                       <FlatList
//                         data={item.replies}
//                         keyExtractor={reply => reply.id}
//                         renderItem={({item: reply}) => (
//                           <View style={styles.replyContainer}>
//                             <Image
//                               source={reply.avatar || reply.profilePhoto}
//                               style={styles.replyAvatar}
//                             />
//                             <View style={styles.replyComment}>
//                               <View>
//                               <Text style={styles.username}>{reply.user}</Text>
//                               <Text style={styles.text}>{reply.text}</Text>
//                               </View>
//                               <TouchableOpacity
//             onPress={() => toggleLike(item.id, reply.id)} 
//             style={styles.likeButton}>
//             {reply.liked ? <SvgLikeFill /> : <SvgLike />}
//             <Text style={styles.likeText}>
//               {formatLikes(reply.likes)}
//             </Text>
//           </TouchableOpacity>
//                             </View>
//                           </View>
//                         )}
//                       />
//                     )}
//                   </View>
//                 )}
//               />
// <View style={styles.border}/>
// <View style={styles.emojiContainer}>
//   {emojis.map((emoji, index) => (
//     <TouchableOpacity key={index} onPress={() => addEmojiToInput(emoji)}>
//       <Text style={styles.emoji}>{emoji}</Text>
//     </TouchableOpacity>
//   ))}
// </View>


//               <View style={styles.commentInputContainer}>
//                 <Image
//                   source={require('../../assets/profilePhoto.png')}
//                   style={styles.userImage}
//                 />
//                 <TextInput
//                   style={styles.commentInput}
//                   placeholder="Yorum ekleyin..."
//                   value={newComment}
//                   onChangeText={setNewComment}
//                 />
//                 {newComment.trim() !== '' && (
//                   <TouchableOpacity
//                     onPress={addComment}
//                     style={styles.sendButton}>
//                     <SvgSendBtn />
//                   </TouchableOpacity>
//                 )}
//               </View>
//             </View>
//         {/* </View> */}
      
//     </Animated.View>
//     </View>
//   </TouchableWithoutFeedback>
// </Modal>
<Modal
  animationType="none"
  transparent={true}
  visible={commentModal}
  onRequestClose={() => setCommentModal(false)}>

<KeyboardAvoidingView
  behavior={Platform.OS === "ios" ? "padding" : "height"}
  style={{ flex: 1 }}>

    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();
      setCommentModal(false);
    }}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.modalContainer, { height: animatedHeight }]}>

          <View style={styles.commentHeader}>
            <Text style={styles.title}>Yorumlar</Text>
            <TouchableOpacity
              onPress={() => setCommentModal(false)}
              activeOpacity={0.7}
              style={styles.closeButton}>
              <SvgLess style={styles.closeBtn} />
            </TouchableOpacity>
          </View>
<View style={{flex:1}}>
          <FlatList
            data={comments}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={{flex: 1}}
            nestedScrollEnabled={true}
  overScrollMode="always"
  removeClippedSubviews={false}
  onEndReachedThreshold={0.5}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 20 }}>
                <View style={styles.comment}>
                  <Image
                    source={item.avatar || item.profilePhoto}
                    style={styles.commentProfilePhoto}
                  />
                  <View style={styles.commentBody}>
                    <View style={{ gap: 2 }}>
                      <Text style={styles.username}>{item.user}</Text>
                      <Text style={styles.text}>{item.text}</Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => toggleLike(item.id)}
                      style={styles.likeButton}>
                      {item.liked ? <SvgLikeFill /> : <SvgLike />}
                      <Text style={styles.likeText}>{formatLikes(item.likes)}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity onPress={() => setReplyingTo(item.id)}>
                  <Text style={styles.comText}>Yanıtla</Text>
                </TouchableOpacity>

                {item.replies.length > 0 && !expandedComments[item.id] && (
                  <TouchableOpacity
                    onPress={() => toggleReplies(item.id)}
                    style={styles.showRepliesButton}>
                    <Text style={styles.showRepliesText}>
                      {item.replies.length} diğer yorumu gör
                    </Text>
                  </TouchableOpacity>
                )}

                {expandedComments[item.id] && (
                  <FlatList
                    data={item.replies}
                    keyExtractor={reply => reply.id}
                    renderItem={({ item: reply }) => (
                      <View style={styles.replyContainer}>
                        <Image
                          source={reply.avatar || reply.profilePhoto}
                          style={styles.replyAvatar}
                        />
                        <View style={styles.replyComment}>
                          <View>
                            <Text style={styles.username}>{reply.user}</Text>
                            <Text style={styles.text}>{reply.text}</Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => toggleLike(item.id, reply.id)}
                            style={styles.likeButton}>
                            {reply.liked ? <SvgLikeFill /> : <SvgLike />}
                            <Text style={styles.likeText}>{formatLikes(reply.likes)}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  />
                )}
              </View>
            )}
          />
</View>
          <View style={styles.border} />

          <View style={styles.emojiContainer}>
            {emojis.map((emoji, index) => (
              <TouchableOpacity key={index} onPress={() => addEmojiToInput(emoji)}>
                <Text style={styles.emoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.commentInputContainer}>
            <Image
              source={require('../../assets/profilePhoto.png')}
              style={styles.userImage}
            />
            <TextInput
              style={styles.commentInput}
              placeholder="Yorum ekleyin..."
              value={newComment}
              onChangeText={setNewComment}
              selectionColor="#D134AA"
            />
            {newComment.trim() !== '' && (
              <TouchableOpacity onPress={addComment} style={styles.sendButton}>
                <SvgSendBtn />
              </TouchableOpacity>
            )}
          </View>

        </Animated.View>
      </View>
    </TouchableWithoutFeedback>

  </KeyboardAvoidingView>
</Modal>

  
  );
};

export default CommentModal;

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
  commentHeader: {
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
  userImage: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: 20,
    marginRight: 10,
  },
  commentProfilePhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  replyAvatar: {
    width: width * 0.09,
    height: width * 0.09,
    borderRadius: 17,
    marginRight: 10,
  },
  username: {
    fontWeight: '500',
    fontSize: 12,
  },
  likeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  likeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9D9C9C',
  },
  showRepliesButton: {
    marginTop: 7,
    marginLeft: 80,
  },
  showRepliesText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9D9C9C',
  },
  comText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9D9C9C',
    marginLeft: 50,
    marginTop: 5,
  },
  replyContainer: {
    flexDirection: 'row',
    marginTop: 15,
    marginLeft: 50,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 59,
    paddingHorizontal: 15,
    height: 44,
  },
  sendButton: {
    position: 'absolute',
    right: 15,
    marginTop: '3%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // replyInputContainer: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   marginTop: 10,
  //   borderTopWidth: 1,
  //   borderTopColor: "#ddd",
  //   paddingTop: 5,
  // },
  // replyInput: {
  //   flex: 1,
  //   borderWidth: 1,
  //   borderColor: "#ddd",
  //   borderRadius: 20,
  //   paddingHorizontal: 15,
  //   height: 40,
  // },
  // replySubmitButton: {
  //   marginLeft: 10,
  // },
  text: {
    maxWidth: 236,
    fontSize: 12,
    fontWeight: 400,
  },
  comment: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentBody: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  replyComment:{
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  border:{
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',

  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
    
    gap:38
  },
  emoji: {
    fontSize: 24,
  }
  
});