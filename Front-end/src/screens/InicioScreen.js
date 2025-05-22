import React from 'react';
import { View, Text, FlatList } from 'react-native';
import styles from '../style/styles';

const caracteristicas = [
  '🍷 Origen natural: provienen de la fermentación del jugo de uvas.',
  '🍇 Variedad: existen tintos, blancos, rosados, espumosos, entre otros.',
  '🍾 Graduación alcohólica: suele estar entre 8% y 15%.',
  '🕰️ Envejecimiento: algunos mejoran con el tiempo en barricas o botellas.'
];

const InicioScreen = ({ userName }) => {
  return (
    <View style={styles.containers}>
      <Text style={styles.welcome}>¡Bienvenido, {userName}!</Text>
      <Text style={styles.infoText}>
        Esta es la app de vinos. Aquí puedes chatear con IA de RASA, predecir resultados, registrar nuevos datos y consultar reportes.
      </Text>
      <Text style={styles.infoText}>Los vinos son bebidas alcohólicas obtenidas por la fermentación del jugo de uvas. 🍇🍷🍾</Text>
      {caracteristicas.map((item, index) => (
        <Text key={index} style={styles.infoText}>{item}</Text>
      ))}
    </View>
  );
};

export default InicioScreen;
