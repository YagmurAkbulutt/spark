import React, { useRef, useState } from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';

const { width } = Dimensions.get('window');

const HangerImageCarousel = ({ photos }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef(null);
    
    // Eğer photos undefined/null ise boş dizi kullan
    const validPhotos = Array.isArray(photos) ? photos : [];
    
    const handleScrollEnd = (event) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffset / width);
        setActiveIndex(currentIndex);
    };
    
    const goToImage = (index) => {
        flatListRef.current?.scrollToIndex({ index, animated: true });
        setActiveIndex(index);
    };

    const handleScroll = (event) => {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(contentOffsetX / width);
      setActiveIndex(index);
    };

    return (
      <View style={styles.container}>
      <ScrollView
        
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {Array.isArray(photos) && photos.map((photo, index) => (
  <Image key={index} source={photo} style={styles.image} />
))}

      </ScrollView>
      <View style={styles.dotContainer}>
  {Array.isArray(photos) &&
    photos.map((_, index) => (
      <View
        key={index}
        style={[
          styles.dot,
          activeIndex === index && styles.activeDot,
        ]}
      />
    ))
  }
</View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: width,
    height: 200, // istediğiniz yükseklik
    resizeMode: 'cover',
  },
  dotContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    margin: 5,
  },
  activeDot: {
    backgroundColor: '#000',
  },
});

export default HangerImageCarousel;