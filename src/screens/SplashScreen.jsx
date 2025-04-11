import { useEffect, useState } from 'react';
import { View, StyleSheet, Image, SafeAreaView, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'react-native';
import {FlatList, Dimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { height, width } from '../utils/helpers';


const COLUMN_COUNT = 3;
const SPACING = 21;
const IMAGE_WIDTH = 165;
// (width - SPACING * (COLUMN_COUNT - 1)) / COLUMN_COUNT;
const IMAGE_HEIGHT = IMAGE_WIDTH * 1.80;

const images = [
  require("../assets/1.png"),
  require("../assets/2.png"),
  require("../assets/3.png"),
  require("../assets/4.png"),
  require("../assets/5.png"),
  require("../assets/6.png"),
  require("../assets/7.png"),
  require("../assets/8.png"),
  require("../assets/9.png"),
  require("../assets/10.png"),
  require("../assets/11.png"),
  require("../assets/12.png"),
];

const SplashScreen = ({ navigation }) => {
  // const [loading, setLoading] = useState(true);
  useEffect(() => {
    // const checkUserStatus = async () => {
    //   try {
    //     const isRegistered = await AsyncStorage.getItem("isRegistered");
    //     const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");

    //     console.log("isLoggedIn:", isLoggedIn);
    //     console.log("isRegistered:", isRegistered);

    //     if (isLoggedIn === "true") {
    //       console.log("Kullanıcı giriş yapmış, Home ekranına yönlendiriliyor.");
    //       navigation.replace("Main"); 
    //     } else if (isRegistered === "true") {
    //       console.log("Kullanıcı kayıtlı, SignIn ekranına yönlendiriliyor.");
    //       navigation.replace("SignIn"); 
    //     } else {
    //       console.log("Kullanıcı yeni, Entry ekranına yönlendiriliyor.");
    //       navigation.replace("Entry"); 
    //     }
    //   } catch (error) {
    //     console.error("Hata:", error);
    //     navigation.replace("Entry"); 
    //   }
    // };

    setTimeout(() => {
      checkUserStatus();
    }, 1000); // Küçük bir gecikme ekleyelim ki takılma olmasın
  }, [navigation]);

 
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.style = { fontFamily: 'Poppins-Regular' };
    

    
      const renderItem = ({ item, index }) => {
        const isMiddleColumn = index % COLUMN_COUNT === 1;
        return (
          <View
            style={{
              width: IMAGE_WIDTH,
              height: IMAGE_HEIGHT,
              marginBottom: SPACING,
              marginRight: index % COLUMN_COUNT !== COLUMN_COUNT - 1 ? SPACING : 0,
              transform: [{ translateY: isMiddleColumn ? -50 : 0 }],
              alignSelf: isMiddleColumn ? "center" : "flex-start", 
            }}
          >
            <Image
              source={item}
              style={{ width: "100%", height: "100%", borderRadius: 5 }}
            />
          </View>
        );
    };
  
    return (
      <View style={{ flex: 1, backgroundColor: "#000",  }}>
        <FlatList
          data={images}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          numColumns={COLUMN_COUNT}
          contentContainerStyle={{ paddingBottom: 100,marginLeft: -width * 0.08 }}
        />
        <LinearGradient
    colors={["rgba(0,0,0,0.9)", "rgba(80,0,80,0.6)", "rgba(255,0,255,0.7)"]}
  start={{ x: 0, y: 0 }}  
  end={{ x: 1, y: 0 }} 
  style={{
    position: "absolute",
    width: "100%",
    height: "100%",
  }}
/>


        <View
          style={{
            position: "absolute",
          top: height / 2 - 30,
          left: 0,
          right: 0,
          alignItems: "center",
          }}
        >
          <Image
            source={require("../assets/sparkles.png")}
            style={{ width: 200, height: 60, resizeMode: "contain" }}
          />
        </View>
      </View>
    );
  };
  

export default SplashScreen;
