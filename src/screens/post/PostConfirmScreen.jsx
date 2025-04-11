import {View, Image, TouchableOpacity, Text, StyleSheet} from 'react-native';
import SvgBack from '../../assets/back';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import SearchComponent from '../../components/Post/CategorySearchComponent';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { addPost } from '../../redux/slices/userSlice';
import { useFocusEffect } from '@react-navigation/native';
import { height } from '../../utils/helpers';
import CategorySearchComponent from '../../components/Post/CategorySearchComponent';

const PostConfirmScreen = ({route, navigation}) => {
  const dispatch = useDispatch();
  const { photoUri: initialPhotoUri } = route.params; 

const [photoUri, setPhotoUri] = useState(initialPhotoUri);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [poll, setPoll] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [mentions, setMentions] = useState('');
  const [category, setCategory] = useState('');



  const handlePost = () => {
    const newPost = {
      id: Date.now(),
    photo: "https://via.placeholder.com/150",
    title: "Yeni Post",
    description: "Bu bir test gönderisidir.",
    category: { name: "ceket", brand: "Apple", color: "Siyah" },
    poll: null,
    tags: ["React", "Redux"],
    mentions: ["@kullanici"],
    };
    console.log("Post dispatch ediliyor:", newPost);
dispatch(addPost(newPost)); 

    setPhotoUri(null);
    setTitle('');
    setDescription('');
    setPoll('');
    setHashtags('');
    setMentions('');
    setCategory('');

    navigation.navigate('Home');
  };




  const closeScreen = () => {
    setCategory('');
  setPoll('');
  setHashtags('');
  setMentions('');
  setTitle('');
  setDescription('');
    navigation.goBack();
  };

  return (
    <ScrollView style={{backgroundColor: '#FFFFFF', flex: 1}}>
      <TouchableOpacity onPress={closeScreen} style={styles.closeButton}>
        <SvgBack />
      </TouchableOpacity>

      <View style={styles.intContainer}>
        <Image source={{uri: photoUri}} style={styles.image} />
        <View style={styles.inputContainer}>
          <View>
            <TextInput
              style={styles.firstInput}
              placeholder="Bir başlık ekleyin"
              placeholderTextColor="#000000"
              
            />
            <TextInput
              style={styles.secondInput}
              placeholderTextColor="#9D9C9C"
              multiline={true} 
              numberOfLines={3}
              placeholder="Yarattığın tarz hakkında bir açıklama yaz veya anket ekle"
            />
          </View>
          <View style={styles.buttonContainer}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => setPoll('Anket eklendi')}>
          <Text style={styles.button}>Anket</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} onPress={() => setHashtags('#Etiket')}>
          <Text style={styles.button}>#Etiket</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} onPress={() => setMentions('@Bahset')}>
          <Text style={styles.button}>@Bahset</Text>
        </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.border} />

      
      <CategorySearchComponent/>

      <TouchableOpacity onPress={handlePost} style={styles.shareBtn}>
          <Text style={styles.shareText}>Paylaş</Text>
        </TouchableOpacity>


      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 60,
  },
  image: {
    width: 105,
    height: 150,
    resizeMode: 'contain',
    aspectRatio:0.7,
    borderRadius: 4,
  },
  intContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 20,
  },
  border: {
    width: '100%',
    height: 1,
    backgroundColor: '#F1F1F1',
    marginTop: 45,
  },
  inputContainer: {
    marginRight: 20,
    justifyContent: 'space-between',
  },
  firstInput: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondInput: {
    height: 70,
    marginRight: 20,
    width: 230,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    backgroundColor: '#000000',
    color: 'white',
    width: 65,
    height: 22,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    lineHeight: 22,
    borderRadius: 4,
    fontSize: 11,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 35,
    paddingHorizontal: 10,
    height: 40,
    width: 353,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 23,
    marginTop: 15,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingLeft: 5,
  },
  shareBtn: {
    backgroundColor: "#000000",
    height: height * 0.05,
    marginHorizontal: 23,
    borderRadius: 4,
    marginTop: 10,
    justifyContent: "center", 
    alignItems: "center", 
  },
  
  shareText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 16,
  },
});

export default PostConfirmScreen;
