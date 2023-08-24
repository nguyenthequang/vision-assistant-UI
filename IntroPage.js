import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

const IntroPage = () => {
  return (
    <View style={styles.container}>
      <Image source={require('./IntroImage.png')} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default IntroPage;
