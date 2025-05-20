import React from 'react';
import { StyleSheet, ImageBackground, SafeAreaView } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';

export default function App() {
  return (
    <ImageBackground
      source={require('./assets/bg-vino.jpg')} 
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <LoginScreen />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
});
