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
import { setUserProfile } from '../../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';

const UsernameScreen = ({ navigation, route }) => {
  const { fullName, email, password, photo } = route.params;
  const [username, setUsername] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const currentUsername = useSelector(state => state.auth.username);
  const currentPhoto = useSelector(state => state.auth.photo);

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
      headerShown: false,
    });
    if (currentUsername) {
      setUsername(currentUsername); 
    }
  }, [navigation, currentUsername]);


  const handleUsernameSubmit = () => {
    dispatch(setUserProfile({ username, photo: currentPhoto || photo }));  // Redux'a kullanıcı adı ve fotoğrafı kaydet
    navigation.navigate("Main");
  };

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
                value={username}
                onChangeText={setUsername}
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
