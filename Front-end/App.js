import React, { useState, useEffect } from 'react';
import { StyleSheet, ImageBackground, SafeAreaView } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import BackgroundImage from './assets/bg-vino.jpg';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingLogin, setCheckingLogin] = useState(true); // Para evitar parpadeo

  useEffect(() => {
    const checkLoginStatus = async () => {
      const stored = await AsyncStorage.getItem('loggedIn');
      if (stored === 'true') setIsLoggedIn(true);
      setCheckingLogin(false);
    };

    checkLoginStatus();
  }, []);

  if (checkingLogin) return null;

  return (
    <ImageBackground source={BackgroundImage} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!isLoggedIn ? (
              <Stack.Screen name="Login">
                {(props) => (
                  <LoginScreen
                    {...props}
                    onLogin={async (name) => {
                      await AsyncStorage.setItem('loggedIn', 'true');
                      props.navigation.navigate('Home', { userName: name });
                      setIsLoggedIn(true);
                    }}
                  />
                )}
              </Stack.Screen>
            ) : (
              <Stack.Screen name="Home" component={HomeScreen} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
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
