import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const Loader = () => {
  const rotation = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1500, 
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.spinner,
          { transform: [{ rotate }] },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  spinner: {
    borderWidth: 4,
    borderColor: '#B2B2B2',
    borderTopColor: '#000', 
    borderRadius: 25,
    width: 32,
    height: 32,
  },
});

export default Loader;