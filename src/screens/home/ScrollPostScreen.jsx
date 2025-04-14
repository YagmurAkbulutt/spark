// ScrollPostScreen.js
import React from 'react';
import { View, FlatList, Dimensions, Text } from 'react-native';
import FullPostScreen from './FullPostScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: screenHeight } = Dimensions.get('window');

const ScrollPostScreen = ({
    allPosts = [], // Varsayılan değer
    formattedImages = [], // Varsayılan değer
    selectedImage,
    onClose,
    extraData,
    onScroll
  }) => {
    const insets = useSafeAreaInsets();
    console.log("selectedImage ID:", selectedImage?.id);
console.log("formattedImages'de var mı?", 
  formattedImages.some(img => img.id === selectedImage?.id));
  
    // Seçili resmin indexini bul
    const initialIndex = formattedImages.findIndex(img => img?.id === selectedImage?.id);
    return (
      <View 
      style={{
        position: 'absolute',
        top: -insets.top,
        left: 0,
        right: 0,
        bottom: -insets.bottom,
        backgroundColor: 'white',
        zIndex: 1000,
        flex:1
      }}
      >
        {formattedImages.length > 0 ? (
          <FlatList
            data={allPosts}
            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
            // initialScrollIndex={initialIndex >= 0 ? initialIndex : 0}
            onScroll={onScroll}
            showsVerticalScrollIndicator={false}
            pagingEnabled
            style={{ flex: 1 }}
            snapToAlignment="start"
            decelerationRate="fast"
            getItemLayout={(data, index) => ({
              length: screenHeight,
              offset: screenHeight * index,
              index,
            })}
            initialScrollIndex={formattedImages.findIndex(
              (img) => img.id === selectedImage.id
            )}
            renderItem={({ item }) => (
              <View style={{ height: screenHeight }}>
                <FullPostScreen
                  image={item}
                  onClose={onClose}
                  extraData={extraData}
                />
              </View>
            )}
          />
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>Yükleniyor...</Text>
        )}
      </View>
    );
  };

export default ScrollPostScreen;