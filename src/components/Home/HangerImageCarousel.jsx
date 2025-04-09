import { useState } from 'react';
import { View, Image, ScrollView, StyleSheet, Dimensions } from 'react-native';

const HangerImageCarousel = ({ photos }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const screenWidth = Dimensions.get('window').width;

  if (!Array.isArray(photos)) {
    photos = [];
  }

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / screenWidth);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {photos.map((photo, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image 
              source={photo} 
              style={styles.image} 
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>
      
      {photos.length > 1 && (
        <View style={styles.indicatorContainer}>
          {photos.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.indicatorDot,
                index === activeIndex ? styles.activeDot : styles.inactiveDot
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  imageContainer: {
    width: Dimensions.get('window').width,
    height: 536, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 536,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 20,
    left: (Dimensions.get('window').width - 79) / 2, 
    width: 79,
    height: 10,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorDot: {
    width: 4,
    height: 4,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#000000',
    width: 4,
    height: 4,
  },
  inactiveDot: {
    backgroundColor: "#9D9C9C",
  },
});

export default HangerImageCarousel;