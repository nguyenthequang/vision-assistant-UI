import React, { useState, useRef } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Audio } from 'expo-av'; // Import Expo Audio module for sound playback

const MainPage = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const sound = useRef(new Audio.Sound());

  // Function to add a message to the chat
  const addMessage = (text, isUser) => {
    const newMessage = { text, isUser };
    setMessages([...messages, newMessage]);
  };

  // Function to play AI response
  const playResponse = async (text) => {
    try {
      await sound.current.loadAsync(require('./your_ai_response_sound.mp3'));
      await sound.current.playAsync();
    } catch (error) {
      console.log('Error playing sound', error);
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
    // Add user message to chat
    addMessage(inputText, true);

    // Clear input field
    setInputText('');

    // Simulate AI response after 1 second (replace with actual AI interaction)
    setTimeout(() => {
      const aiResponse = "This is an AI-generated response.";
      addMessage(aiResponse, false);
      playResponse(aiResponse);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Chat messages */}
      <View style={styles.chatContainer}>
        {messages.map((message, index) => (
          <View key={index} style={message.isUser ? styles.userMessage : styles.aiMessage}>
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </View>

      {/* Speech to text input */}
      <TextInput
        style={styles.input}
        value={inputText}
        onChangeText={setInputText}
        placeholder="Type your message..."
      />

      {/* Send button */}
      <TouchableOpacity style={styles.sendButton} onPress={handleSubmit}>
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>

      {/* Mic and camera buttons */}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <Button title="Mic" onPress={handleMicPress} />
        </View>
        <View style={styles.buttonRow}>
          <Button title="Camera" onPress={handleCameraPress} />
        </View>
      </View>

      {/* Feedback buttons */}
      {/* Implement your feedback button functionality */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  chatContainer: {
    flex: 1,
    marginBottom: 20,
  },
  userMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  aiMessage: {
    backgroundColor: '#E4E4E4',
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  sendButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  sendButtonText: {
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '33%'
  },
  buttonRow: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default MainPage;
