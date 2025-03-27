import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import SvgLogoS from '../../assets/logo-s';
import SvgEyeOff from '../../assets/eyeoff';
import {useState} from 'react';
import {dismissKeyboard, height, width} from '../../utils/helpers';
import SvgBack from '../../assets/back';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/slices/authSlice';

const SignUpScreen = ({ navigation }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  // Keyboard'ı kapatma fonksiyonu
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleSignUp = () => {
    if (fullName && email && password) {
      const userData = { fullName, email, password };
      dispatch(registerUser(userData));
    } else {
      // Hata mesajı ekleyebilirsin
      console.log('Lütfen tüm alanları doldurun.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
    <View style={styles.container}>
      <View style={styles.backBtn}>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <SvgBack />
        </TouchableOpacity>
      </View>
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
              placeholder="Ad Soyad"
              placeholderTextColor="#B9B9B9"
              style={styles.textInput}
              selectionColor="#D134AA"
              value={fullName}
              onChangeText={text => {
                setFullName(text);
              }}
              onFocus={() => setFocusedInput('username')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>
          <View
            style={[
              styles.textInputContainer,
              focusedInput === 'email' && styles.focusedInput,
            ]}>
            <TextInput
              placeholder="E-posta"
              placeholderTextColor="#B9B9B9"
              style={styles.textInput}
              selectionColor="#D134AA"
              value={email}
              onChangeText={text => {
                setEmail(text);
              }}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          {/* Şifre Girişi */}
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
              selectionColor="#D134AA"
              value={password}
              onChangeText={text => {
                setPassword(text);
              }}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
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

        {/* İleri Butonu */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Username', {
              fullName: fullName,
              email: email,
              password: password,
            })
          }
          style={styles.loginButton}>
          <Text style={styles.loginButtonText}>İleri</Text>
        </TouchableOpacity>
      </View>

      {/* Girişe dön */}
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Style Up hesabım var. </Text>
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

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
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
    width: width * 0.8,
    height: height * (Platform.OS === 'android' ? 0.07 : 0.06),
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign:"center"
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
