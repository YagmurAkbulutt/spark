import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
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
import { height } from "../utils/helpers";
import { ColorMatrix as CM , saturate, invert, brightness, grayscale, sepia } from 'react-native-color-matrix-image-filters';



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
  const cameraRef = useRef(null);


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
      setCountdown(null)
    }
  };

  const capturePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.capture();
      setCapturedPhoto(photo.uri);  
    }
  };

  const startCountdown = () => {
    if (timer > 0) {
      setCountdown(timer);  // Başlangıçta countdown'u başlatıyoruz

      // Sayaç zamanlayıcısını başlatıyoruz
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(interval); // Sayaç sıfırlanana kadar interval'ı temizle
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      // Fotoğrafı çekmek için timer süresi kadar bekliyoruz
      setTimeout(() => {
        takePicture(); // Timer süresi bitince fotoğraf çek
      }, timer * 1000); // Timer süresi (saniye) kadar bekleyip fotoğraf çek
    } else {
      takePicture(); // Timer 0 ise fotoğrafı hemen çek
    }
  };

  useEffect(() => {
    setCapturedPhoto(null); 
  }, []);
  

  useEffect(() => {
    const getLastPhoto = async () => {
      // 📌 Android için izin iste
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
      } else {
        // 📌 iOS için izin kontrolü ve isteği
        const permission = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
        if (permission !== RESULTS.GRANTED) {
          await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        }
      }

      try {
        let photosDir = "";
        if (Platform.OS === "android") {
          photosDir = `${RNFS.ExternalStorageDirectoryPath}/DCIM/Camera`; // Android için
        } else {
          photosDir = `${RNFS.LibraryDirectoryPath}/DCIM`; // iOS için
        }

        const files = await RNFS.readDir(photosDir);

        const sortedFiles = files
          .filter(file => file.isFile() && (file.name.endsWith(".jpg") || file.name.endsWith(".png")))
          .sort((a, b) => b.mtime - a.mtime);

        if (sortedFiles.length > 0) {
          setLastGalleryPhoto(`file://${sortedFiles[0].path}`);
        }
      } catch (error) {
        // console.error("Son fotoğraf alınamadı:", error);
      }
    };

    getLastPhoto();
  }, []);



  const openGallery = () => {
    launchImageLibrary({ mediaType: "photo", quality: 0.5 }, (response) => {
      if (!response.didCancel && response.assets) {
        const lastPhoto = response.assets[response.assets.length - 1];
        setLastGalleryPhoto(lastPhoto.uri);
      }
    });
  };

  

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      setCapturedPhoto(null);
    });
  
    return unsubscribe;
  }, [navigation]);
  

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
     />
     
     
      
      ) : (
        <Image source={{ uri: capturedPhoto }} style={styles.preview} />
      )}

      {/* Sol üst köşeye close butonu */}
      <TouchableOpacity onPress={closeScreen} style={styles.closeButton}>
        <SvgClose />
      </TouchableOpacity>

      {/* Sağ üst köşeye diğer butonlar */}
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
          <TouchableOpacity onPress={() => navigation.navigate("PostConfirm", { photoUri: capturedPhoto })} style={styles.iconButton}>
            <SvgNext />
          </TouchableOpacity>
        )}
      </View>

      {/* Timer seçenekleri */}
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

        {/* Geri Sayım Gösterimi */}
        {countdown !== null && (
        <View style={{ position: "absolute", top: "40%", left: "50%", transform: [{ translateX: -50 }] }}>
          <Text style={{ fontSize: 50, color: "black", fontWeight: "bold" }}>{countdown}</Text>
        </View>
      )}

      {/* Fotoğraf çekme ve galeri butonları */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => setFilterActive(!filterActive)} style={styles.filterButton}>
          <SvgFilter/>
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
      {/* Filtre seçeneklerini aç */}
      {filterActive && (
  <View style={styles.filterOptions}>
    {filters.map((filter, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => {
          console.log('Filter selected:', filter.action); // Log the selected filter
          setSelectedFilter(filter.action); // Set the selected filter
        }}
        style={styles.filterOption}
      >
        <Text>{filter.name}</Text>
      </TouchableOpacity>
    ))}
  </View>
)}
      {capturedPhoto && (
          <CM
          matrix={selectedFilter ? [selectedFilter] : []}
          >
            <Image
              source={{ uri: capturedPhoto }}
              style={styles.preview}
            />
          </CM>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width:"100%" ,
    height:"100%"
    // backgroundColor: 'transparent' 
  },
  camera: { width:"100%" ,
  height:"100%",
  // backgroundColor: 'transparent' 
},
  preview: { flex: 1, resizeMode: "cover" },
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
});

export default PostScreen;
