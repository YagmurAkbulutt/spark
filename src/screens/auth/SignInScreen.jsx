import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import SvgLogoS from '../../assets/logo-s';
import SvgEyeOff from '../../assets/eyeoff';
import {useEffect, useState} from 'react';
import {dismissKeyboard, height, width} from '../../utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignInScreen = ({ navigation }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth); 

  const handleLogin = async () => {
    console.log("Login işlemi başlatıldı.");
    if (!email || !password) {
      alert("Lütfen e-posta ve şifrenizi girin.");
      return;
    }
  
    try {
      console.log("Dispatch işlemi yapılıyor...");
      const resultAction = dispatch(loginUser({ email, password }));
      console.log("Dispatch tamamlandı.", resultAction);
  
      if (loginUser.fulfilled.match(resultAction)) {
        console.log("Login başarılı.");
        await AsyncStorage.setItem("isLoggedIn", "true");
        navigation.navigate("Start");
      }
    } catch (error) {
      console.error("Giriş işlemi sırasında hata oluştu:", error);
    }
  };
  

  // useEffect(() => {
  //   const checkLoginStatus = async () => {
  //     const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
  //     if (isLoggedIn === 'true') {
  //       navigation.replace('Start');  
  //     }
  //   };
  
  //   checkLoginStatus();
  // }, []); 
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
    <View style={styles.container}>
      <View style={{gap: 13}}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <SvgLogoS width={width * 0.2} height={width * 0.2} />
        </View>

        {/* Giriş Alanları */}
        <View style={styles.inputContainer}>
          {/* Kullanıcı adı veya e-posta */}
          <View
            style={[
              styles.textInputContainer,
              focusedInput === 'username' && styles.focusedInput,
            ]}>
            <TextInput
              placeholder="Kullanıcı adı veya e-posta"
              placeholderTextColor="#B9B9B9"
              style={styles.textInput}
              selectionColor='#D134AA'
              onFocus={() => setFocusedInput('username')}
              onBlur={() => setFocusedInput(null)}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          {/* Şifre Girişi ve Göz İkonu */}
          <View
            style={[
              styles.passwordContainer,
              focusedInput === 'password' && styles.focusedInput,
            ]}>
            <TextInput
              placeholder="Şifre"
              placeholderTextColor="#B9B9B9"
              style={styles.textInputPassword}
              secureTextEntry={!isPasswordVisible}
              selectionColor='#D134AA'
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.eyeIcon}>
              {isPasswordVisible ? (
                <SvgEyeOff width={24} height={24} />
              ) : (
                <SvgEyeOff width={24} height={24} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Şifremi Unuttum */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgetPassword')}
          style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPasswordText}>Şifreni mi unuttun?</Text>
        </TouchableOpacity>

        {/* Giriş Yap Butonu */}
       {/* Hata Mesajı */}
       {error && <Text style={styles.errorText}>{error}</Text>}

{/* Giriş Yap Butonu */}
<TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
  {isLoading ? (
    <ActivityIndicator color="#FFF" />
  ) : (
    <Text style={styles.loginButtonText}>Giriş Yap</Text>
  )}
</TouchableOpacity>
      </View>

      {/* Kayıt Ol */}
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Hesabın yok mu? </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('SignUp')}
          style={styles.registerButton}>
          <Text style={styles.registerLink}>Kaydol</Text>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableWithoutFeedback>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    backgroundColor:"#FFFFFF"
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    gap: 10,
    width: width * 0.8,
  },
  textInputContainer: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    height: height * 0.06,
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
    textAlign: 'center',
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
