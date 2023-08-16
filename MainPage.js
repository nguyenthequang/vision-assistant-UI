import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
} from "react-native";
import { Audio } from "expo-av"; // Import Expo Audio module for sound playback
import { ScrollView } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";

const MainPage = ({ navigation }) => {
  const [messages, setMessages] = useState([
    { text: "bot", isUser: false, isAudio: false, audio: undefined },
    { text: "user", isUser: true, isAudio: false, audio: undefined },
  ]);
  const [inputText, setInputText] = useState("");
  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState([]);

  const sound = useRef(new Audio.Sound());

  // Function to handle microphone button press
  const getDurationFormatted = (millis) => {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  };

  const getRecordingLines = () => {
    return recordings.map((recordingLine, index) => {
      // console.log("In getRecordingLines: ", recordingLine);
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>
            Recording {index + 1} - {recordingLine.duration}
          </Text>
          <Button
            style={styles.button}
            onPress={() => recordingLine.sound.replayAsync()}
            title="Play"
          ></Button>
          <Button
            style={styles.button}
            onPress={() => Sharing.shareAsync(recordingLine.file)}
            title="Share"
          ></Button>
        </View>
      );
    });
  };

  const handleMicPress = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status == "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        console.log("RECORDING");
        setRecording(recording);
      } else {
        console.log("Please grant permission");
      }
    } catch (error) {
      console.log("Fail to start recording", error);
    }
  };

  const handleMicRelease = async () => {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    console.log("STOP RECORDING");
    console.log(recording.getURI());

    let updateRecordings = [...recordings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    updateRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI(),
    });

    setMessages([
      ...messages,
      { text: "", isUser: true, isAudio: true, audio: {
        sound: sound,
        duration: getDurationFormatted(status.durationMillis),
        file: recording.getURI(),
      } },
    ]);

    setRecordings(updateRecordings);
  };

  // Function to handle camera button press
  const handleCameraPress = () => {
    // Implement camera functionality
  };

  // Function to handle message submission
  const handleSubmit = () => {
    setMessages([
      ...messages,
      { text: "This is an AI--generated response.", isUser: false },
    ]);

    // Add user message to chat
    setMessages([...messages, { text: inputText, isUser: true }]);

    // Clear input field
    setInputText("");
  };

  return (
    <View style={styles.container}>
      {/* Chat messages */}
      <ScrollView style={styles.chatContainer}>
        {messages.map((message, index) => {
          // console.log(message);
          return (
            <View
              key={index}
              style={message.isUser ? styles.userMessage : styles.aiMessage}
            >
              {message.isAudio ? (
                <Button
                  style={styles.button}
                  onPress={() => message.audio.sound.replayAsync()}
                  title="Play"></Button>
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
      {/* {getRecordingLines()} */}

      {/* Mic and camera buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.buttonRow, { borderTopLeftRadius: 20 }]}
          onPressIn={handleMicPress}
          onPressOut={handleMicRelease}
        >
          <Ionicons name="md-mic" size={150} color="#EBEBEB" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonRow, { borderTopRightRadius: 20 }]}
          onPress={handleCameraPress}
        >
          <Ionicons name="camera-outline" size={150} color="#EBEBEB" />
        </TouchableOpacity>
      </View>

      {/* Feedback buttons */}
      {/* Implement your feedback button functionality */}
    </View>
  );
};

const styles = StyleSheet.create({
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
