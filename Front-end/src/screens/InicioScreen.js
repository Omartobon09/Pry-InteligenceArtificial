import React from "react";
import { View, Text, FlatList, ScrollView } from "react-native";
import styles from "../style/styles";

const caracteristicas = [
  "🍷 Origen natural: provienen de la fermentación del jugo de uvas.",
  "🍇 Variedad: existen tintos, blancos, rosados, espumosos, entre otros.",
  "🍾 Graduación alcohólica: suele estar entre 8% y 15%.",
  "🕰️ Envejecimiento: algunos mejoran con el tiempo en barricas o botellas.",
];

const InicioScreen = ({ userName }) => {
  return (
    <ScrollView style={styles.containers}>
      <Text style={styles.welcome}>¡Bienvenido, {userName} 👋!</Text>
      <Text style={styles.infoText}>
        Esta es la app de vinos, donde puedes:
      </Text>
      <View style={[{paddingBottom: 10}]}>
        <Text style={styles.descriptionText}>Chatear con la IA de RASA</Text>
        <Text style={styles.descriptionText}>Predecir resultados</Text>
        <Text style={styles.descriptionText}>Registrar nuevos datos</Text>
        <Text style={styles.descriptionText}>Consultar reportes</Text>
      </View>
      <Text style={styles.infoText}>
        Los vinos son bebidas alcohólicas obtenidas por la fermentación del jugo
        de uvas. 🍇🍷🍾
      </Text>
      {caracteristicas.map((item, index) => (
        <Text key={index} style={styles.infoTextItem}>
          {item}
        </Text>
      ))}
    </ScrollView>
  );
};

export default InicioScreen;
