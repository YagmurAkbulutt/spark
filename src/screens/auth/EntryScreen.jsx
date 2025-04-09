import {useEffect, useState} from 'react';
import {View,ImageBackground,Text,TouchableOpacity,StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SvgAppleLogo from "../../assets/applelogo.js"
import SvgGoogleLogo from "../../assets/googleLogo.js"
import SVGLogoS from "../../assets/logo-s.js"
import { height } from '../../utils/helpers.js';
import { useDispatch } from "react-redux";
import { loginUser, loginWithGoogle, registerUser, setUserProfile } from "../../redux/slices/authSlice.js"; // loginUser ve registerUser aksiyonlarını içe aktar
import { GoogleSignin } from '@react-native-google-signin/google-signin'; // Google giriş için
import AppleAuthentication from '@invertase/react-native-apple-authentication'; // Apple giriş için
import jwtDecode from 'jwt-decode';


const backgrounds = [
  require('../../assets/entry-1.png'), 
  require('../../assets/entry-2.png'), 
  require('../../assets/entry-3.png'), 
  require('../../assets/entry-4.png'), 
];

const EntryScreen = ({ navigation }) => {
  const dispatch = useDispatch(); 
  const [background, setBackground] = useState(null);


  

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '20620325615-a6mf037sgfi3c5i9ngilp65ddvvjkv7v.apps.googleusercontent.com',
      iosClientId: '20620325615-63b4hamdj3acvjt8c7fisuipvtaoickm.apps.googleusercontent.com',
    });
  }, []);

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
  
  


  
  
  
  const handleGoogleLogin = async () => {
    try {
      console.log("Google login başlatılıyor...");
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();  // Google'dan gelen bilgileri alıyoruz
      const { idToken } = await GoogleSignin.getTokens();  // Token bilgilerini alıyoruz

      // Google'dan gelen verileri detaylı loglama
      console.log("Google login başarılı! Kullanıcı bilgileri:", JSON.stringify(userInfo, null, 2));
      console.log("Google ID Token:", idToken);
     

      
      // Tam olarak hangi alanların geldiğini görelim
      const { email, givenName, familyName, photo, name } = userInfo.user;
      console.log("Google bilgileri - email:", email);
      console.log("Google bilgileri - givenName:", givenName);
      console.log("Google bilgileri - familyName:", familyName);
      console.log("Google bilgileri - photo:", photo);
      console.log("Google bilgileri - name:", name);
      
      // fullName oluşturma - isim alanları boş olabilir
      const fullName = name || [givenName, familyName].filter(Boolean).join(' ') || '';
      console.log("Oluşturulan fullName:", fullName);

      if (!userInfo || !userInfo.user) {
        console.error("Google userInfo eksik ya da hatalı:", userInfo);
        return;
      }
      

      

      // Google bilgilerini içeren kapsamlı veri oluştur
      const googleLoginData = {
        idToken,
        userInfo: {
          email,
          givenName,
          familyName,
          photo,
          name: fullName
        }
      };

      // Redux işlemi
      let result;
try {
  result = await dispatch(loginWithGoogle(googleLoginData));
  console.log("Redux işlemi tamamlandı, sonuç:", result);
} catch (e) {
  console.error("Redux dispatch sırasında bir hata oluştu:", e);
  return;
}

    
      if (result.meta.requestStatus === 'fulfilled') {
        console.log("Kullanıcı başarılı şekilde giriş yaptı:", result.payload);

        // Eğer yeni kullanıcıysa, bilgilerin doğruluğunu kontrol ettirerek Username ekranına yönlendir
        if (result.payload.isNewUser) {
          // Kullanıcı verilerini store'a kaydet (bu önemli bir adım!)
          dispatch(setUserProfile({
            fullName: fullName || '',
            identifier: email || ''
          }));
          
          navigation.navigate('Username', {
            userInfo,
            idToken,
            isGoogleLogin: true,
            email: email || '',
            fullName: fullName || '',
            profilePicture: photo || '',
          });
        } else {
          // Var olan kullanıcıysa doğrudan ana sayfaya yönlendir
          navigation.navigate('Main');
        }
      } else {
        console.error("Giriş işlemi başarısız! Hata mesajı:", result.payload);
      }
    } catch (error) {
      console.error("Google login sırasında hata oluştu:", error);
    }
  };
  
  // getUserInfo fonksiyonu
  // const getUserInfo = async () => {
  //   try {
  //     const currentUser = await GoogleSignin.getCurrentUser();
  //     if (currentUser) {
  //       console.log("Mevcut kullanıcı bilgileri:", currentUser);
  //       const { email, givenName, familyName, photo } = currentUser.user;
  //       const fullName = `${givenName} ${familyName}`;
  //       console.log("Kullanıcı adı:", fullName);
  //       console.log("E-posta:", email);
  //       console.log("Profil Fotoğrafı:", photo);
        
  //       return { email, fullName, profilePicture: photo };
  //     } else {
  //       console.log("Henüz giriş yapılmamış.");
  //       return null; // Kullanıcı giriş yapmamışsa null döner
  //     }
  //   } catch (error) {
  //     console.error("Kullanıcı bilgileri alınırken hata oluştu:", error);
  //     return null; // Hata durumunda null döner
  //   }
  // };
  
  
  
  
  

  // const handleGoogleLogin = async () => {
  //   try {
  //     console.log("Google login başlatılıyor...");
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     const { idToken } = await GoogleSignin.getTokens();
  
  //     console.log("Google login başarılı! Kullanıcı bilgileri:", userInfo);
  //     console.log("Google ID Token:", idToken);
  
  //     const result = await dispatch(loginWithGoogle({ idToken }));
  //     console.log("Redux işlemi tamamlandı, sonuç:", result);
  
  //     if (result.meta.requestStatus === 'fulfilled') {
  //       console.log("Kullanıcı başarılı şekilde giriş yaptı:", result.payload);
        
  //       // Google ile giriş yapıldıysa, fullName ve email alınıp aktarıyoruz
  //       const fullName = `${userInfo.user.givenName} ${userInfo.user.familyName}`;
  //       const email = userInfo.user.email;
        
  //       navigation.navigate('Username', {
  //         fullName,  // Google'dan alınan fullName
  //         email,     // Google'dan alınan email
  //         idToken,
  //       });
  //     } else {
  //       console.error("Giriş işlemi başarısız! Hata mesajı:", result.payload);
  //     }
  //   } catch (error) {
  //     console.error("Google login sırasında hata oluştu:", error);
  //   }
  // };
  
  
  

  const handleEmailRegister = () => {
    navigation.navigate("SignUp"); // E-posta ile kayıt ekranına yönlendir
  };

  const handleEmailLogin = () => {
    navigation.navigate("SignIn"); // E-posta ile giriş ekranına yönlendir
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
      if (isLoggedIn === "true") {
        navigation.replace("Main"); // Geri butonunu engellemek için replace kullanıyoruz.
      }
    };
    checkLoginStatus();
  }, []);

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
        onPress={handleGoogleLogin}
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
              Sparkles hesabım var.{" "}
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
