import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogoutScreen = ({ navigation, setIsLoggedIn }) => {
  useEffect(() => {
    const logout = async () => {
      await AsyncStorage.removeItem('loggedIn');
      await AsyncStorage.removeItem('userName');
      setIsLoggedIn(false);
    };
    logout();
  }, []);

  return null;
};

export default LogoutScreen;


