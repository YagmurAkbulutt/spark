import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {useEffect, useState} from 'react';
import SvgLock from '../../assets/lock';
import SvgClose from '../../assets/close';
import { dismissKeyboard, height, width } from '../../utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, resetForgotPasswordState } from '../../redux/slices/authSlice';


const ForgetPassword = ({ navigation }) => {
  const dispatch = useDispatch();
  const { forgotPasswordLoading, forgotPasswordError, forgotPasswordSuccess } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const { isLoading, error, message } = useSelector((state) => state.auth); 
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleSubmit = async () => {
    if (!email.trim()) {
      setModalMessage("Lütfen geçerli bir e-posta adresi giriniz");
      setModalVisible(true);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setModalMessage("Lütfen geçerli bir e-posta formatı giriniz");
      setModalVisible(true);
      return;
    }

    try {
      const resultAction = await dispatch(forgotPassword(email));
      if (forgotPassword.fulfilled.match(resultAction)) {
        setModalMessage(resultAction.payload.message || "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi!");
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Şifre sıfırlama hatası:", error);
    }
  };

  // Modal'ı kapatma fonksiyonu
  const closeModal = () => {
    setModalVisible(false);
    if (forgotPasswordSuccess) {
      navigation.navigate("SignIn");
    }
    dispatch(resetForgotPasswordState());
  };

  useEffect(() => {
    if (forgotPasswordError || forgotPasswordSuccess) {
      setModalMessage(forgotPasswordError || forgotPasswordSuccess);
      setModalVisible(true);
    }
  }, [forgotPasswordError, forgotPasswordSuccess]);

  useEffect(() => {
    if (message) {
      setModalVisible(true); 
    }
  }, [message]);

  // Eğer şifre sıfırlama e-postası gönderildiyse, kullanıcıya ne yapması gerektiğini açıkla
  useEffect(() => {
    if (forgotPasswordSuccess) {
      const successMessage = `
        Şifre sıfırlama bağlantısı e-posta adresinize gönderildi!
        
        Lütfen e-postanızı kontrol edin ve şifre sıfırlama bağlantısına tıklayın.
        
        Not: Eğer uygulama otomatik olarak açılmazsa, bağlantı yerine gelen kodu kopyalayıp buraya yapıştırabilirsiniz.
      `;
      setModalMessage(successMessage);
    }
  }, [forgotPasswordSuccess]);

  return (
  //   <TouchableWithoutFeedback onPress={dismissKeyboard}>
  //     <View style={styles.container}>
  //       <View style={styles.closeBtn}>
  //         <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
  //           <SvgClose />
  //         </TouchableOpacity>
  //       </View>

  //       <View style={{ gap: 13, alignItems: "center", justifyContent: "center" }}>
  //         {/* Logo */}
  //         <View style={styles.logoContainer}>
  //           <SvgLock width={width * 0.2} height={width * 0.2} />
  //         </View>

  //         <View style={styles.textContainer}>
  //           <Text style={styles.textOne}>Girişte sorun mu yaşıyorsun?</Text>
  //           <Text style={styles.textTwo}>
  //             Kullanıcı adını veya e-posta adresini gir ve sana yeniden hesabına
  //             girebilmen için bir bağlantı gönderelim
  //           </Text>
  //         </View>

  //         {/* Giriş Alanları */}
  //         <View style={styles.inputContainer}>
  //           {/* Kullanıcı adı veya e-posta */}
  //           <View
  //             style={[
  //               styles.textInputContainer,
  //               focusedInput === "username" && styles.focusedInput,
  //             ]}
  //           >
  //             <TextInput
  //               placeholder="Kullanıcı adı veya e-posta"
  //               placeholderTextColor="#B9B9B9"
  //               style={styles.textInput}
  //               selectionColor='#D134AA'
  //               value={email}
  // onChangeText={(text) => setEmail(text)} 
  //               onFocus={() => setFocusedInput("username")}
  //               onBlur={() => setFocusedInput(null)}
  //               autoCapitalize='none'
  //             />
  //           </View>

  //           {/* Gönder Butonu */}
  //           <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
  //             <Text style={styles.loginButtonText}>Gönder</Text>
  //           </TouchableOpacity>

  //           <Modal
  //         visible={isModalVisible} 
  //         transparent={true} 
  //         animationType="fade" 
  //         onRequestClose={() => setModalVisible(false)} 
  //       >
  //         <View style={styles.modalOverlay}>
  //           <View style={styles.modalContent}>
  //             <Text style={styles.modalText}>{message}</Text>
  //             <TouchableOpacity onPress={() => setModalVisible(false)}>
  //               <Text style={styles.closeModalText}>Kapat</Text>
  //             </TouchableOpacity>
  //           </View>
  //         </View>
  //       </Modal>
  //         </View>
  //       </View>
  //     </View>
  //   </TouchableWithoutFeedback>
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
            <SvgLock width={100} height={100} />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.textOne}>Girişte sorun mu yaşıyorsun?</Text>
            <Text style={styles.textTwo}>
              E-posta adresini gir ve sana yeniden hesabına girebilmen için bir bağlantı gönderelim
            </Text>
          </View>

          {/* Giriş Alanları */}
          <View style={styles.inputContainer}>
            {/* E-posta girişi */}
            <View
              style={[
                styles.textInputContainer,
                focusedInput === "email" && styles.focusedInput,
              ]}
            >
              <TextInput
                placeholder="E-posta adresiniz"
                placeholderTextColor="#B9B9B9"
                style={styles.textInput}
                selectionColor="#D134AA"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput(null)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Gönder Butonu */}
            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={handleSubmit}
              disabled={forgotPasswordLoading}
            >
              {forgotPasswordLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Gönder</Text>
              )}
            </TouchableOpacity>

            {/* Bilgilendirme Modalı */}
            <Modal
              visible={isModalVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={closeModal}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalText}>{modalMessage}</Text>
                  <TouchableOpacity 
                    style={styles.modalButton}
                    onPress={closeModal}
                  >
                    <Text style={styles.modalButtonText}>Tamam</Text>
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
