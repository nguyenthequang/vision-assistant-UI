import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { Audio } from "expo-av"; // Import Expo Audio module for sound playback
import { ScrollView } from "react-native-gesture-handler";
import Ionicons from '@expo/vector-icons/Ionicons';

const MainPage = ({ navigation }) => {
  const [messages, setMessages] = useState([
    { text: "bot", isUser: false },
    { text: "user", isUser: true },
  ]);
  const [inputText, setInputText] = useState("");
  const sound = useRef(new Audio.Sound());

  // Function to play AI response
  const playResponse = async (text) => {
    try {
      await sound.current.loadAsync(require("./your_ai_response_sound.mp3"));
      await sound.current.playAsync();
    } catch (error) {
      console.log("Error playing sound", error);
    }
  };

  // Function to handle microphone button press
  const handleMicPress = () => {
    // Implement microphone functionality
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
          return (
            <View
              key={index}
              style={message.isUser ? styles.userMessage : styles.aiMessage}
            >
              <Text style={styles.messageText}>{message.text}</Text>
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
          onPress={handleMicPress}
        >
          <Ionicons name='md-mic' size={150} color='#EBEBEB' />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonRow, { borderTopRightRadius: 20 }]}
          onPress={handleCameraPress}
        >
          <Ionicons name='camera-outline' size={150} color='#EBEBEB' />
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
