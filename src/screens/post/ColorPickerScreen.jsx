import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleColorSelection } from '../../redux/slices/colorSlice';
import { width } from '../../utils/helpers';
import SvgBack from "../../assets/back.js"
import { useNavigation } from '@react-navigation/native';
import { setColor } from '../../redux/slices/productLinkSlice.js';

const ITEM_SIZE = width / 4;

const ColorPickerScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const selectedColors = useSelector(state => state.colors.selectedColors);
  const availableColors = useSelector(state => state.colors.availableColors);
  const { currentProduct } = useSelector(state => state.productLink);

  const isSelected = (color) => {
    return selectedColors.some(c => c.id === color.id);
  };

  const groupedColors = [];
  for (let i = 0; i < availableColors.length; i += 4) {
    groupedColors.push(availableColors.slice(i, i + 4));
  }

  const handleGoBack = () => {
    navigation.navigate('PostConfirm', { selectedColors });
  };

  // Renk seçimini işleyen fonksiyon
  const handleColorSelection = (color) => {
    dispatch(toggleColorSelection(color));
    // Seçilen rengi productLink state'ine kaydet
    dispatch(setColor(color.name)); // Sadece renk adını gönderiyoruz
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} onPress={handleGoBack}>
          <SvgBack />
        </TouchableOpacity>
        <Text style={styles.title}>Renkler</Text>
      </View>
      <FlatList
        data={groupedColors}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            {item.map((color) => (
              <View key={color.id} style={styles.colorWrapper}>
                <TouchableOpacity
                  onPress={() => handleColorSelection(color)}
                  style={[
                    styles.circle,
                    {
                      backgroundColor: color.hex,
                      opacity: isSelected(color) ? 1 : 0.3,
                    },
                  ]}
                />
                <Text style={styles.colorName}>{color.name}</Text>
              </View>
            ))}
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ColorPickerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    height: 60,
    marginTop:50,
  },
  title: {
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 16, 
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start', 
    marginBottom: 24,
  },
  colorWrapper: {
    width: ITEM_SIZE - 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 6,
  },
  colorName: {
    fontSize: 14,
    textAlign: 'center',
  },
});