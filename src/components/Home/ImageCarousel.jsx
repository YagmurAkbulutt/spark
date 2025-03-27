import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {ScrollView} from 'react-native';
import SvgMore from '../../assets/more';
import {width} from '../../utils/helpers';
import ShareBottomSheet from './ShareBottomSheet';

const ImageCarousel = React.memo(({item, onPress}) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={require('../../assets/profilePhoto.png')}
            style={styles.userImage}
          />
          <Text style={{fontSize: 12}}>minealada</Text>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            activeOpacity={0.7}>
            <SvgMore />
          </TouchableOpacity>
          <ShareBottomSheet
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        pagingEnabled={true}
        style={{marginBottom: 5, width: item.width}}>
        {item.images.map((img, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onPress(item, index)}
            activeOpacity={1}>
            <Image
              source={img}
              style={{
                width: item.width,
                height: item.height,
                borderRadius: 10,
              }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
});

export default ImageCarousel;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: Math.floor((width - 30) / 2),
    marginBottom: 8,
    marginTop: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  userImage: {
    width: 24,
    height: 24,
  },
});
