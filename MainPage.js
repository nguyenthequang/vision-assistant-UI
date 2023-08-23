import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
  SafeAreaView,
  Image,
} from "react-native";
import { Audio } from "expo-av"; // Import Expo Audio module for sound playback
import { ScrollView } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { StatusBar } from "expo-status-bar";
import * as FileSystem from "expo-file-system";
// import * as RNFS from 'react-native-fs';
import axios from "axios";
import ky from "ky";

const MainPage = ({ navigation }) => {
  const [messages, setMessages] = useState([
    {
      text: "bot",
      isUser: false,
      isAudio: false,
      audio: undefined,
      isPic: false,
      pic: undefined,
    },
    {
      text: "user",
      isUser: true,
      isAudio: false,
      audio: undefined,
      isPic: false,
      pic: undefined,
    },
  ]);
  const [inputText, setInputText] = useState("");

  // Recording states
  const [recordings, setRecordings] = useState([]);

  // Photo states
  let cameraRef = useRef();
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();

  const scrollViewRef = useRef();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);
  let recording = new Audio.Recording();

  // Function to handle microphone button press
  const getDurationFormatted = (millis) => {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  };

  const handleMicPress = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status == "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        await recording.prepareToRecordAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        await recording.startAsync();
        console.log("RECORDING");
      } else {
        console.log("Please grant permission");
      }
    } catch (error) {
      console.log("Fail to start recording", error);
    }
  };

  async function uploadAudioAsync(uri) {
    // https://stackoverflow.com/questions/64980590/how-to-upload-audio-files-with-express-backend-and-react-native
    console.log("Uploading " + uri);
    let apiUrl = "http://35.92.178.78:8000/speech2text/transcription/audio";
    let uriParts = uri.split(".");
    let fileType = uriParts[uriParts.length - 1];

    getFileSize = async fileUri => {
      let fileInfo = await FileSystem.getInfoAsync(fileUri);
      return fileInfo.size;
    };
    console.log(await getFileSize(uri));

    console.log("Read file");
    const binAudio = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem?.EncodingType?.Base64 });
    console.log("Read file DONE");

    // const reader = new FileReader();
    // reader.readAsArrayBuffer({uri: uri})
    // console.log(reader);
    // const binaryData = reader.result;

    let formData = new FormData();
    formData.append("audio_file", binAudio);
    // console.log(formData);
    console.log("Formdata");

    let options = {
      method: "POST",
      headers: {
        "Content-Type": "undefined",
      },
      body: formData
    };
    console.log(options);
    console.log("POSTing " + uri + " to " + apiUrl);
    // return await axios.post(apiUrl, {audio_file: binAudio})
    return fetch(apiUrl, options);
  }

  async function uploadAudioFS(filename, filepath) {
    var uploadUrl = "http://52.42.207.241:8000/speech2text/transcription/audio"; // For testing purposes, go to http://requestb.in/ and create your own link
    // create an array of objects of the files you want to upload
    var files = [
      {
        name: "test1",
        filename: filename,
        filepath: filepath,
        filetype: "audio/x-m4a",
      }
    ];

    var upload = (response) => {
      var jobId = response.jobId;
      console.log("UPLOAD HAS BEGUN! JobId: " + jobId);
    };

    var uploadProgress = (response) => {
      var percentage = Math.floor(
        (response.totalBytesSent / response.totalBytesExpectedToSend) * 100
      );
      console.log("UPLOAD IS " + percentage + "% DONE!");
    };

    // upload files
    RNFS.uploadFiles({
      toUrl: uploadUrl,
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      fields: {
        audio_file: "world",
      },
      begin: uploadBegin,
      progress: uploadProgress,
    })
      .promise.then((response) => {
        if (response.statusCode == 200) {
          console.log("FILES UPLOADED!"); // response.statusCode, response.headers, response.body
        } else {
          console.log("SERVER ERROR");
        }
      })
      .catch((err) => {
        if (err.description === "cancelled") {
          // cancelled by user
        }
        console.log(err);
      });
  }

  const handleMicRelease = async () => {
    console.log("STOP RECORDING");
    await recording.stopAndUnloadAsync();

    let updateRecordings = [...recordings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    updateRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI(),
    });

    // console.log(sound);

    setMessages([
      ...messages,
      {
        text: "",
        isUser: true,
        isAudio: true,
        audio: {
          sound: sound,
          duration: getDurationFormatted(status.durationMillis),
          file: recording.getURI(),
        },
        isPic: false,
        pic: undefined,
      },
    ]);

    setRecordings(updateRecordings);

    // Move the recording to the new directory with the new file name
    const fileName = `recording-${Date.now()}.wav`;
    await FileSystem.makeDirectoryAsync(
      FileSystem.documentDirectory + "recordings/",
      { intermediates: true }
    );
    const newURI = FileSystem.documentDirectory + "recordings/" + `${fileName}`;
    await FileSystem.moveAsync({
      from: recording.getURI(),
      to: newURI,
    });

    // Send to backend
    console.log("Sending to backend");
    const res = await (await uploadAudioAsync(newURI)).json();
    console.log("Post audio done");
    console.log(res);
  };

  // Function to handle camera button press

  async function uploadPhotoAsync(uri) {
    // https://stackoverflow.com/questions/64980590/how-to-upload-audio-files-with-express-backend-and-react-native
    console.log("Uploading " + uri);
    let apiUrl = "http://35.92.178.78:8000/speech2text/transcription/audio";
    let uriParts = uri.split(".");
    let fileType = uriParts[uriParts.length - 1];

    console.log("Read file");
    const binAudio = await FileSystem.readAsStringAsync(uri);
    console.log("Read file DONE");

    // const reader = new FileReader();
    // reader.readAsArrayBuffer({uri: uri})
    // console.log(reader);
    // const binaryData = reader.result;

    let formData = new FormData();
    formData.append("audio_file", binAudio);
    // console.log(formData);
    console.log("Formdata");

    let options = {
      method: "POST",
      "audio_file": binAudio,
      headers: {
        "Content-Type": "undefined",
      },
    };
    console.log(options);
    console.log("POSTing " + uri + " to " + apiUrl);
    return fetch(apiUrl, options);
  }

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
      setMessages([
        ...messages,
        {
          text: "",
          isUser: true,
          isAudio: false,
          audio: undefined,
          isPic: true,
          pic: photo,
        },
      ]);
      setPhoto(undefined);
      setIsTakingPhoto(false);


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
        <Button title="Send" onPress={sendPic} />
        {hasMediaLibraryPermission ? (
          <Button title="Save" onPress={savePhoto} />
        ) : undefined}
        <Button title="Discard" onPress={() => setPhoto(undefined)} />
      </SafeAreaView>
    );
  }

  const handleCameraPress = () => {
    // Implement camera functionality
  };

  // Function to handle message submission
  const handleSubmit = () => {
    setMessages([
      ...messages,
      {
        text: "bot message",
        isUser: false,
        isAudio: false,
        audio: undefined,
        isPic: false,
        pic: undefined,
      },
    ]);

    // Clear input field
    setInputText("");
  };

  if (isTakingPhoto) {
    return (
      <Camera style={styles.photo_container} ref={cameraRef}>
        <View style={styles.photo_buttonContainer}>
          <Button title="Take Pic" onPress={takePic} />
        </View>
        <View style={styles.photo_buttonContainer}>
          <Button title="Back" onPress={() => setIsTakingPhoto(false)} />
        </View>
        <StatusBar style="auto" />
      </Camera>
    );
  } else {
    return (
      <View style={styles.container}>
        {/* Chat messages */}
        <ScrollView
          style={styles.chatContainer}
          ref={scrollViewRef}
          onContentSizeChange={() => {
            scrollViewRef?.current?.scrollToEnd({ animated: true });
          }}
        >
          {messages.map((message, index) => {
            // console.log(message);
            return (
              <View
                key={index}
                style={
                  message.isUser
                    ? message.isPic
                      ? styles.userMessagePic
                      : styles.userMessage
                    : styles.aiMessage
                }
              >
                {message.isAudio ? (
                  <Button
                    style={styles.button}
                    onPress={() => message.audio.sound.replayAsync()}
                    title="Play"
                  ></Button>
                ) : message.isPic ? (
                  <Image
                    style={[styles.photo_preview]}
                    source={{
                      uri: "data:image/jpg;base64," + message.pic.base64,
                    }}
                  />
                ) : (
                  <Text style={styles.messageText}>{message.text}</Text>
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* Speech to text input */}
        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={(inputText) => {
              setInputText(inputText);
            }}
            placeholder="Type your message..."
          />

          {/* Send button */}
          <TouchableOpacity style={styles.sendButton} onPress={handleSubmit}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>

        {/* Mic and camera buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.buttonRow, { borderTopLeftRadius: 20 }]}
            onLongPress={handleMicPress}
            onPressOut={handleMicRelease}
          >
            <Ionicons name="md-mic" size={150} color="#EBEBEB" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonRow, { borderTopRightRadius: 20 }]}
            onPress={() => setIsTakingPhoto(true)}
          >
            <Ionicons name="camera-outline" size={150} color="#EBEBEB" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  photo_container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  photo_buttonContainer: {
    backgroundColor: "#fff",
    alignSelf: "flex-end",
  },
  photo_preview: {
    alignSelf: "stretch",
    flex: 1,
  },
  container: {
    width: "100%",
    height: "100%",
    paddingBottom: 0,
    paddingHorizontal: 0,
  },
  chatContainer: {
    flex: 1,
    marginBottom: 20,
  },
  userMessage: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  userMessagePic: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
    width: "80%",
    height: 500,
  },
  aiMessage: {
    backgroundColor: "#E4E4E4",
    alignSelf: "flex-start",
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    flex: 5,
  },
  sendButton: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  sendButtonText: {
    color: "white",
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

export default MainPage;
