import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import InicioScreen from '../screens/InicioScreen';
import ChatScreen from '../screens/ChatScreen';
import PrediccionScreen from '../screens/PrediccionScreen';
import RegistroScreen from '../screens/RegistroScreen';
import ReporteScreen from '../screens/ReporteScreen';

const Tab = createBottomTabNavigator();

const HomeTabs = ({ route }) => {
  const userName = route?.params?.userName || 'Invitado';

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Inicio">
        {(props) => <InicioScreen {...props} route={{ ...route, params: { userName } }} />}
      </Tab.Screen>
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Predicción" component={PrediccionScreen} />
      <Tab.Screen name="Nuevo Registro" component={RegistroScreen} />
      <Tab.Screen name="Reportes" component={ReporteScreen} />
    </Tab.Navigator>
  );
};

export default HomeTabs;
