import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  ScrollView 
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sharedStyles, colors } from "../style/sharedStyles";

const caracteristicas = [
  {
    icon: "🍷",
    title: "Origen Natural",
    description: "Provienen de la fermentación del jugo de uvas seleccionadas"
  },
  {
    icon: "🍇",
    title: "Gran Variedad",
    description: "Tintos, blancos, rosados, espumosos y muchos tipos más"
  },
  {
    icon: "🍾",
    title: "Graduación Alcohólica",
    description: "Contenido alcohólico típicamente entre 8% y 15%"
  },
  {
    icon: "🕰️",
    title: "Envejecimiento",
    description: "Algunos vinos mejoran con el tiempo en barricas o botellas"
  },
];

const funciones = [
  {
    icon: "🤖",
    title: "Chatear con IA",
    description: "Conversa con nuestro asistente inteligente RASA",
    color: colors.primary
  },
  {
    icon: "🔮",
    title: "Predecir Calidad",
    description: "Analiza y predice la calidad de tus vinos",
    color: colors.success
  },
  {
    icon: "📝",
    title: "Registrar Datos",
    description: "Añade nuevos registros a tu base de datos",
    color: colors.info
  },
  {
    icon: "📊",
    title: "Consultar Reportes",
    description: "Visualiza estadísticas y análisis detallados",
    color: colors.warning
  },
];

const InicioScreen = () => {
  const [userName, setUserName] = useState('Usuario');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Intentar obtener los datos del usuario desde AsyncStorage
      const userData = await AsyncStorage.getItem('user_data');
      
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        // Si existe el username en los datos guardados, usarlo
        if (parsedUserData.username) {
          setUserName(parsedUserData.username);
        }
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      // En caso de error, mantener el valor por defecto 'Usuario'
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={sharedStyles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={sharedStyles.header}>
        <Text style={sharedStyles.title}>🍷 Wine Analytics</Text>
        <Text style={sharedStyles.subtitle}>Tu Compañero Experto en Vinos</Text>
      </View>

      <View style={sharedStyles.content}>
        {/* Welcome Section */}
        <View style={sharedStyles.cardLarge}>
          <Text style={sharedStyles.welcomeTitle}>
            {isLoading ? '¡Bienvenido! 👋' : `¡Bienvenido, ${userName}! 👋`}
          </Text>
          <Text style={sharedStyles.welcomeDescription}>
            Descubre el fascinante mundo del vino con nuestra aplicación de análisis avanzado
          </Text>
        </View>

        {/* Features Section */}
        <View style={sharedStyles.section}>
          <Text style={sharedStyles.sectionTitle}>🚀 ¿Qué puedes hacer?</Text>
          {funciones.map((funcion, index) => (
            <View key={index} style={[sharedStyles.featureCard, { borderLeftColor: funcion.color }]}>
              <View style={sharedStyles.featureHeader}>
                <Text style={sharedStyles.featureIcon}>{funcion.icon}</Text>
                <View style={sharedStyles.featureContent}>
                  <Text style={sharedStyles.featureTitle}>{funcion.title}</Text>
                  <Text style={sharedStyles.featureDescription}>{funcion.description}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Wine Info Section */}
        <View style={sharedStyles.section}>
          <Text style={sharedStyles.sectionTitle}>🍇 Sobre los Vinos</Text>
          <View style={sharedStyles.card}>
            <Text style={sharedStyles.infoText}>
              Los vinos son bebidas alcohólicas obtenidas por la fermentación del jugo de uvas, 
              creando una experiencia sensorial única que combina arte, ciencia y tradición.
            </Text>
          </View>
        </View>

        {/* Characteristics Section */}
        <View style={sharedStyles.section}>
          <Text style={sharedStyles.sectionTitle}>✨ Características del Vino</Text>
          {caracteristicas.map((caracteristica, index) => (
            <View key={index} style={sharedStyles.horizontalCard}>
              <Text style={sharedStyles.horizontalIcon}>{caracteristica.icon}</Text>
              <View style={sharedStyles.horizontalContent}>
                <Text style={sharedStyles.horizontalTitle}>{caracteristica.title}</Text>
                <Text style={sharedStyles.horizontalDescription}>{caracteristica.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={sharedStyles.footer}>
          <Text style={sharedStyles.footerText}>
            ¡Explora todas las funciones y sumérgete en el análisis profesional de vinos! 🥂
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default InicioScreen;