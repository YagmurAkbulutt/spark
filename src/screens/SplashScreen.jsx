import { useEffect } from 'react';
import { View, StyleSheet, Image, SafeAreaView, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const isRegistered = await AsyncStorage.getItem('isRegistered'); 
        setTimeout(() => {
          if (isRegistered === 'true') {
            navigation.replace("Home"); 
          } else {
            navigation.replace("Entry"); 
          }
        }, 1000);
      } catch (error) {
        console.error('Hata:', error);
        navigation.replace("Entry"); 
      }
    };

    checkUserStatus();
  }, []);
 
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.style = { fontFamily: 'Poppins-Regular' };
    

    return (
      <View style={styles.container}>
        
        <Image source={require("../assets/logo.png")} style={styles.logo} />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems:"center",
      justifyContent:"center",
      backgroundColor:"#FFFFFF"
    },
    logo: {
      
    },
  
});

export default SplashScreen;
