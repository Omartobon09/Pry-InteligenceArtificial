import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import styles from '../style/styles';

import ChatScreen from './ChatScreen';
import PrediccionScreen from './PrediccionScreen';
import RegistroScreen from './RegistroScreen';
import ReportesScreen from './ReporteScreen';

const Tab = createBottomTabNavigator();

const HomeTabs = ({ userName }) => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Predicción" component={PrediccionScreen} />
      <Tab.Screen name="Nuevo Registro" component={RegistroScreen} />
      <Tab.Screen name="Reportes" component={ReportesScreen} />
    </Tab.Navigator>
  );
};

const HomeScreen = ({ route }) => {
  const { userName } = route.params;

  return (
    <View style={styles.container_bg}>
      <Text style={styles.welcome}>¡Bienvenido, {userName}!</Text>
      <Text style={styles.infoText}>
        Esta es la app de vinos. Aquí puedes chatear con IA, predecir resultados,
        registrar nuevos datos y consultar reportes.
      </Text>

      {/* Navegación por tabs */}
      <NavigationContainer independent={true}>
        <HomeTabs userName={userName} />
      </NavigationContainer>
    </View>
  );
};

export default HomeScreen;
