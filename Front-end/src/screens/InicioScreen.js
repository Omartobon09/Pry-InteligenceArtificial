import React from 'react';
import { View, Text } from 'react-native';
import styles from '../style/styles';

const InicioScreen = ({ route }) => {
  const userName = route?.params?.userName || 'Invitado';

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>¡Bienvenido, {userName}!</Text>
      <Text style={styles.infoText}>
        Esta es la app de vinos. Aquí puedes chatear con IA, predecir resultados,
        registrar nuevos datos y consultar reportes.
      </Text>
    </View>
  );
};

export default InicioScreen;
