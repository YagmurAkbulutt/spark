import {View, Image, TouchableOpacity, Text, StyleSheet, Alert} from 'react-native';
import SvgBack from '../../assets/back';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useRef, useState } from 'react';
import { addPost } from '../../redux/slices/userSlice';
import { height } from '../../utils/helpers';
import CategorySearchComponent from '../../components/Post/CategorySearchComponent';
import { clearSelectedBrands } from '../../redux/slices/brandSlice';
import { clearSelectedColors } from '../../redux/slices/colorSlice';
import {  setPoll, setTitle,  updateDesc, 
  insertTag, 
  insertMention,  
  deleteTag,
  deleteMention,
  setMentions,
  setTags,
  addMention,
  addTag} from '../../redux/slices/postDetailSlice';
  import { debounce } from 'lodash'
import { createPost } from '../../redux/actions/postCreateActions';

const PostConfirmScreen = ({route, navigation}) => {
  const dispatch = useDispatch();
  const photoUri = useSelector(state => state.photo.photoUri);
  const selectedBrands = useSelector(state => state.brands.selectedBrands);
  const selectedColors = useSelector(state => state.colors.selectedColors)
  const productLink = useSelector((state) => state.productLink.productLink);
  const descriptionInputRef = useRef(null);
  const [description, setDescription] = useState('');
  const postData = useSelector(state => state.postDetail.postData);
  const [titleInput, setTitleInput] = useState('');
  const { currentProduct, clothingLinks } = useSelector(state => state.productLink);

  // Seçili markaları console'a yazdır
  useEffect(() => {
    console.log("Seçilen markalar, renkler:, link", productLink, selectedBrands, selectedColors);
  }, [selectedBrands,selectedColors, productLink]);
   // Redux state'ini konsola yazdırma fonksiyonu
   useEffect(() => {
    console.log('--- REDUX STATE UPDATE ---');
    console.log('Title:', postData.title);
    console.log('Description:', postData.description);
    console.log('Tags:', postData.tags);
    console.log('Mentions:', postData.mentions);
    console.log('Poll:', postData.poll);
    console.log('-------------------------');
  }, [postData])


  useEffect(() => {
    return () => {
      dispatch(clearSelectedBrands());
      dispatch(clearSelectedColors());
    };
  }, []);
  
//   const handlePost = () => {
//     const newPost = {
//       id: Date.now(),
//     photo: "https://via.placeholder.com/150",
//     title: "Yeni Post",
//     description: "Bu bir test gönderisidir.",
//     category: { name: "ceket", brand: "Apple", color: "Siyah" },
//     poll: null,
//     tags: ["React", "Redux"],
//     mentions: ["@kullanici"],
//     };
//     console.log("Post dispatch ediliyor:", newPost);
// dispatch(addPost(newPost)); 

//     // setPhotoUri(null);
//     setTitle('');
//     setDescription('');
//     setPoll('');
//     setHashtags('');
//     setMentions('');
//     setCategory('');

//     navigation.navigate('Home');
//   };

const closeScreen = () => {
    navigation.goBack();
  };



  
  // const [descriptionInput, setDescriptionInput] = useState('');

  // Başlık değiştiğinde
  const handleTitleChange = (text) => {
    console.log('Başlık değişti:', text);
    setTitleInput(text);
    dispatch(setTitle(text));
  };


  // Anket ekleme
  const handleAddPoll = () => {
    const newPoll = { 
      question: 'Yeni anket', 
      options: ['Seçenek 1', 'Seçenek 2'] 
    };
    console.log('Anket eklendi:', newPoll);
    dispatch(setPoll(newPoll));
  };


 

  
     // Etiket ekleme fonksiyonu (YENİ İSİM)
  const handleAddTag = () => {
    const newText = description + ' #';
    setDescription(newText);
    dispatch(updateDesc(newText));
    descriptionInputRef.current.focus();
  };

  // Bahset ekleme fonksiyonu (YENİ İSİM)
  const handleAddMention = () => {
    const newText = description + ' @';
    setDescription(newText);
    dispatch(updateDesc(newText));
    descriptionInputRef.current.focus();
  };



  const handleDescriptionChange = (text) => {
    setDescription(text);
    dispatch(updateDesc(text));
  };
  const { tags } = useSelector(state => state.postDetail.postData);

  const handleSharePost = async () => {
    try {
      const postData = new FormData();
      
      // Resim ekleme
      if (photoUri) {
        postData.append('postImage', {
          uri: photoUri,
          name: 'post_image.jpg',
          type: 'image/jpeg'
        });
      }
  
      // Diğer alanlar
      postData.append('description', description || '');
      
      if (tags?.length) {
        postData.append('tags', tags.join(','));
      }
  
      // 1. currentProduct kontrolü
      console.log("Current Product:", JSON.stringify(currentProduct, null, 2));
      
      // 2. clothingLinks kontrolü
      console.log("All Clothing Links:", JSON.stringify(clothingLinks, null, 2));
  
      // 3. clothingLinks verisi ekleme
      if (currentProduct.url) {
        postData.append('clothingLinks', JSON.stringify([{
          url: currentProduct.url,
          title: currentProduct.title || 'Ürün Başlığı',
          type: currentProduct.type || 'product',
          price: currentProduct.price,
          brand: currentProduct.brand,
          yakaType: currentProduct.yakaType,
          color: currentProduct.color
        }]));
        console.log("Added currentProduct as clothingLink");
      } else if (clothingLinks.length > 0) {
        postData.append('clothingLinks', JSON.stringify(clothingLinks));
        console.log("Added all clothingLinks:", clothingLinks.length);
      } else {
        console.warn("No product data - clothingLinks will be empty.");
      }
  
      // Ek alanlar
      if (selectedBrands && selectedBrands.length > 0) {
        postData.append('brands', selectedBrands.join(','));
      }
  
      if (selectedColors && selectedColors.length > 0) {
        postData.append('colors', selectedColors.join(','));
      }
  
      // Debug için
      console.log('FormData contents:');
      for (let [key, value] of postData._parts) {
        console.log(key, value);
      }
  
      // Post isteği gönderme
      await dispatch(createPost(postData)).unwrap();
      Alert.alert('Success', 'Post shared successfully!');
      
    } catch (error) {
      console.error('Post creation failed:', error);
      Alert.alert('Error', 'Failed to share post: ' + error.message);
    }
  };
  

  console.log('Debugging data:');
console.log('photoUri:', photoUri);
console.log('description:', description);
console.log('tags:', tags);
console.log('productLink:', productLink);
console.log('selectedBrands:', selectedBrands);
console.log('selectedColors:', selectedColors);
  



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
              value={titleInput}
              onChangeText={handleTitleChange}
            />
            {/* <TextInput
              style={styles.secondInput}
              placeholderTextColor="#9D9C9C"
              multiline={true} 
              numberOfLines={3}
              placeholder="Yarattığın tarz hakkında bir açıklama yaz veya anket ekle"
              value={descriptionInput}
              onChangeText={handleDescriptionChange}
            /> */}
             <TextInput
              ref={descriptionInputRef}
              style={styles.secondInput}
              placeholderTextColor="#9D9C9C"
              multiline={true}
              numberOfLines={3}
              placeholder="Yarattığın tarz hakkında bir açıklama yaz veya anket ekle"
              value={description}
              onChangeText={handleDescriptionChange}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity activeOpacity={0.7} onPress={handleAddPoll}>
              <Text style={styles.button}>Anket</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={handleAddTag}>
              <Text style={styles.button}>#Etiket</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={handleAddMention}>
              <Text style={styles.button}>@Bahset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.border} />

      
      <CategorySearchComponent/>

      <TouchableOpacity  style={styles.shareBtn} onPress={handleSharePost}>
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
    // marginHorizontal: 23,
    // borderRadius: 4,
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
