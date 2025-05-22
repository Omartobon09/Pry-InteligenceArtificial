import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from '../style/styles';

const LoginForm = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Login local (temporal)
    if (name === 'Nicolas' && password === '123456' || name === 'Junior' && password === '123456') {
      onLogin(name); // Notifica al padre que el login fue exitoso
    } else {
      Alert.alert('Error', 'Credenciales incorrectas');
    }

    /*
    // Consumo de API para login (descomentar en el futuro)
    fetch('https://tu-api.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          onLogin(data.name); // Enviar nombre desde la API
        } else {
          Alert.alert('Credenciales inválidas');
        }
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Error', 'Hubo un problema al iniciar sesión');
      });
    */
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <Text style={styles.text_form}>Por favor digita tus credenciales</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
        keyboardType="name-phone-pad"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;
