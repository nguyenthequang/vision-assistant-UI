import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import IntroPage from './IntroPage';
import MainPage from './MainPage';
import FeedbackPage from './FeedbackPage';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Intro">
        <Stack.Screen name="Intro" component={IntroPage} />
        <Stack.Screen name="Main" component={MainPage} />
        <Stack.Screen name="Feedback" component={FeedbackPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
