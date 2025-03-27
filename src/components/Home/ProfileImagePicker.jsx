import { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from "react-native";
import SvgPinkPlus from "../../assets/pinkplus"
import { launchImageLibrary } from "react-native-image-picker";

const ProfileImagePicker = () => {
  const [imageUri, setImageUri] = useState(null);
   // Android için galeri izni isteme 
  // const requestGalleryPermission = async () => {
  //   if (Platform.OS === "android") {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
  //     );
  //     return granted === PermissionsAndroid.RESULTS.GRANTED;
  //   }
  //   return true;
  // };

  // Galeriden fotoğraf seçme işlemi
  const selectImage = async () => {
    // const hasPermission = await requestGalleryPermission();
    // if (!hasPermission) {
    //   alert("Galeriyi açmak için izin vermelisin!");
    //   return;
    // }

    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        alert("Fotoğraf seçme hatası: " + response.errorMessage);
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image source={imageUri ? { uri: imageUri } : require("../../assets/profilePhoto.png")} style={styles.profileImage} />
      </View>
      <TouchableOpacity style={styles.plusButton} onPress={selectImage}>
          <SvgPinkPlus/>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  imageWrapper: {
    position: "relative",
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  defaultImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ddd",
    borderRadius: 50,
  },
  plusButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProfileImagePicker;
