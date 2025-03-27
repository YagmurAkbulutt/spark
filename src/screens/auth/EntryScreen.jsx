import {useEffect, useState} from 'react';
import {View,ImageBackground,Text,TouchableOpacity,StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SvgAppleLogo from "../../assets/applelogo.js"
import SvgGoogleLogo from "../../assets/googleLogo.js"
import SVGLogoS from "../../assets/logo-s.js"
import { height } from '../../utils/helpers.js';
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "../../redux/slices/authSlice.js"; // loginUser ve registerUser aksiyonlarını içe aktar
// import { GoogleSignin } from '@react-native-google-signin/google-signin'; // Google giriş için
import AppleAuthentication from '@invertase/react-native-apple-authentication'; // Apple giriş için

const backgrounds = [
  require('../../assets/entry-1.png'), 
  require('../../assets/entry-2.png'), 
  require('../../assets/entry-3.png'), 
  require('../../assets/entry-4.png'), 
];

const EntryScreen = ({ navigation }) => {
  const dispatch = useDispatch(); // Redux dispatch fonksiyonunu kullan
  const [background, setBackground] = useState(null);

  useEffect(() => {
    const setNextBackground = async () => {
      try {
        let currentIndex = await AsyncStorage.getItem("currentBackgroundIndex");
  
        if (!currentIndex) {
          currentIndex = "0";
        } else {
          currentIndex = (parseInt(currentIndex) + 1) % backgrounds.length;
        }
  
        await AsyncStorage.setItem("currentBackgroundIndex", currentIndex.toString());
        setBackground(backgrounds[parseInt(currentIndex)]);
      } catch (error) {
      }
    };
  
    setNextBackground();
  }, []);
  

    // Google sign-in configure
    // GoogleSignin.configure({
    //   webClientId: 'your-web-client-id', // Google API Console'dan alınan client ID
    // });
  

  const handleAppleLogin = async () => {
    try {
      const appleAuthResponse = await AppleAuthentication.signInAsync();
      const { identityToken, fullName, email } = appleAuthResponse;
  
      console.log("Apple Authentication Response:", appleAuthResponse);
  
      if (identityToken) {
        console.log("Apple login başarılı, identityToken:", identityToken);
        
        // Token ile login işlemi
        const result = await dispatch(loginUser({ email, password: identityToken }));
        
        // Dispatch sonucu logla
        console.log("Dispatch sonucu:", result);
  
        if (result.meta.requestStatus === 'fulfilled') {
          console.log("Login başarılı:", result.payload);
        } else {
          console.error("Login başarısız:", result.payload);
        }
      }
    } catch (error) {
      console.error("Apple login error:", error);
    }
  };
  
  

  // const handleGoogleLogin = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     const { user } = userInfo;
  //     console.log("Google login successful, user info:", user);
  
  //     dispatch(loginUser({ email: user.email, password: user.id }));
  //   } catch (error) {
  //     console.error("Google login error:", error);
  //   }
  // };
  

  const handleEmailRegister = () => {
    navigation.navigate("SignUp"); // E-posta ile kayıt ekranına yönlendir
  };

  const handleEmailLogin = () => {
    navigation.navigate("SignIn"); // E-posta ile giriş ekranına yönlendir
  };

  return (
    <ImageBackground
      source={background}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <View style={{ gap: 10, marginTop: height * 0.65 }}>
        <TouchableOpacity style={styles.containerBtn} onPress={handleAppleLogin}>
          <SvgAppleLogo style={{ width: 18, height: 26 }} />
          <Text style={{ fontSize: 16, fontWeight: "500" }}>Apple ile giriş yap</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.containerBtn} 
        // onPress={handleGoogleLogin}
        >
          <SvgGoogleLogo style={{ width: 18, height: 26 }} />
          <Text style={{ fontSize: 16, fontWeight: "500" }}>Google ile giriş yap</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleEmailRegister}
          style={[styles.containerBtn, { backgroundColor: "black" }]}
        >
          <SVGLogoS style={{ width: 18, height: 26 }} />
          <Text style={{ fontSize: 16, fontWeight: "500", color: "white" }}>
            E-posta ile kayıt ol
          </Text>
        </TouchableOpacity>

        <View style={{ justifyContent: "center", alignItems: "center", height: 24, marginTop: 14 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontWeight: "400", color: "white", fontSize: 14 }}>
              Style Up hesabım var.{" "}
            </Text>
            <TouchableOpacity onPress={handleEmailLogin}>
              <Text style={{ fontWeight: "500", color: "white", fontSize: 14 }}>Giriş yap.</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default EntryScreen;

const styles = StyleSheet.create({
  containerBtn: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 13,
    width: 302,
    height: 52,
    borderRadius: 5,
    padding: '14px 50px',
  },
});
