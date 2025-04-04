import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Modal,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SvgLock from '../../assets/lock';
import SvgClose from '../../assets/close';
import { width, height } from '../../utils/helpers';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../../api/api';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    // URL'den veya parametre olarak gelen tokeni al
    if (route.params?.token) {
      setToken(route.params.token);
    } else if (global.resetPasswordToken) {
      // Deep linking ile gelen token'ı kullan
      setToken(global.resetPasswordToken);
      // Kullanıldıktan sonra global değişkeni temizle
      global.resetPasswordToken = null;
    }
  }, [route.params]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleResetPassword = async () => {
    if (!token) {
      setModalMessage('Geçersiz veya eksik şifre sıfırlama kodu');
      setModalVisible(true);
      return;
    }

    if (!password || password.length < 6) {
      setModalMessage('Şifre en az 6 karakter olmalıdır');
      setModalVisible(true);
      return;
    }

    if (password !== confirmPassword) {
      setModalMessage('Şifreler eşleşmiyor');
      setModalVisible(true);
      return;
    }

    setLoading(true);

    try {
      const response = await api.patch(`/api/auth/reset-password/${token}`, {
        password,
        confirmPassword
      });

      setModalMessage('Şifreniz başarıyla sıfırlandı. Giriş yapabilirsiniz.');
      setModalVisible(true);
      // Başarılı olduktan sonra 2 saniye bekleyip giriş sayfasına yönlendir
      setTimeout(() => {
        navigation.navigate('SignIn');
      }, 2000);
    } catch (error) {
      console.error('Şifre sıfırlama hatası:', error);
      setModalMessage(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Şifre sıfırlama sırasında bir hata oluştu'
      );
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <View style={styles.closeBtn}>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <SvgClose />
          </TouchableOpacity>
        </View>

        <View style={{ gap: 13, alignItems: 'center', justifyContent: 'center' }}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <SvgLock width={100} height={100} />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.textOne}>Şifrenizi Sıfırlayın</Text>
            <Text style={styles.textTwo}>
              Lütfen yeni şifrenizi girin ve onaylayın
            </Text>
          </View>

          {/* Giriş Alanları */}
          <View style={styles.inputContainer}>
            {/* Yeni Şifre */}
            <View
              style={[
                styles.textInputContainer,
                focusedInput === 'password' && styles.focusedInput,
              ]}
            >
              <TextInput
                placeholder="Yeni Şifre"
                placeholderTextColor="#B9B9B9"
                style={styles.textInput}
                selectionColor="#D134AA"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {/* Şifre Tekrar */}
            <View
              style={[
                styles.textInputContainer,
                focusedInput === 'confirmPassword' && styles.focusedInput,
              ]}
            >
              <TextInput
                placeholder="Şifre Tekrar"
                placeholderTextColor="#B9B9B9"
                style={styles.textInput}
                selectionColor="#D134AA"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setFocusedInput('confirmPassword')}
                onBlur={() => setFocusedInput(null)}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {/* Şifre Değiştir Butonu */}
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetPassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.resetButtonText}>Şifremi Değiştir</Text>
              )}
            </TouchableOpacity>

            {/* Bilgilendirme Modalı */}
            <Modal
              visible={isModalVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalText}>{modalMessage}</Text>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setModalVisible(false)}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    backgroundColor: "#FFFFFF"
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
  textOne: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600"
  },
  textTwo: {
    fontWeight: "400",
    textAlign: "center",
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
  resetButton: {
    backgroundColor: 'black',
    paddingVertical: height * 0.02,
    borderRadius: 5,
    alignItems: 'center',
    width: width * 0.8,
    height: height * 0.06,
    marginTop: 10,
  },
  resetButtonText: {
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
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default ResetPassword; 