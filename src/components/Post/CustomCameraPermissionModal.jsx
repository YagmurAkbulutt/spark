import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import SvgCameraIcon from "../../assets/cameraIcon"
import { width } from '../../utils/helpers';


const CustomCameraPermissionModal = ({ visible, onClose, onPermissionGranted }) => {
  const handlePermission = async () => {
    const permissions = Platform.OS === 'ios'
      ? [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.PHOTO_LIBRARY]
      : [PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE];
  
    let allGranted = true;
  
    for (const permission of permissions) {
      const result = await request(permission);
      if (result !== RESULTS.GRANTED) {
        allGranted = false;
      }
    }
  
    if (allGranted) {
      onPermissionGranted();
    }
  
    onClose();
  };
  

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
<SvgCameraIcon/>
          {/* Başlık */}
          <Text style={styles.title}>Sparkles'in kamerana ve fotoğraflara erişimine izin ver</Text>
          
          {/* Açıklama */}
          <Text style={styles.message}>
            Tarzını paylaşmak için kamera ve fotoğraflara erişime izin ver!
          </Text>
          
          {/* İzin Butonu */}
          <TouchableOpacity 
            style={styles.permissionButton}
            onPress={handlePermission}
          >
            <Text style={styles.permissionButtonText}>İzin Ver</Text>
          </TouchableOpacity>
          
          {/* Alt Çizgi */}
          <View style={styles.divider} />
          
          {/* Kapat Butonu */}
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>Daha Sonra</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: width * 0.75,
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
    color: '#000',
    marginTop:19
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    color: '#9D9C9C',
    lineHeight: 20,
  },
  permissionButton: {
    width: '100%',
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 16,
    height:47
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#eee',
    marginBottom: 16,
  },
  closeText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default CustomCameraPermissionModal;