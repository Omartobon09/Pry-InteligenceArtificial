import React from 'react';
import { View, Text } from 'react-native';
import styles from '../style/styles';

const InicioScreen = ({ userName }) => {
  return (
    <View style={styles.containers}>
      <Text style={styles.welcome}>¡Bienvenido, {userName}!</Text>
      <Text style={styles.infoText}>
        Esta es la app de vinos. Aquí puedes chatear con IA de RASA, predecir resultados, registrar nuevos datos y consultar reportes.
      </Text>
    </View>
  );
};

export default InicioScreen;
