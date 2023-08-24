import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const FeedbackPage = ({ route, navigation }) => {
  // const navigation = useNavigation();
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
      <View style={styles.spacer} />

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
    height: 50, // Add space between the buttons and the input
  },
});

export default FeedbackPage;
