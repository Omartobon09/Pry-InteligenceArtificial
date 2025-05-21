import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogoutScreen = ({ navigation }) => {
  useEffect(() => {
    const logout = async () => {
      await AsyncStorage.removeItem('loggedIn');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    };
    logout();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Cerrando sesión...</Text>
      <ActivityIndicator size="large" color="#800000" />
    </View>
  );
};

export default LogoutScreen;
