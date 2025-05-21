import React, { useState, useEffect } from "react";
import { StyleSheet, ImageBackground, SafeAreaView, View } from "react-native";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import BackgroundImage from "./assets/bg-vino.jpg";
import LogoutScreen from "./src/screens/LogoutScreen";

const Stack = createNativeStackNavigator();

if (Platform.OS === "web") {
  require("./src/style/index.css");
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingLogin, setCheckingLogin] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const checkLoginStatus = async () => {
      const stored = await AsyncStorage.getItem("loggedIn");
      const storedUserName = await AsyncStorage.getItem("userName");
      if (stored === "true") {
        setIsLoggedIn(true);
        setUserName(storedUserName || "");
      }
      setCheckingLogin(false);
    };
    checkLoginStatus();
  }, []);

  if (checkingLogin) return null;

  return (
    <View style={{ flex: 1, backgroundColor: "transparent" }}>
      <ImageBackground
        source={BackgroundImage}
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.container}>
          <NavigationContainer>
            {isLoggedIn ? (
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home">
                  {(props) => (
                    <HomeScreen
                      {...props}
                      userName={userName}
                      setIsLoggedIn={setIsLoggedIn}
                    />
                  )}
                </Stack.Screen>
              </Stack.Navigator>
            ) : (
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login">
                  {(props) => (
                    <LoginScreen
                      {...props}
                      onLogin={async (name) => {
                        await AsyncStorage.setItem("loggedIn", "true");
                        await AsyncStorage.setItem("userName", name);
                        setUserName(name);
                        setIsLoggedIn(true);
                      }}
                    />
                  )}
                </Stack.Screen>
              </Stack.Navigator>
            )}
          </NavigationContainer>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
});
