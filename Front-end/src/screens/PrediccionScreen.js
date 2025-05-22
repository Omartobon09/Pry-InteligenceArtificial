import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import styles from '../style/styles';

const PredictionScreen = () => {
  const [occasion, setOccasion] = useState('');
  const [food, setFood] = useState('');
  const [predictions, setPredictions] = useState([]);

  const handlePredict = () => {
    const simulatedPredictions = [
      {
        name: 'Cabernet Sauvignon',
        description: 'Ideal para carnes rojas. Cuerpo completo y taninos fuertes.',
        image: require('../../assets/cabernet.webp'),
      },
      {
        name: 'Pinot Noir',
        description: 'Más suave, perfecto para platos con setas o cerdo.',
        image: require('../../assets/pinot.webp'),
      },
      {
        name: 'Chardonnay',
        description: 'Blanco seco, excelente para mariscos y quesos suaves.',
        image: require('../../assets/chardonnay.jpeg'),
      },
    ];

    setPredictions(simulatedPredictions);
  };

  return (
    <ScrollView contentContainerStyle={styles.containers_p}>
      <Text style={[styles.welcome, {marginBottom: 20}]}>🔮 Predicciones del Algoritmo</Text>

      <TextInput
        style={styles.input}
        placeholder="¿Para qué ocasión?"
        value={occasion}
        onChangeText={setOccasion}
      />
      <TextInput
        style={styles.input}
        placeholder="¿Qué comida acompañará?"
        value={food}
        onChangeText={setFood}
      />

      <TouchableOpacity style={styles.button} onPress={handlePredict}>
        <Text style={styles.buttonText}>Obtener predicciones</Text>
      </TouchableOpacity>

      {predictions.length > 0 && (
        <View style={{ marginTop: 30 }}>
          {predictions.map((wine, index) => (
            <View key={index} style={styles.predictionCard}>
              <Image source={wine.image} style={styles.predictionImage} />
              <Text style={styles.predictionType}>⚫{wine.name}</Text>
              <Text style={styles.predictionDescription}>⚫{wine.description}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default PredictionScreen;