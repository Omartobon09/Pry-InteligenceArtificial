import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import styles from '../style/styles';

const NewRecordScreen = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!name || !type || !date) {
      Alert.alert('⚠️ Campos obligatorios', 'Por favor completa todos los campos requeridos.');
      return;
    }

    Alert.alert('✅ Registro guardado', 'El vino ha sido registrado correctamente.');

    setName('');
    setType('');
    setDate('');
    setNotes('');
  };

  return (
    <ScrollView contentContainerStyle={styles.containers_p}>
      <Text style={[styles.welcome, { marginBottom: 20 }]}>📝 Nuevo Registro de Vino</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del vino"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo de vino (tinto, blanco, rosado...)"
        value={type}
        onChangeText={setType}
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha de consumo (DD/MM/AAAA)"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Notas o comentarios"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <TouchableOpacity style={styles.chatSendButton} onPress={handleSave}>
        <Text style={styles.chatSendText}>Guardar registro</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default NewRecordScreen;
