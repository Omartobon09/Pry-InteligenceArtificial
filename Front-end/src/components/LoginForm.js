import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from '../style/styles';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email === 'admin@example.com' && password === '123456') {
      Alert.alert('Login exitoso');
    } else {
      Alert.alert('Error', 'Credenciales incorrectas');
    }

    // API
    /*
    fetch('https://tu-api.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Guardar token o navegar
      } else {
        Alert.alert('Credenciales inválidas');
      }
    })
    .catch(console.error);
    */
  };

  return (
    <View>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <Text style={styles.text_form}>Por favor digita tus credenciales</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
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
