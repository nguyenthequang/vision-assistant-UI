import { Camera } from "expo-camera";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
  Image,
  SafeAreaView,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";

function TakePhotoPage({ route, navigation }) {
  const [photo, setPhoto] = useState();
  let cameraRef = useRef();
  //   const { hasMediaLibraryPermission } = route.params;

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  if (photo) {
    let sendPic = () => {
      //   console.log(photo);
      navigation.navigate({
        name: "Main",
        params: { photo: photo },
        merge: true,
      });
    };

    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    return (
      <SafeAreaView style={styles.container}>
        <Image
          style={styles.photo_preview}
          source={{ uri: "data:image/jpg;base64," + photo.base64 }}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.buttonRow, { borderTopLeftRadius: 20 }]}
            title="Send"
            onPress={sendPic}
          >
            <Text style={{ fontSize: 50, color: "#FFFFFF" }}>Send</Text>
          </TouchableOpacity>
          {/* {hasMediaLibraryPermission ? (
          <Button title="Save" onPress={savePhoto} />
        ) : undefined} */}
          <TouchableOpacity
            style={[styles.buttonRow, { borderTopRightRadius: 20 }]}
            title="Discard"
            onPress={() => setPhoto(undefined)}
          >
            <Text style={{ fontSize: 50, color: "#FFFFFF" }}>Discard</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <Camera style={styles.photo_container} ref={cameraRef}>
        <View style={styles.photo_buttonContainer}>
          <TouchableOpacity
            style={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={takePic}
          >
            <Ionicons name="camera-outline" size={90} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <StatusBar style="auto" />
      </Camera>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingBottom: 0,
    paddingHorizontal: 0,
  },
  photo_container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  photo_buttonContainer: {
    backgroundColor: "#fff",
    alignSelf: "flex-end",
    height: 100,
    width: 100,
  },
  photo_preview: {
    alignSelf: "stretch",
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    height: "33%",
  },
  buttonRow: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
  },
});

export default TakePhotoPage;
