import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import InicioScreen from "../screens/InicioScreen";
import ChatScreen from "../screens/ChatScreen";
import PrediccionScreen from "../screens/PrediccionScreen";
import RegistroScreen from "../screens/RegistroScreen";
import ReporteScreen from "../screens/ReporteScreen";
import LogoutScreen from "../screens/LogoutScreen";

const Tab = createBottomTabNavigator();

const HomeTabs = ({ userName, setIsLoggedIn }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "Inicio":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Chat":
              iconName = focused ? "chatbubble" : "chatbubble-outline";
              break;
            case "Predicción":
              iconName = focused ? "trending-up" : "trending-up-outline";
              break;
            case "Nuevo Registro":
              iconName = focused ? "create" : "create-outline";
              break;
            case "Reportes":
              iconName = focused ? "document-text" : "document-text-outline";
              break;
            case "Salir":
              iconName = focused ? "log-out" : "log-out-outline";
              break;
            default:
              iconName = "alert-circle-outline";
          }

          return <Ionicons name={iconName} size={18} color={color} />;
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 5,
          backgroundColor: "rgba(0, 0, 0, 0.83)",
          borderTopWidth: 1,
          borderTopColor: "#ddd",
        },
        tabBarLabelStyle: {
          fontSize: 11,
        },
      })}
    >
      <Tab.Screen name="Inicio">
        {(props) => <InicioScreen {...props} userName={userName} />}
      </Tab.Screen>
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Predicción" component={PrediccionScreen} />
      <Tab.Screen name="Nuevo Registro" component={RegistroScreen} />
      <Tab.Screen name="Reportes" component={ReporteScreen} />
      <Tab.Screen name="Salir">
        {(props) => <LogoutScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default HomeTabs;
