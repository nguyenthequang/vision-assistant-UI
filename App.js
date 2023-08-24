import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import TakePhotoPage from "./TakePhotoPage";
import MainPage from "./MainPage";
import FeedbackPage from "./FeedbackPage";
import Ionicons from "@expo/vector-icons/Ionicons";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          name="Main"
          component={MainPage}
          options={({ navigation, route }) => ({
            // headerTitle: (props) => <LogoTitle {...props} />,
            // Add a placeholder button without the `onPress` to avoid flicker
            headerLeft: () => (
              <Ionicons name="camera-outline" size={30} color="#007AFF" />
            ),
          })}
        />
        <Stack.Screen name="TakePhoto" component={TakePhotoPage} />
        <Stack.Screen name="Feedback" component={FeedbackPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
