import { View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import SvgBack from "../../assets/back"
import SvgMenu from "../../assets/hamburgerMenu"
import ProfileInfo from '../Profile/ProfileInfo';
import SearchProfileHidden from './SearchProfileHidden';
import FollowCard from '../Home/FollowCard';
import { users } from '../../utils/helpers';
import { useMemo, useState } from 'react';
import SearchProfileDetail from './SearchProfileDetail';
import { ScrollView } from 'react-native-gesture-handler';

const SearchProfile = ({ user, closeModal }) => {
  const [isFollowing, setIsFollowing] = useState(users[user.id])
  if (!user) return null; 

  const randomUser = useMemo(() => {
    return users[Math.floor(Math.random() * users.length)];
  }, []);

  const toggleFollow = () => {
    setIsFollowing((prev) => !prev);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={closeModal}>
          <SvgBack/>
        </TouchableOpacity>
        <TouchableOpacity>
          <SvgMenu/>
        </TouchableOpacity>
      </View>
      
      <ProfileInfo user={user} toggleFollow={toggleFollow} isFollowing={isFollowing}/>
      {isFollowing ? <SearchProfileDetail /> : (
        <>
          <SearchProfileHidden />
          <FollowCard randomUser={randomUser} />
        </>
      )}
    </ScrollView>
  );
};

export default SearchProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#FFFFFF",
    marginTop:60
  },
  header:{
    flexDirection:"row",
    justifyContent:"space-between",
    marginHorizontal:20,
    marginTop:10

  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userHandle: {
    fontSize: 18,
    color: 'gray',
  },
  
});
