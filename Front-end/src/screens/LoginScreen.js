import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import LoginForm from '../components/LoginForm';
import styles from '../style/styles';


const LoginScreen = ({ onLogin }) => {
  return (
    <View style={styles.container_bg}>
      <LoginForm onLogin={onLogin} />
    </View>
  );
};

export default LoginScreen;