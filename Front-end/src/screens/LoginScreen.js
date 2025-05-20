import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import LoginForm from '../components/LoginForm';
import styles from '../style/styles';


const LoginScreen = () => {
  return (
    <View style={styles.container_bg}>
      <LoginForm />
    </View>
  );
};

export default LoginScreen;