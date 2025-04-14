import {FlatList,Keyboard,StyleSheet,Text,TextInput,TouchableOpacity,TouchableWithoutFeedback,View,} from 'react-native';
import SvgSearch from '../../assets/searchpeople';
import {width} from '../../utils/helpers';
import {useEffect, useState} from 'react';
import SvgBack from '../../assets/back';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBrands, toggleBrandSelection } from '../../redux/slices/brandSlice';
import { toggleBrandWithProduct } from '../../redux/features/productLink';
import { setProductBrand } from '../../redux/slices/productLinkSlice';

const BrandSearchScreen = ({route}) => {
  const navigation = useNavigation()
  const [searchText, setSearchText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const availableBrands = useSelector(state => state.brands.availableBrands);
  const { currentProduct } = useSelector(state => state.productLink);
  const dispatch = useDispatch();
  const selectedBrands = useSelector(state => state.brands.selectedBrands);
  
  const filteredBrands = availableBrands
  .filter(brand => {
    return brand.name.toLowerCase().includes(searchText.toLowerCase());
  })
  .sort((a, b) => {
    const aIndex = a.name.toLowerCase().indexOf(searchText.toLowerCase());
    const bIndex = b.name.toLowerCase().indexOf(searchText.toLowerCase());
    
    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }
    
    return a.name.length - b.name.length;
  });
  
    useEffect(() => {
      if (route.params?.selectedBrands) {
        dispatch(setSelectedBrands(route.params.selectedBrands));
        
        if (route.params.selectedBrands.length > 0) {
          const lastSelectedBrand = route.params.selectedBrands[route.params.selectedBrands.length - 1];
          dispatch(setProductBrand(lastSelectedBrand.name)); 
        }
      }
    }, [dispatch, route.params?.selectedBrands]);

   const handleToggleBrand = (brand) => {
    dispatch(toggleBrandWithProduct(brand));
    dispatch(setProductBrand(brand.name));
  };

  const handleGoBack = () => {
    navigation.navigate('PostConfirm');
  };
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      {/* Search Alanı */}
      <View style={styles.searchRow}>
        <TouchableOpacity activeOpacity={0.7} onPress={handleGoBack}>
          <SvgBack />
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <SvgSearch style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Marka ara"
            placeholderTextColor="#BBBBBB"
            onChangeText={text => setSearchText(text)}
            value={searchText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            selectionColor="#D134AA"
          />
        </View>
      </View>

      {/* Marka Listesi */}
      <FlatList
        data={filteredBrands}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[
              styles.brandItem,
              selectedBrands?.some(b => b.id === item.id) && styles.selectedBrandItem
            ]}
            onPress={() => handleToggleBrand(item)}
          >
            <Text
              style={[
                styles.brandText,
                selectedBrands?.some(b => b.id === item.id) && styles.selectedBrandText
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  </TouchableWithoutFeedback>
  );
};

export default BrandSearchScreen;


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      paddingTop: 20,
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center', 
      width: '100%', 
      marginTop:50,
      paddingHorizontal:16,
      height:60
    },
    searchContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 30,
      borderWidth: 1,
      borderColor: '#000',
      paddingHorizontal: 16, 
      height: 44, 
      marginLeft:10
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: '#000',
      fontWeight: '500',
      padding: 0, 
      margin: 0, 
      includeFontPadding: false, 
      textAlignVertical: 'center', 
    },
    listContainer: {
      marginTop: 25,
    },
    brandItemContainer: {
      width: '100%',
    },
    brandItem: {
      paddingVertical: 15,
      backgroundColor: '#F0F0F0',
      height: 47,
      width: '100%',
    },
    brandText: {
      marginHorizontal: 23,
      fontWeight: '300',
      fontSize: 14,
      color: '#000000',
    },
    separator: {
      height: 2, // Markalar arası boşluk
      backgroundColor: 'transparent', // Boşluk rengi
    },
    selectedBrandItem: {
      backgroundColor: '#000000',
    },
    selectedBrandText: {
      color: '#FFFFFF',
    },
  });

