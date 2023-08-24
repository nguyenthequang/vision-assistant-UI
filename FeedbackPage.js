import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Button,
  Image,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const FeedbackPage = ({ route, navigation }) => {
  // const navigation = useNavigation();
  const { message } = route.params;
  const [feedback, setFeedback] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionPress = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    // Implement submission logic here
    console.log(
      "Feedback submitted:",
      feedback,
      "Selected option:",
      selectedOption
    );
    // Clear the feedback field and reset selected option
    setFeedback("");
    setSelectedOption(null);
  };

  const renderOptionButton = (option, color, darkerColor) => (
    <TouchableOpacity
      style={[
        styles.button,
        selectedOption === option
          ? { backgroundColor: darkerColor }
          : { backgroundColor: color },
      ]}
      onPress={() => handleOptionPress(option)}
    >
      <Text style={styles.buttonText}>{option}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* X button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="close" size={30} color="white" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>FEEDBACK</Text>

      {/* Spacer */}
      <View style={styles.spacer}>
        <TouchableOpacity
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
              onPress={async () => {
                await message.audio.sound.replayAsync();
                // message.audio.sound.unloadAsync();
              }}
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
        </TouchableOpacity>
      </View>

      {/* Like, Dislike, Neutral buttons */}
      <View style={styles.buttonContainer}>
        {renderOptionButton("Like", "darkgreen", "purple")}
        {renderOptionButton("Dislike", "red", "purple")}
        {renderOptionButton("Neutral", "darkgoldenrod", "purple")}
      </View>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* User Input field */}
      <TextInput
        style={styles.input}
        value={feedback}
        onChangeText={(text) => setFeedback(text)}
        placeholder="Enter your feedback..."
      />

      {/* Submit button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
    padding: 20,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: "green",
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  spacer: {
    height: "50%", // Add space between the buttons and the input
  },
  photo_preview: {
    alignSelf: "stretch",
    flex: 1,
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
});

export default FeedbackPage;
