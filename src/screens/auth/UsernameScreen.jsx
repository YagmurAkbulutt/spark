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
    console.log("Gelen route.params:", route.params);
  }, []);
  const fullName = useSelector((state) => state.auth.fullName);
  const email = useSelector((state) => state.auth.email);
  const password = useSelector((state) => state.auth.password);
  const tempToken = useSelector(state => state.auth.tempToken);
  const username = useSelector(state => state.auth.username);
  
  // const { userInfo, idToken } = route.params; // Google'dan alınan bilgiler

  // const [fullName, setFullName] = useState(userInfo?.user?.name || ''); // Google'dan alınan fullName
  // const [password, setPassword] = useState(''); // Kullanıcının şifre girmesini sağlayacağız
  // const { fullName, email, idToken } = route.params;
  useEffect(() => {
    console.log("Full Name:", fullName); 
    console.log("Email:", email);
    console.log("Password:", password);
  }, []);

  
 
  const { isLoading, error } = useSelector((state) => state.auth);  // Redux store'dan loading ve error durumlarını al

  // Google ile giriş yapıldığını kontrol et
  const isGoogleLogin = useSelector((state) => state.auth.isGoogleLogin);

  // const handleUsernameSubmit = () => {
  //   console.log("Kayıt işlemi başlatılıyor...");
    
  //   // Eğer fullName veya password eksikse, kullanıcıdan bu bilgileri alınması gerektiğini gösterelim
  //   if (!fullName || !password) {
  //     console.log("Eksik bilgiler var:", { fullName, password });
  //     alert("Lütfen tüm bilgilerinizi doldurun: Ad ve Soyad, Şifre.");
  //     return; // İşlemi durduruyoruz çünkü zorunlu bilgiler eksik
  //   }
  
  //   const formData = {
  //     username: localUsername,       // Kullanıcı adı
  //     fullName,                      // Ad ve soyad
  //     email,                         // Email
  //     password,                      // Şifre
  //     profilePicture,                // Profil fotoğrafı
  //     tempToken,                     // Geçici token
  //   };
  
  //   console.log("Form verileri:", formData);
  
  //   // Redux state'inden Google ile giriş yapılıp yapılmadığını kontrol et
  //   // const isGoogleLogin = useSelector((state) => state.auth.isGoogleLogin);
  //   console.log("Google ile giriş yapıldı mı?:", isGoogleLogin);
  
  //   if (isGoogleLogin) {
  //     console.log("Google ile giriş yapılmış. completeGoogleSignup fonksiyonu çağrılıyor...");
      
  //     // Eğer kullanıcı Google ile giriş yaptıysa, completeGoogleSignup fonksiyonunu çalıştır
  //     dispatch(completeGoogleSignup(formData))  // Google ile kayıt işlemini tamamla
  //       .then((response) => {
  //         console.log("completeGoogleSignup response:", response);
          
  //         if (response.type === 'auth/completeGoogleSignup/fulfilled') {
  //           console.log("Google ile kayıt başarılı. Yönlendiriliyor...");
  //           // Kayıt tamamlandığında yönlendirme
  //           navigation.navigate('Main');
  //         }
  //       })
  //       .catch((err) => {
  //         console.log('Google ile kayıt işlemi başarısız:', err);
  //         // Hata mesajı gösterebilirsiniz
  //       });
  //   } else {
  //     console.log("Google ile giriş yapılmamış. registerUserStep2 fonksiyonu çağrılıyor...");
      
  //     // Eğer kullanıcı Google ile giriş yapmadıysa, registerUserStep2 fonksiyonunu çalıştır
  //     dispatch(registerUserStep2(formData))  // Normal kayıt işlemini tamamla
  //       .then((response) => {
  //         console.log("registerUserStep2 response:", response);
  
  //         if (response.type === 'auth/signupStep2/fulfilled') {
  //           console.log("Normal kayıt başarılı. Yönlendiriliyor...");
  //           // Kayıt tamamlandığında yönlendirme
  //           navigation.navigate('Main');
  //         }
  //       })
  //       .catch((err) => {
  //         console.log('Kayıt işlemi başarısız:', err);
  //         // Hata mesajı gösterebilirsiniz
  //       });
  //   }
  // };
  // const handleUsernameSubmit = () => {
  //   console.log("Kayıt işlemi başlatılıyor...");
  
  //   // Eğer Google ile giriş yapılmışsa, şifreyi kontrol etmiyoruz
  //   if (!fullName) {
  //     console.log("Eksik bilgiler var:", { fullName });
  //     alert("Lütfen Ad ve Soyad bilgilerinizi doldurun.");
  //     return; // İşlemi durduruyoruz çünkü zorunlu bilgiler eksik
  //   }
  
  //   // Eğer Google ile giriş yapılmamışsa, şifre de gereklidir
  //   if (!isGoogleLogin && !password) {
  //     console.log("Eksik bilgiler var:", { password });
  //     alert("Lütfen şifrenizi belirleyin.");
  //     return; // İşlemi durduruyoruz çünkü şifre eksik
  //   }
  
  //   const formData = {
  //     username: localUsername,       // Kullanıcı adı
  //     fullName,                      // Ad ve soyad
  //     email,                         // Email
  //     password: isGoogleLogin ? undefined : password, // Şifreyi sadece normal kayıtta alıyoruz
  //     profilePicture,                // Profil fotoğrafı
  //     tempToken,                     // Geçici token
  //   };
  
  //   console.log("Form verileri:", formData);
  
  //   // Eğer Google ile giriş yapıldıysa, Google kayıt işlemi tamamlanacak
  //   if (isGoogleLogin) {
  //     console.log("Google ile giriş yapılmış. completeGoogleSignup fonksiyonu çağrılıyor...");
  
  //     // Eğer kullanıcı Google ile giriş yaptıysa, completeGoogleSignup fonksiyonunu çalıştır
  //     dispatch(completeGoogleSignup(formData))  // Google ile kayıt işlemini tamamla
  //       .then((response) => {
  //         console.log("completeGoogleSignup response:", response);
  
  //         if (response.type === 'auth/completeGoogleSignup/fulfilled') {
  //           console.log("Google ile kayıt başarılı. Yönlendiriliyor...");
  //           // Kayıt tamamlandığında yönlendirme
  //           navigation.navigate('Main');
  //         }
  //       })
  //       .catch((err) => {
  //         console.log('Google ile kayıt işlemi başarısız:', err);
  //       });
  //   } else {
  //     console.log("Google ile giriş yapılmamış. registerUserStep2 fonksiyonu çağrılıyor...");
  
  //     // Eğer kullanıcı Google ile giriş yapmadıysa, normal kayıt işlemi tamamlanacak
  //     dispatch(registerUserStep2(formData))  // Normal kayıt işlemini tamamla
  //       .then((response) => {
  //         console.log("registerUserStep2 response:", response);
  
  //         if (response.type === 'auth/signupStep2/fulfilled') {
  //           console.log("Normal kayıt başarılı. Yönlendiriliyor...");
  //           // Kayıt tamamlandığında yönlendirme
  //           navigation.navigate('Main');
  //         }
  //       })
  //       .catch((err) => {
  //         console.log('Kayıt işlemi başarısız:', err);
  //       });
  //   }
  // };
  
  



  const handleUsernameSubmit = () => {
    const formData = {
      username: localUsername,       
      fullName,                      
      email,                        
      password,                      
      profilePicture,              
      tempToken,                    
    };
  
    // Kullanıcı adı ve diğer verilerle Adım 2'yi tamamla
    dispatch(registerUserStep2(formData))
      .then((response) => {
        if (response.type === 'auth/signupStep2/fulfilled') {
          navigation.navigate('Main');
        }
      })
      .catch((err) => {
        console.log('Kayıt işlemi başarısız:', err);
      });
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
