import { useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Notifications/Header';
import { height, notifications as initialNotifications, width } from '../../utils/helpers';
import SvgComment from "../../assets/commentNoti";
import SvgLikeNoti from "../../assets/likeNoti";
import SvgFollow from "../../assets/follow";
import Loader from '../../components/Loader';

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

const NotificationItem = ({ item, onPress }) => {
  const getNotificationText = () => {
    switch (item.type) {
      case 'follow':
        return 'seni takip etti';
      case 'like':
        return 'gönderini beğendi';
      case 'comment':
        return 'gönderine yorum yaptı';
      case 'mention':
        return 'seni bir gönderiye etiketledi';
      default:
        return '';
    }
  };

  const getNotificationIcon = () => {
    switch (item.type) {
      case 'follow':
        return <SvgFollow style={styles.notificationIcon}/>;
      case 'like':
        return <SvgLikeNoti style={styles.notificationIcon}/>;
      case 'comment':
        return <SvgComment style={styles.notificationIcon}/>;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.notificationItem, !item.isRead && styles.unreadNotification]} 
      activeOpacity={0.7} 
      onPress={() => onPress(item.id)}
    >
      <View style={styles.imageContainer}>
        <Image source={item.user.profileImage} style={styles.profileImage} />
        {getNotificationIcon()}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.userName}>
          {item.user.name} <Text style={styles.actionText}>{getNotificationText()}</Text>
        </Text>
        <Text style={styles.timestamp}>{formatTimeAgo(item.timestamp)}</Text>
      </View>
      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
};



const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
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
        setNotifications([...notifications])
        setLoading(false);
        setRefreshing(false);
      }, 1500); 
    }
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <NotificationItem item={item} onPress={markAsRead} />}
        contentContainerStyle={{ marginTop: 10 }}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        refreshControl={null}
        ListHeaderComponent={
          loading ? (
            <Loader/>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
    marginHorizontal: 20,
  },
  profileImage: {
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: 30,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    gap: 7,
  },
  userName: {
    fontWeight: '600',
    fontSize: 14,
  },
  actionText: {
    fontWeight: '400',
    fontSize: 14,
  },
  timestamp: {
    fontSize: 14,
    color: '#9D9C9C',
    fontWeight: "500",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: '#D134AA',
    position: 'absolute',
    right: 5,
  },
  notificationIcon: {
    position: "absolute",
    bottom: -2, 
    right: 5, 
  },
  imageContainer: {
    position: "relative",
  },
});
