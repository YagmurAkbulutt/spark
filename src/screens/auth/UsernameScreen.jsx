// import {
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import {useEffect, useState} from 'react';
// import {dismissKeyboard, height, width} from '../../utils/helpers';
// import SvgBack from '../../assets/back';
// import ProfileImagePicker from '../../components/Home/ProfileImagePicker';
// import { completeGoogleSignup, registerUserStep2, setUserProfile } from '../../redux/slices/authSlice';
// import { useDispatch, useSelector } from 'react-redux';

// const UsernameScreen = ({ navigation, route }) => {
  
  
//   const [focusedInput, setFocusedInput] = useState(null);
//   const dispatch = useDispatch();
//   const user = useSelector(state => state.auth.user);
//   const currentUsername = useSelector(state => state.auth.username);
//   const profilePicture = useSelector((state) => state.auth.profilePicture);

//   const [localUsername, setLocalUsername] = useState(''); 

//   useEffect(() => {
//     navigation.setOptions({
//       gestureEnabled: false,
//       headerShown: false,
//     });
//     if (currentUsername) {
//       setLocalUsername(currentUsername); 
//     }
//   }, [navigation, username]);

//   useEffect(() => {
//     if (route.params) {
//       console.log("UsernameScreen - Gelen route.params:", route.params);
      
//       if (route.params.userInfo) {
//         // Google'dan gelen kullanıcı bilgilerini detaylı loglayalım
//         console.log("Google Kullanıcı Bilgileri (userInfo):", route.params.userInfo);
//         console.log("Google Kullanıcı Email:", route.params.userInfo?.user?.email);
//         console.log("Google Kullanıcı Adı:", 
//           route.params.userInfo?.user?.givenName, 
//           route.params.userInfo?.user?.familyName
//         );
//       }
      
//       // İsim ve email bilgilerini state'e doğru şekilde alalım
//       if (route.params.fullName) {
//         setFullName(route.params.fullName);
//       }
//       if (route.params.email) {
//         setEmail(route.params.email);
//       }
//     }
//   }, [route.params]);

//   const fullName = useSelector((state) => state.auth.fullName);
//   const email = useSelector((state) => state.auth.email);
//   const password = useSelector((state) => state.auth.password);
//   const tempToken = useSelector(state => state.auth.tempToken);
//   const username = useSelector(state => state.auth.username);
  
//   const { isLoading, error } = useSelector((state) => state.auth);  // Redux store'dan loading ve error durumlarını al

//   // Google ile giriş yapıldığını kontrol et
//   const isGoogleLogin = useSelector((state) => state.auth.isGoogleLogin);

//   const handleUsernameSubmit = () => {
//     const formData = {
//       username: localUsername,       
//       fullName,                      
//       email,                        
//       password,                      
//       profilePicture,              
//       tempToken,                    
//     };
  
//     // Kullanıcı adı ve diğer verilerle Adım 2'yi tamamla
//     dispatch(registerUserStep2(formData))
//       .then((response) => {
//         if (response.type === 'auth/signupStep2/fulfilled') {
//           navigation.navigate('Main');
//         }
//       })
//       .catch((err) => {
//         console.log('Kayıt işlemi başarısız:', err);
//       });
//   };
  
  
  
  
  
  
//   useEffect(() => {
//     console.log("Redux'tan gelen profilePicture:", profilePicture);
//   }, [profilePicture]);
  

//   return (
//     <TouchableWithoutFeedback onPress={dismissKeyboard}>
//       <View style={styles.container}>
//         <View style={styles.backBtn}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <SvgBack />
//           </TouchableOpacity>
//         </View>
//         <View style={{ gap: 13 }}>
//           <View style={styles.logoContainer}>
//             <ProfileImagePicker />
//           </View>
//           <View style={styles.textContainer}>
//             <Text style={styles.textOne}>Hesabın neredeyse hazır</Text>
//             <Text style={styles.textTwo}>
//               Sparkles kullanmaya başlamak için kullanıcı adı belirle.
//             </Text>
//           </View>

//           <View style={styles.inputContainer}>
//             <View
//               style={[
//                 styles.textInputContainer,
//                 focusedInput === 'username' && styles.focusedInput,
//               ]}>
//               <TextInput
//                 placeholder="Kullanıcı Adı"
//                 placeholderTextColor="#B9B9B9"
//                 style={styles.textInput}
//                selectionColor='#D134AA'
//                 onFocus={() => setFocusedInput('username')}
//                 onBlur={() => setFocusedInput(null)}
//                 value={localUsername}
//                 onChangeText={setLocalUsername}
//                 autoCapitalize='none'
//               />
//             </View>
//           </View>

//           <TouchableOpacity
//             onPress={handleUsernameSubmit}
//             style={styles.loginButton}>
//             <Text style={styles.loginButtonText}>Kayıt Ol</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.registerContainer}>
//           <Text style={styles.registerText}>Sparkles hesabım var. </Text>
//           <TouchableOpacity
//             onPress={() => navigation.navigate('SignIn')}
//             style={styles.registerButton}>
//             <Text style={styles.registerLink}>Giriş Yap</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// export default UsernameScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: width * 0.05,
//     backgroundColor:"#FFFFFF"
//   },
//   backBtn: {
//     position: 'absolute',
//     left: width * 0.05,
//     top: height * 0.08,
//   },
//   logoContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   textContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 11,
//     marginBottom: 20,
//   },
//   textOne: {
//     textAlign: 'center',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   textTwo: {
//     fontWeight: '400',
//     textAlign: 'center',
//     width: width * 0.6,
//   },
//   inputContainer: {
//     gap: 10,
//     width: width * 0.8,
//   },
//   textInputContainer: {
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 15,
//     height: height * (Platform.OS === 'android' ? 0.07 : 0.06),
//     borderColor: '#B9B9B9',
//     transition: 'border-color 0.5s ease-in-out',
//   },
//   passwordContainer: {
//     position: 'relative',
//     borderWidth: 1,
//     borderRadius: 5,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     borderColor: '#B9B9B9',
//     transition: 'border-color 0.5s ease-in-out',
//   },
//   textInput: {
//     paddingTop: height * 0.02,
//     paddingBottom: height * 0.02,
//     fontWeight: '500',
//     width: '100%',
//   },
//   textInputPassword: {
//     flex: 1,
//     paddingTop: height * 0.02,
//     paddingBottom: height * 0.02,
//     fontWeight: '500',
//   },
//   eyeIcon: {
//     position: 'absolute',
//     right: 15,
//     top: '50%',
//     transform: [{translateY: -12}],
//   },
//   focusedInput: {
//     borderColor: '#000',
//   },
//   forgotPasswordContainer: {
//     alignItems: 'flex-end',
//     width: width * 0.8,
//   },
//   forgotPasswordText: {
//     fontWeight: '600',
//   },
//   loginButton: {
//     backgroundColor: 'black',
//     paddingVertical: height * 0.02,
//     borderRadius: 5,
//     alignItems: 'center',
//     width: width * 0.8,
//     height: height * (Platform.OS === 'android' ? 0.07 : 0.06),
//     marginTop: 10,
//   },
//   loginButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   registerContainer: {
//     position: 'absolute',
//     bottom: height * 0.05,
//     width: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   registerText: {
//     fontSize: 16,
//     fontWeight: '400',
//     textAlign: 'center',
//   },
//   registerButton: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   registerLink: {
//     fontWeight: '600',
//   },
// });

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import {useEffect, useState} from 'react';
import {dismissKeyboard, height, width} from '../../utils/helpers';
import SvgBack from '../../assets/back';
import ProfileImagePicker from '../../components/Home/ProfileImagePicker';
import { completeGoogleSignup, registerUserStep2, setUserProfile } from '../../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';

const UsernameScreen = ({ navigation, route }) => {
  
  
  const [focusedInput, setFocusedInput] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const currentUsername = useSelector(state => state.auth.username);
  const profilePicture = useSelector((state) => state.auth.profilePicture);

  const [localUsername, setLocalUsername] = useState(''); 

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
      headerShown: false,
    });
    if (currentUsername) {
      setLocalUsername(currentUsername); 
    }
  }, [navigation, username]);

  useEffect(() => {
    if (route.params) {
      console.log("UsernameScreen - Gelen route.params:", route.params);
      
      if (route.params.userInfo) {
        // Google'dan gelen kullanıcı bilgilerini detaylı loglayalım
        console.log("Google Kullanıcı Bilgileri (userInfo):", route.params.userInfo);
        console.log("Google Kullanıcı Email:", route.params.userInfo?.user?.email);
        console.log("Google Kullanıcı Adı:", 
          route.params.userInfo?.user?.givenName, 
          route.params.userInfo?.user?.familyName
        );
      }
      
      // Email ve fullName bilgilerini Redux store'a aktaralım
      if (route.params.email || route.params.fullName) {
        const userProfileData = {
          fullName: route.params.fullName || '',
          identifier: route.params.email || ''
        };
        
        console.log("Redux'a aktarılacak kullanıcı bilgileri:", userProfileData);
        dispatch(setUserProfile(userProfileData));
      }
    }
  }, [route.params, dispatch]);

  const fullName = useSelector((state) => state.auth.fullName);
  const email = useSelector((state) => state.auth.email);
  const password = useSelector((state) => state.auth.password);
  const tempToken = useSelector(state => state.auth.tempToken);
  const username = useSelector(state => state.auth.username);
  
  const { isLoading, error } = useSelector((state) => state.auth);  // Redux store'dan loading ve error durumlarını al

  // Google ile giriş yapıldığını kontrol et
  const isGoogleLogin = useSelector((state) => state.auth.isGoogleLogin);

  const handleUsernameSubmit = () => {
    // Önce tüm verileri logla
    console.log("Sunucuya gönderilecek veriler:", {
      username: localUsername,
      fullName,
      email: identifier,
      isGoogleLogin,
      tempToken
    });

    // Form verileri oluştur - email bilgisini identifier'dan al
    const formData = {
      username: localUsername,       
      fullName,                      
      email: identifier,  // email yerine identifier kullan                      
      password,                      
      profilePicture,              
      tempToken,                    
    };

    console.log("Kayıt işlemi başlatılıyor...");
    
    // Google ile giriş yapılmışsa farklı işlem yap
    if (isGoogleLogin) {
      console.log("Google ile giriş yapıldı, completeGoogleSignup fonksiyonu çağrılıyor...");
      
      dispatch(completeGoogleSignup(formData))
        .then((response) => {
          console.log("completeGoogleSignup yanıtı:", response);
          
          if (response.meta.requestStatus === 'fulfilled') {
            console.log("Google kayıt tamamlandı, ana sayfaya yönlendiriliyor");
            navigation.navigate('Main');
          }
        })
        .catch((err) => {
          console.error('Google kayıt tamamlama hatası:', err);
        });
    } else {
      // Normal kullanıcı kaydı
      console.log("Normal kayıt işlemi yapılıyor...");
      
      dispatch(registerUserStep2(formData))
        .then((response) => {
          console.log("registerUserStep2 yanıtı:", response);
          
          if (response.meta.requestStatus === 'fulfilled') {
            console.log("Kayıt başarılı, ana sayfaya yönlendiriliyor");
            navigation.navigate('Main');
          }
        })
        .catch((err) => {
          console.error('Kayıt işlemi hatası:', err);
        });
    }
  };
  
  
  
  
  
  
  useEffect(() => {
    console.log("Redux'tan gelen profilePicture:", profilePicture);
  }, [profilePicture]);
  

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <View style={styles.backBtn}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <SvgBack />
          </TouchableOpacity>
        </View>
        <View style={{ gap: 13 }}>
          <View style={styles.logoContainer}>
            <ProfileImagePicker />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.textOne}>Hesabın neredeyse hazır</Text>
            <Text style={styles.textTwo}>
              Sparkles kullanmaya başlamak için kullanıcı adı belirle.
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <View
              style={[
                styles.textInputContainer,
                focusedInput === 'username' && styles.focusedInput,
              ]}>
              <TextInput
                placeholder="Kullanıcı Adı"
                placeholderTextColor="#B9B9B9"
                style={styles.textInput}
               selectionColor='#D134AA'
                onFocus={() => setFocusedInput('username')}
                onBlur={() => setFocusedInput(null)}
                value={localUsername}
                onChangeText={setLocalUsername}
                autoCapitalize='none'
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleUsernameSubmit}
            style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Kayıt Ol</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Sparkles hesabım var. </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignIn')}
            style={styles.registerButton}>
            <Text style={styles.registerLink}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default UsernameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    backgroundColor:"#FFFFFF"
  },
  backBtn: {
    position: 'absolute',
    left: width * 0.05,
    top: height * 0.08,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 11,
    marginBottom: 20,
  },
  textOne: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  textTwo: {
    fontWeight: '400',
    textAlign: 'center',
    width: width * 0.6,
  },
  inputContainer: {
    gap: 10,
    width: width * 0.8,
  },
  textInputContainer: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    height: height * (Platform.OS === 'android' ? 0.07 : 0.06),
    borderColor: '#B9B9B9',
    transition: 'border-color 0.5s ease-in-out',
  },
  passwordContainer: {
    position: 'relative',
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderColor: '#B9B9B9',
    transition: 'border-color 0.5s ease-in-out',
  },
  textInput: {
    paddingTop: height * 0.02,
    paddingBottom: height * 0.02,
    fontWeight: '500',
    width: '100%',
  },
  textInputPassword: {
    flex: 1,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.02,
    fontWeight: '500',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{translateY: -12}],
  },
  focusedInput: {
    borderColor: '#000',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    width: width * 0.8,
  },
  forgotPasswordText: {
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: 'black',
    paddingVertical: height * 0.02,
    borderRadius: 5,
    alignItems: 'center',
    width: width * 0.8,
    height: height * (Platform.OS === 'android' ? 0.07 : 0.06),
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  registerContainer: {
    position: 'absolute',
    bottom: height * 0.05,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  registerText: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
  registerButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerLink: {
    fontWeight: '600',
  },
});
