import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { sharedStyles, colors } from '../style/sharedStyles';

const PredictionScreen = () => {
  // Estados para todos los campos
  const [formData, setFormData] = useState({
    alcohol: '',
    residualSugar: '',
    density: '',
    volatileAcidity: '',
    sulphates: '',
    fixedAcidity: '',
    citricAcid: '',
    chlorides: '',
    freeSulfurDioxide: '',
    totalSulfurDioxide: '',
    pH: '',
  });

  const [predictionResults, setPredictionResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Configuración de campos
  const fieldsConfig = [
    {
      key: 'alcohol',
      label: 'Contenido de Alcohol',
      placeholder: '10.5',
      icon: '🍷',
      description: 'Porcentaje de alcohol por volumen'
    },
    {
      key: 'residualSugar',
      label: 'Azúcar Residual',
      placeholder: '2.3',
      icon: '🍯',
      description: 'Gramos por litro'
    },
    {
      key: 'density',
      label: 'Densidad',
      placeholder: '0.995',
      icon: '⚖️',
      description: 'Densidad del vino'
    },
    {
      key: 'volatileAcidity',
      label: 'Acidez Volátil',
      placeholder: '0.65',
      icon: '🧪',
      description: 'Gramos de ácido acético por litro'
    },
    {
      key: 'sulphates',
      label: 'Sulfatos',
      placeholder: '0.56',
      icon: '🧂',
      description: 'Gramos por litro'
    },
    {
      key: 'fixedAcidity',
      label: 'Acidez Fija',
      placeholder: '8.31',
      icon: '🍋',
      description: 'Gramos de ácido tartárico por litro'
    },
    {
      key: 'citricAcid',
      label: 'Ácido Cítrico',
      placeholder: '0.27',
      icon: '🟡',
      description: 'Gramos por litro'
    },
    {
      key: 'chlorides',
      label: 'Cloruros',
      placeholder: '0.087',
      icon: '🧪',
      description: 'Gramos de cloruro de sodio por litro'
    },
    {
      key: 'freeSulfurDioxide',
      label: 'SO₂ Libre',
      placeholder: '15.87',
      icon: '💨',
      description: 'Miligramos por litro'
    },
    {
      key: 'totalSulfurDioxide',
      label: 'SO₂ Total',
      placeholder: '46.47',
      icon: '🌫️',
      description: 'Miligramos por litro'
    },
    {
      key: 'pH',
      label: 'Nivel de pH',
      placeholder: '3.31',
      icon: '🔬',
      description: 'Escala de 0-14'
    },
  ];

  const updateField = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getStars = (score) => {
    const max = Math.min(Math.max(score, 0), 10);
    return '★'.repeat(max) + '☆'.repeat(10 - max);
  };

  const getColorByQuality = (score) => {
    if (score <= 4) return colors.danger;
    if (score <= 6) return colors.warning;
    return colors.success;
  };

  const getQualityDescription = (score) => {
    if (score <= 4) return 'Calidad Baja';
    if (score <= 6) return 'Calidad Media';
    return 'Calidad Alta';
  };

  const validateForm = () => {
    const requiredFields = Object.keys(formData);
    for (let field of requiredFields) {
      if (!formData[field] || isNaN(formData[field])) {
        Alert.alert(
          'Campo Requerido',
          `Por favor ingresa un valor válido para ${fieldsConfig.find(f => f.key === field)?.label}`
        );
        return false;
      }
    }
    return true;
  };

  const handlePredict = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('http://192.168.102.73:8000/predict_all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fixed_acidity: parseFloat(formData.fixedAcidity),
          volatile_acidity: parseFloat(formData.volatileAcidity),
          citric_acid: parseFloat(formData.citricAcid),
          residual_sugar: parseFloat(formData.residualSugar),
          chlorides: parseFloat(formData.chlorides),
          free_sulfur_dioxide: parseFloat(formData.freeSulfurDioxide),
          total_sulfur_dioxide: parseFloat(formData.totalSulfurDioxide),
          density: parseFloat(formData.density),
          pH: parseFloat(formData.pH),
          sulphates: parseFloat(formData.sulphates),
          alcohol: parseFloat(formData.alcohol),
        }),
      });

      const data = await response.json();
      setPredictionResults(data);
    } catch (error) {
      console.error('Error al predecir:', error);
      setPredictionResults({ 
        mensaje: 'Error al conectar con la API',
        predicciones: null
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      alcohol: '',
      residualSugar: '',
      density: '',
      volatileAcidity: '',
      sulphates: '',
      fixedAcidity: '',
      citricAcid: '',
      chlorides: '',
      freeSulfurDioxide: '',
      totalSulfurDioxide: '',
      pH: '',
    });
    setPredictionResults(null);
  };

  const renderInputField = (field) => (
    <View key={field.key} style={sharedStyles.inputContainer}>
      <View style={sharedStyles.inputHeader}>
        <Text style={sharedStyles.inputIcon}>{field.icon}</Text>
        <View style={sharedStyles.inputLabelContainer}>
          <Text style={sharedStyles.inputLabel}>{field.label}</Text>
          <Text style={sharedStyles.inputDescription}>{field.description}</Text>
        </View>
      </View>
      <TextInput
        style={sharedStyles.input}
        placeholder={field.placeholder}
        placeholderTextColor={colors.placeholder}
        keyboardType="numeric"
        value={formData[field.key]}
        onChangeText={(value) => updateField(field.key, value)}
      />
    </View>
  );

  const renderPredictionCard = (modelName, score, color, icon) => (
    <View style={[sharedStyles.featureCard, { borderLeftColor: color }]} key={modelName}>
      <View style={sharedStyles.featureHeader}>
        <Text style={sharedStyles.featureIcon}>{icon}</Text>
        <Text style={sharedStyles.featureTitle}>{modelName}</Text>
      </View>
      <Text style={[sharedStyles.predictionScore, { color }]}>
        Calidad: {score} - {getQualityDescription(score)}
      </Text>
      <Text style={sharedStyles.predictionStars}>
        {getStars(score)}
      </Text>
    </View>
  );

  return (
    <ScrollView style={sharedStyles.container} showsVerticalScrollIndicator={false}>
      <View style={sharedStyles.header}>
        <Text style={sharedStyles.title}>🍷 Predictor de Calidad</Text>
        <Text style={sharedStyles.subtitle}>Análisis Avanzado de Vino</Text>
      </View>

      <View style={sharedStyles.content}>
        <Text style={sharedStyles.sectionTitle}>📊 Parámetros del Vino</Text>
        
        {fieldsConfig.map(renderInputField)}

        <View style={sharedStyles.buttonContainer}>
          <TouchableOpacity 
            style={[sharedStyles.button, sharedStyles.buttonPrimary, loading && sharedStyles.buttonDisabled]} 
            onPress={handlePredict}
            disabled={loading}
          >
            <Text style={sharedStyles.buttonText}>
              {loading ? '🔄 Analizando...' : '🤖 Predecir Calidad'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[sharedStyles.button, sharedStyles.buttonSecondary]} 
            onPress={resetForm}
          >
            <Text style={sharedStyles.buttonTextSecondary}>
              🔄 Limpiar Formulario
            </Text>
          </TouchableOpacity>
        </View>

        {predictionResults && (
          <View style={sharedStyles.resultsContainer}>
            {predictionResults.predicciones ? (
              <View>
                <Text style={sharedStyles.resultsTitle}>🎯 Resultados de Predicción</Text>
                
                {renderPredictionCard(
                  'Random Forest', 
                  predictionResults.predicciones["Random Forest"], 
                  colors.success, 
                  '🌲'
                )}
                
                {renderPredictionCard(
                  'Logistic Regression', 
                  predictionResults.predicciones["Logistic Regression"], 
                  colors.info, 
                  '📈'
                )}
                
                {renderPredictionCard(
                  'Support Vector Machine', 
                  predictionResults.predicciones["Support Vector Machine"], 
                  colors.warning, 
                  '⚡'
                )}

                <View style={sharedStyles.averageCard}>
                  <Text style={sharedStyles.averageTitle}>📊 Predicción Promedio</Text>
                  {(() => {
                    const promedio = Math.round(
                      (predictionResults.predicciones["Random Forest"] + 
                       predictionResults.predicciones["Logistic Regression"] + 
                       predictionResults.predicciones["Support Vector Machine"]) / 3
                    );
                    return (
                      <>
                        <Text style={[sharedStyles.averageScore, { color: getColorByQuality(promedio) }]}>
                          Calidad: {promedio} - {getQualityDescription(promedio)}
                        </Text>
                        <Text style={sharedStyles.averageStars}>
                          {getStars(promedio)}
                        </Text>
                      </>
                    );
                  })()}
                </View>
              </View>
            ) : (
              <View style={sharedStyles.errorContainer}>
                <Text style={sharedStyles.errorIcon}>❌</Text>
                <Text style={sharedStyles.errorTitle}>Error de Conexión</Text>
                <Text style={sharedStyles.errorMessage}>{predictionResults.mensaje}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default PredictionScreen;