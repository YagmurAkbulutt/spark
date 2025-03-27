import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import {useEffect, useState} from 'react';
import SvgLock from '../../assets/lock';
import SvgClose from '../../assets/close';
import { dismissKeyboard, height, width } from '../../utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../../redux/slices/authSlice';


const ForgetPassword = ({ navigation }) => {
  const dispatch = useDispatch();
  const { isLoading, error, message } = useSelector((state) => state.auth); // Redux durumları
  const [email, setEmail] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false); 
  const handleForgotPassword = () => {
    if (email.trim()) {
      dispatch(forgotPassword(email)); // Redux'a e-posta gönderimi
    }
  };
  useEffect(() => {
    if (message) {
      setModalVisible(true); 
    }
  }, [message]);
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <View style={styles.closeBtn}>
          <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
            <SvgClose />
          </TouchableOpacity>
        </View>

        <View style={{ gap: 13, alignItems: "center", justifyContent: "center" }}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <SvgLock width={width * 0.2} height={width * 0.2} />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.textOne}>Girişte sorun mu yaşıyorsun?</Text>
            <Text style={styles.textTwo}>
              Kullanıcı adını veya e-posta adresini gir ve sana yeniden hesabına
              girebilmen için bir bağlantı gönderelim
            </Text>
          </View>

          {/* Giriş Alanları */}
          <View style={styles.inputContainer}>
            {/* Kullanıcı adı veya e-posta */}
            <View
              style={[
                styles.textInputContainer,
                focusedInput === "username" && styles.focusedInput,
              ]}
            >
              <TextInput
                placeholder="Kullanıcı adı veya e-posta"
                placeholderTextColor="#B9B9B9"
                style={styles.textInput}
                selectionColor='#D134AA'
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedInput("username")}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            {/* Gönder Butonu */}
            <TouchableOpacity style={styles.loginButton} onPress={handleForgotPassword}>
              <Text style={styles.loginButtonText}>Gönder</Text>
            </TouchableOpacity>

            <Modal
          visible={isModalVisible} 
          transparent={true} 
          animationType="fade" 
          onRequestClose={() => setModalVisible(false)} 
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{message}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeModalText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05, 
    backgroundColor:"#FFFFFF"
  },
  closeBtn: {
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
  textOne:{
    textAlign:"center",
    fontSize: 16,
    fontWeight:"600"
  },
  textTwo:{
    fontWeight:"400",
    textAlign:"center",
    width: width * 0.7
  },
  inputContainer: {
    gap: 13,
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
  textInput: {
    paddingTop: height * 0.02, 
    paddingBottom: height * 0.02, 
    fontWeight: '500',
    width: '100%',
  },
  focusedInput: {
    borderColor: '#000', 
  },
  loginButton: {
    backgroundColor: 'black',
    paddingVertical: height * 0.02, 
    borderRadius: 5,
    alignItems: 'center',
    width: width * 0.8, 
    height: height * 0.06, 
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    color: "green",
    marginBottom: 10,
  },
  closeModalText: {
    color: "blue",
    fontWeight: "bold",
  },
});
