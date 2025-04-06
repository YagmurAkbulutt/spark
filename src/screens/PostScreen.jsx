import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image, Platform, Alert, Linking, Modal } from "react-native";
import { Camera, CameraType } from "react-native-camera-kit";
import SvgFlash from "../assets/flash";
import SvgTurnCam from "../assets/turnCam";
import SvgTimer from "../assets/timer";
import SvgTakePhoto from "../assets/takePhoto";
import { launchImageLibrary } from "react-native-image-picker";
import SvgClose from "../assets/closeLight"; 
import SvgFilter from "../assets/filterPhoto";
import SvgNext from "../assets/next";
import RNFS from "react-native-fs";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { height, width } from "../utils/helpers";
import { ColorMatrix as CM, saturate, invert, brightness, grayscale, sepia } from 'react-native-color-matrix-image-filters';
import CustomCameraPermissionModal from "../components/Post/CustomCameraPermissionModal";

const PostScreen = ({ navigation }) => { 
  const [cameraType, setCameraType] = useState(CameraType.Back);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [timer, setTimer] = useState(0);
  const [showTimerOptions, setShowTimerOptions] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [torchMode, setTorchMode] = useState("off");
  const [lastGalleryPhoto, setLastGalleryPhoto] = useState(null);
  const [filterActive, setFilterActive] = useState(false); 
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const cameraRef = useRef(null);

  // Kamera ve galeri izinlerini kontrol et


  // İzin durumunu saklamak için AsyncStorage key'i
  const PERMISSION_STORAGE_KEY = '@camera_permissions_granted';

  // Kamera ve galeri izinlerini kontrol et
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        // Önce AsyncStorage'den izin durumunu kontrol et
        const permissionsGranted = await AsyncStorage.getItem(PERMISSION_STORAGE_KEY);
        
        if (permissionsGranted === 'true') {
          return; // İzinler zaten verilmiş
        }

        // Kamera izni kontrolü
        const cameraPermission = Platform.OS === 'ios' 
          ? PERMISSIONS.IOS.CAMERA 
          : PERMISSIONS.ANDROID.CAMERA;
        
        const cameraResult = await check(cameraPermission);
        
        // Galeri izni kontrolü
        let galleryResult = RESULTS.GRANTED;
        if (Platform.OS === 'android') {
          galleryResult = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        } else {
          galleryResult = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
        }

        // Eğer her iki izin de verilmişse
        if (cameraResult === RESULTS.GRANTED && galleryResult === RESULTS.GRANTED) {
          await AsyncStorage.setItem(PERMISSION_STORAGE_KEY, 'true');
        } else {
          // Eksik izinler varsa modalı göster
          setShowPermissionModal(true);
        }
      } catch (error) {
        console.error("İzin kontrol hatası:", error);
      }
    };

    checkPermissions();
    getLastGalleryPhoto();
  }, []);

  const handlePermissionGranted = async () => {
    try {
      // İzinleri iste
      const cameraPermission = Platform.OS === 'ios' 
        ? PERMISSIONS.IOS.CAMERA 
        : PERMISSIONS.ANDROID.CAMERA;
      
      let galleryPermission;
      if (Platform.OS === 'android') {
        galleryPermission = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      } else {
        galleryPermission = PERMISSIONS.IOS.PHOTO_LIBRARY;
      }

      const [cameraResult, galleryResult] = await Promise.all([
        request(cameraPermission),
        request(galleryPermission)
      ]);

      // Eğer her iki izin de verilmişse
      if (cameraResult === RESULTS.GRANTED && galleryResult === RESULTS.GRANTED) {
        await AsyncStorage.setItem(PERMISSION_STORAGE_KEY, 'true');
        setShowPermissionModal(false);
      } else {
        // Kullanıcıya ayarlardan izin vermesi gerektiğini söyle
        Alert.alert(
          'İzin Gerekli',
          'Uygulamayı kullanabilmek için ayarlardan izinleri açmalısınız',
          [
            {
              text: 'Ayarlara Git',
              onPress: () => Linking.openSettings()
            },
            {
              text: 'İptal',
              style: 'cancel'
            }
          ]
        );
      }
    } catch (error) {
      console.error("İzin isteği hatası:", error);
    }
  };

  const getLastGalleryPhoto = async () => {
    try {
      let photosDir = "";
      if (Platform.OS === "android") {
        photosDir = `${RNFS.ExternalStorageDirectoryPath}/DCIM/Camera`;
      } else {
        photosDir = `${RNFS.LibraryDirectoryPath}/DCIM`;
      }

      const files = await RNFS.readDir(photosDir);
      const sortedFiles = files
        .filter(file => file.isFile() && (file.name.endsWith(".jpg") || file.name.endsWith(".png")))
        .sort((a, b) => b.mtime - a.mtime);

      if (sortedFiles.length > 0) {
        setLastGalleryPhoto(`file://${sortedFiles[0].path}`);
      }
    } catch (error) {
      console.error("Galeri fotoğrafı alınamadı:", error);
    }
  };

  // const handlePermissionGranted = () => {
  //   setShowPermissionModal(false);
  //   // Kamera kullanıma hazır
  // };

  // const handlePermissionDenied = () => {
  //   Alert.alert(
  //     "İzin Gerekli",
  //     "Uygulamanın düzgün çalışması için kamera izni gereklidir",
  //     [
  //       {
  //         text: "Ayarlara Git",
  //         onPress: () => Linking.openSettings()
  //       },
  //       {
  //         text: "Kapat",
  //         style: "cancel"
  //       }
  //     ]
  //   );
  //   setShowPermissionModal(false);
  // };

  const toggleCameraType = () => {
    setCameraType((prevType) =>
      prevType === CameraType.Back ? CameraType.Front : CameraType.Back
    );
  };

  const toggleFlash = () => {
    setTorchMode((flashMode) => (flashMode === "off" ? "on" : "off"));
  };

  const takePicture = async () => {
    if (timer > 0) {
      let count = timer;
      const interval = setInterval(() => {
        if (count === 1) {
          clearInterval(interval);
          capturePhoto();
        }
        count--;
      }, 1000);
    } else {
      capturePhoto();
      setCountdown(null);
    }
  };

  const capturePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.capture();
        setCapturedPhoto(photo.uri);
      } catch (error) {
        console.error("Fotoğraf çekme hatası:", error);
        Alert.alert("Hata", "Fotoğraf çekilirken bir hata oluştu");
      }
    }
  };

  const startCountdown = () => {
    if (timer > 0) {
      setCountdown(timer);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      setTimeout(() => {
        takePicture();
      }, timer * 1000);
    } else {
      takePicture();
    }
  };

  const openGallery = () => {
    launchImageLibrary({ mediaType: "photo", quality: 0.5 }, (response) => {
      if (!response.didCancel && response.assets) {
        const lastPhoto = response.assets[response.assets.length - 1];
        setLastGalleryPhoto(lastPhoto.uri);
      }
    });
  };

  const closeScreen = () => {
    setCapturedPhoto(null);
    navigation.goBack();
  };

  const filters = [
    { name: "Invert", action: invert() },
    { name: "Saturate", action: saturate(2) },
    { name: "Brightness", action: brightness(0.5) },
    { name: "Grayscale", action: grayscale() },
    { name: "Sepia", action: sepia() }
  ];

  return (
    <View style={styles.container}>
      {/* Always show the camera interface */}
      <>
        {!capturedPhoto ? (
          <Camera
            ratioOverlay={true}
            ref={cameraRef}
            style={styles.camera}
            cameraType={cameraType}
            zoomMode="off"
            focusMode="off"
            flashMode={torchMode}
            torchMode={torchMode}
            laserColor="transparent"
            frameColor="transparent"
            scanBarcode={false}
            showFrame={false}
            barcodeFrameSize={{ width: "100%", height: "100%" }}
          />
        ) : (
          <Image source={{ uri: capturedPhoto }} style={styles.preview} />
        )}
  
        <TouchableOpacity onPress={closeScreen} style={styles.closeButton}>
          <SvgClose />
        </TouchableOpacity>
  
        <View style={styles.topRightControls}>
          {!capturedPhoto ? (
            <>
              <TouchableOpacity onPress={toggleFlash} style={styles.iconButton}>
                <SvgFlash />
              </TouchableOpacity>
  
              <TouchableOpacity onPress={toggleCameraType} style={styles.iconButton}>
                <SvgTurnCam />
              </TouchableOpacity>
  
              <TouchableOpacity
                onPress={() => setShowTimerOptions(!showTimerOptions)}
                style={styles.iconButton}
              >
                <SvgTimer />
                <Text style={styles.timerText}>{timer}s</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              onPress={() => navigation.navigate("PostConfirm", { photoUri: capturedPhoto })} 
              style={styles.iconButton}
            >
              <SvgNext />
            </TouchableOpacity>
          )}
        </View>
  
        {showTimerOptions && (
          <View style={styles.timerDropdown}>
            {[0, 3, 5, 10].map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => {
                  setTimer(t);
                  setShowTimerOptions(false);
                }}
                style={styles.timerOption}
              >
                <Text style={styles.timerText}>{t}s</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
  
        {countdown !== null && (
          <View style={{ position: "absolute", top: "40%", left: "50%", transform: [{ translateX: -50 }] }}>
            <Text style={{ fontSize: 50, color: "black", fontWeight: "bold" }}>{countdown}</Text>
          </View>
        )}
  
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => setFilterActive(!filterActive)} style={styles.filterButton}>
            <SvgFilter />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={startCountdown} style={styles.captureButton}>
            <SvgTakePhoto />
          </TouchableOpacity>
  
          <TouchableOpacity onPress={openGallery} style={styles.galleryButton}>
            {lastGalleryPhoto ? (
              <Image source={{ uri: lastGalleryPhoto }} style={styles.galleryImage} />
            ) : (
              <Text style={styles.galleryText}>Galeri</Text>
            )}
          </TouchableOpacity>
        </View>
  
        {filterActive && (
          <View style={styles.filterOptions}>
            {filters.map((filter, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedFilter(filter.action)}
                style={styles.filterOption}
              >
                <Text>{filter.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
  
        {capturedPhoto && (
          <CM matrix={selectedFilter ? [selectedFilter] : []}>
            <Image source={{ uri: capturedPhoto }} style={styles.preview} />
          </CM>
        )}
      </>
  
      {/* Permission Modal - will appear on top of camera */}
      {showPermissionModal && (
        <Modal
          transparent={true}
          animationType="none"
          visible={showPermissionModal}
        >
          <View style={styles.modalContainer}>
            <CustomCameraPermissionModal
              onPermissionGranted={handlePermissionGranted}
            />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Yarı şeffaf arka plan
  },
  container: { 
    width: "100%",
    height: "100%"
  },
  camera: { 
    width: "100%",
    height: "100%"
  },
  preview: { 
    flex: 1, 
    resizeMode: "cover" 
  },
  controls: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly", 
    alignItems: "center",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  filterButton: {
    width: 59,
    height: 59,
    borderRadius: 5,
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  galleryButton: {
    width: 59,
    height: 59,
    borderRadius: 5,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  galleryImage: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },
  topRightControls: {
    position: "absolute",
    marginTop: 60,
    right: 20,
    alignItems: "center",
  },
  iconButton: {
    marginBottom: 15,
    alignItems: "center",
  },
  timerDropdown: {
    position: "absolute",
    top: height * 0.26,
    right: 15,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 5,
    borderRadius: 5,
  },
  timerOption: {
    padding: 5,
  },
  timerText: {
    color: "white",
    fontSize: 16,
  },
  closeButton: {
    position: "absolute",
    marginTop: 60,
    left: 20,
  },
  filterOptions: {
    position: "absolute",
    bottom: 120,
    left: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    flexDirection: "row"
  },
  filterOption: {
    padding: 8,
    marginHorizontal: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 5
  }
});

export default PostScreen;