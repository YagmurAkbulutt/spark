import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import SvgNext from '../../assets/nextSm';
import {TextInput} from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { setProductUrl } from '../../redux/slices/productLinkSlice';
import { useDispatch, useSelector } from 'react-redux';
import { updateCategoryProduct } from '../../redux/slices/categoriesSlice';

const CategoryDetail = ({selectedCategory}) => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const { currentProduct } = useSelector((state) => state.productLink);
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{selectedCategory}</Text>
      <View style={styles.selectionContainer}>
        <TouchableOpacity style={styles.selection} activeOpacity={0.7}  onPress={() => navigation.navigate('BrandSearch')}>
          <Text style={styles.text}>Marka</Text>
          <SvgNext style={styles.button} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.selection} activeOpacity={0.7}  onPress={() => navigation.navigate('ColorPicker')}>
          <Text style={styles.text}>Renk</Text>
          <SvgNext style={styles.button} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.selection} activeOpacity={0.7}>
          <Text style={styles.text}>Yaka Tipi</Text>
          <SvgNext style={styles.button} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.selection} activeOpacity={0.7}>
        <TextInput
            placeholder="Ürün Linki"
            placeholderTextColor="#9D9C9C"
            style={styles.input}
            selectionColor="#D134AA"
            onChangeText={(text) => {
              dispatch(setProductUrl(text)); 
            }}
            value={currentProduct.url} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CategoryDetail;

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    flex:1
  },
  header: {
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 23,
    marginBottom: 10,
  },
  selectionContainer: {
    gap: 2,
  },
  selection: {
    backgroundColor: '#F0F0F0',
    height: 47,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    marginHorizontal: 23,
    fontWeight: '300',
    fontSize: 14,
  },
  button: {
    marginHorizontal: 23,
  },
  input: {
    backgroundColor: 'white',
    height:34,
    paddingHorizontal: 15,
    borderRadius: 20,
    fontSize: 14,
    color: '#000',
    marginHorizontal: 17, // Her iki yandan 23 birim boşluk
    flex: 1, // Kullanılabilir alanı tamamen doldurur
    justifyContent: 'center',
    includeFontPadding: false,
  }
});
