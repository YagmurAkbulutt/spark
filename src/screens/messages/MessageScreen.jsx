import {Text, SafeAreaView, StyleSheet} from 'react-native';
import Header from '../../components/Message/Header';
import {height} from '../../utils/helpers';
import MessageList from './MessageListScreen';

const MessageScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Text style={styles.text}>Mesajlar</Text>
      <MessageList />
    </SafeAreaView>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFF',
    flex: 1,
    height: height * 0.85,
  },
  text: {
    marginTop: 25,
    fontSize: 16,
    marginBottom: 15,
    fontWeight: '600',
    marginHorizontal: 20,
  },
});
