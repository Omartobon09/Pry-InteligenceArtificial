import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sharedStyles, colors } from '../style/sharedStyles';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Validación básica
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu email');
      return;
    }
    
    if (!password.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu contraseña');
      return;
    }

    setIsLoading(true);

    try {
      // Crear FormData para el login
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch('http://192.168.102.73:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
      });
      
      const data = await response.json();
      
      if (response.ok && data.access_token) {
        // Guardar token en AsyncStorage
        await AsyncStorage.setItem('access_token', data.access_token);
        await AsyncStorage.setItem('token_type', data.token_type);
        
        // Obtener datos del usuario descifrando el token con la ruta /usuario
        const userResponse = await fetch('http://192.168.102.73:8000/usuario', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${data.access_token}`,
            'Content-Type': 'application/json'
          }
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          
          // Guardar todos los datos del usuario que devuelve la API
          await AsyncStorage.setItem('user_data', JSON.stringify(userData));
          
          // Notificar al componente padre
          onLogin(userData.username);
          
          Alert.alert('Éxito', `¡Bienvenido ${userData.username}!`);
        } else {
          Alert.alert('Error', 'No se pudieron obtener los datos del usuario');
        }
      } else {
        Alert.alert('Error', data.detail || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error de login:', error);
      Alert.alert('Error', 'Hubo un problema al iniciar sesión. Verifica tu conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[sharedStyles.container, { flex: 1, width: '100%', height: '100%' }]}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, minHeight: '100%' }}
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1, width: '100%' }}
      >
        {/* Header */}
        <View style={sharedStyles.header}>
          <Text style={sharedStyles.title}>🍷 Sommelier App</Text>
          <Text style={sharedStyles.subtitle}>Tu asistente virtual de vinos</Text>
        </View>

        {/* Content */}
        <View style={sharedStyles.content}>
          {/* Welcome Card */}
          <View style={sharedStyles.cardLarge}>
            <Text style={sharedStyles.welcomeTitle}>¡Bienvenido!</Text>
            <Text style={sharedStyles.welcomeDescription}>
              Inicia sesión para acceder a tu sommelier virtual personalizado
            </Text>
          </View>

          {/* Email Input */}
          <View style={[sharedStyles.inputContainer, { marginBottom: 20 }]}>
            <View style={sharedStyles.inputHeader}>
              <Text style={[sharedStyles.inputIcon, { color: colors.primary }]}>📧</Text>
              <View style={sharedStyles.inputLabelContainer}>
                <Text style={sharedStyles.inputLabel}>Email</Text>
                <Text style={sharedStyles.inputDescription}>Ingresa tu correo electrónico</Text>
              </View>
            </View>
            <TextInput
              style={sharedStyles.input}
              placeholder="ejemplo@correo.com"
              placeholderTextColor={colors.placeholder}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          {/* Password Input */}
          <View style={[sharedStyles.inputContainer, { marginBottom: 30 }]}>
            <View style={sharedStyles.inputHeader}>
              <Text style={[sharedStyles.inputIcon, { color: colors.primary }]}>🔐</Text>
              <View style={sharedStyles.inputLabelContainer}>
                <Text style={sharedStyles.inputLabel}>Contraseña</Text>
                <Text style={sharedStyles.inputDescription}>Ingresa tu contraseña</Text>
              </View>
            </View>
            <TextInput
              style={sharedStyles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.placeholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              sharedStyles.button,
              sharedStyles.buttonPrimary,
              isLoading && sharedStyles.buttonDisabled
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={sharedStyles.buttonText}>
              {isLoading ? '🔄 Iniciando sesión...' : '🚀 Iniciar Sesión'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={sharedStyles.footer}>
          <Text style={sharedStyles.footerText}>
            🍷 Disfruta de la experiencia completa del mundo del vino con tecnología de IA
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginForm;