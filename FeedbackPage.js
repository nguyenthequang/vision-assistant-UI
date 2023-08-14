import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';

const FeedbackPage = ({ navigation, route }) => {
  const { message } = route.params;
  const [feedback, setFeedback] = useState('');
  
  const handleFeedbackSubmit = () => {
    // Implement feedback submission
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FEEDBACK</Text>
      <Text style={styles.message}>{message}</Text>

      {/* Like, Dislike, Neutral buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.feedbackButton}>
          <Text>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.feedbackButton}>
          <Text>Dislike</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.feedbackButton}>
          <Text>Neutral</Text>
        </TouchableOpacity>
      </View>

      {/* Feedback input */}
      <TextInput
        style={styles.feedbackInput}
        placeholder="Type your feedback..."
        value={feedback}
        onChangeText={setFeedback}
      />

      {/* Submit button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleFeedbackSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      {/* Exit button */}
      <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
        <Text style={styles.exitButtonText}>Exit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  feedbackButton: {
    backgroundColor: '#E4E4E4',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '100%',
    height: 100,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  submitButtonText: {
    color: 'white',
  },
  exitButton: {
    alignSelf: 'flex-end',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  exitButtonText: {
    color: '#007AFF',
  },
});

export default FeedbackPage;
