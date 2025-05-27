import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { sharedStyles, colors } from '../style/sharedStyles';

const AddRecordScreen = ({ userName = "Usuario" }) => {
  const [formData, setFormData] = useState({
    fixed_acidity: '',
    volatile_acidity: '',
    citric_acid: '',
    residual_sugar: '',
    chlorides: '',
    free_sulfur_dioxide: '',
    total_sulfur_dioxide: '',
    density: '',
    pH: '',
    sulphates: '',
    alcohol: '',
    quality: ''
  });

  const [loading, setLoading] = useState(false);

  // Configuración de campos para agregar nuevo vino
  const fieldsConfig = [
    {
      key: 'fixed_acidity',
      label: 'Acidez Fija',
      placeholder: '8.31',
      icon: '🍋',
      description: 'Gramos de ácido tartárico por litro'
    },
    {
      key: 'volatile_acidity',
      label: 'Acidez Volátil',
      placeholder: '0.65',
      icon: '🧪',
      description: 'Gramos de ácido acético por litro'
    },
    {
      key: 'citric_acid',
      label: 'Ácido Cítrico',
      placeholder: '0.27',
      icon: '🟡',
      description: 'Gramos por litro'
    },
    {
      key: 'residual_sugar',
      label: 'Azúcar Residual',
      placeholder: '2.3',
      icon: '🍯',
      description: 'Gramos por litro'
    },
    {
      key: 'chlorides',
      label: 'Cloruros',
      placeholder: '0.087',
      icon: '🧂',
      description: 'Gramos de cloruro de sodio por litro'
    },
    {
      key: 'free_sulfur_dioxide',
      label: 'SO₂ Libre',
      placeholder: '15.87',
      icon: '💨',
      description: 'Miligramos por litro'
    },
    {
      key: 'total_sulfur_dioxide',
      label: 'SO₂ Total',
      placeholder: '46.47',
      icon: '🌫️',
      description: 'Miligramos por litro'
    },
    {
      key: 'density',
      label: 'Densidad',
      placeholder: '0.995',
      icon: '⚖️',
      description: 'Densidad del vino'
    },
    {
      key: 'pH',
      label: 'Nivel de pH',
      placeholder: '3.31',
      icon: '🔬',
      description: 'Escala de 0-14'
    },
    {
      key: 'sulphates',
      label: 'Sulfatos',
      placeholder: '0.56',
      icon: '🧪',
      description: 'Gramos por litro'
    },
    {
      key: 'alcohol',
      label: 'Contenido de Alcohol',
      placeholder: '10.5',
      icon: '🍷',
      description: 'Porcentaje de alcohol por volumen'
    },
    {
      key: 'quality',
      label: 'Calidad del Vino',
      placeholder: '7',
      icon: '⭐',
      description: 'Puntuación de 0 a 10'
    }
  ];

  const updateField = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = Object.keys(formData);
    for (let field of requiredFields) {
      if (!formData[field] || isNaN(formData[field])) {
        const fieldConfig = fieldsConfig.find(f => f.key === field);
        Alert.alert(
          'Campo Requerido',
          `Por favor ingresa un valor numérico válido para ${fieldConfig?.label}`
        );
        return false;
      }
    }

    // Validaciones específicas
    const quality = parseFloat(formData.quality);
    if (quality < 0 || quality > 10) {
      Alert.alert('Error de Validación', 'La calidad debe estar entre 0 y 10');
      return false;
    }

    const alcohol = parseFloat(formData.alcohol);
    if (alcohol < 0 || alcohol > 20) {
      Alert.alert('Error de Validación', 'El contenido de alcohol debe estar entre 0% y 20%');
      return false;
    }

    const pH = parseFloat(formData.pH);
    if (pH < 0 || pH > 14) {
      Alert.alert('Error de Validación', 'El pH debe estar entre 0 y 14');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Preparar datos para enviar a la API
      const wineData = {};
      Object.keys(formData).forEach(key => {
        wineData[key] = parseFloat(formData[key]);
      });

      // Aquí debes cambiar la URL por la de tu API para agregar registros
      const response = await fetch('http://192.168.151.73:8000/add_wine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wineData),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert(
          '¡Éxito!',
          'El registro de vino se ha agregado correctamente a la base de datos.',
          [
            {
              text: 'Agregar Otro',
              onPress: resetForm
            },
            {
              text: 'OK',
              style: 'default'
            }
          ]
        );
      } else {
        throw new Error(result.message || 'Error al agregar el registro');
      }
    } catch (error) {
      console.error('Error al agregar registro:', error);
      Alert.alert(
        'Error',
        'No se pudo agregar el registro. Verifica tu conexión e intenta nuevamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fixed_acidity: '',
      volatile_acidity: '',
      citric_acid: '',
      residual_sugar: '',
      chlorides: '',
      free_sulfur_dioxide: '',
      total_sulfur_dioxide: '',
      density: '',
      pH: '',
      sulphates: '',
      alcohol: '',
      quality: ''
    });
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

  return (
    <ScrollView style={sharedStyles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={sharedStyles.header}>
        <Text style={sharedStyles.title}>📝 Agregar Vino</Text>
        <Text style={sharedStyles.subtitle}>Registra un nuevo vino en la base de datos</Text>
      </View>

      <View style={sharedStyles.content}>
        {/* Información */}
        <View style={sharedStyles.card}>
          <Text style={sharedStyles.welcomeTitle}>🍷 Nuevo Registro</Text>
          <Text style={sharedStyles.welcomeDescription}>
            Completa todos los campos para agregar un nuevo vino a la base de datos.
            Todos los valores deben ser numéricos.
          </Text>
        </View>

        {/* Sección de Características Químicas */}
        <View style={sharedStyles.section}>
          <Text style={sharedStyles.sectionTitle}>⚗️ Características Químicas</Text>
          {fieldsConfig.slice(0, 7).map(renderInputField)}
        </View>

        {/* Sección de Propiedades Físicas */}
        <View style={sharedStyles.section}>
          <Text style={sharedStyles.sectionTitle}>🔬 Propiedades Físicas</Text>
          {fieldsConfig.slice(7, 11).map(renderInputField)}
        </View>

        {/* Sección de Evaluación */}
        <View style={sharedStyles.section}>
          <Text style={sharedStyles.sectionTitle}>⭐ Evaluación Final</Text>
          {fieldsConfig.slice(11).map(renderInputField)}
        </View>

        {/* Botones de Acción */}
        <View style={sharedStyles.buttonContainer}>
          <TouchableOpacity 
            style={[
              sharedStyles.button, 
              sharedStyles.buttonPrimary,
              loading && sharedStyles.buttonDisabled
            ]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ActivityIndicator size="small" color={colors.white} />
                <Text style={[sharedStyles.buttonText, { marginLeft: 10 }]}>
                  Guardando...
                </Text>
              </View>
            ) : (
              <Text style={sharedStyles.buttonText}>
                💾 Guardar Registro
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[sharedStyles.button, sharedStyles.buttonSecondary]} 
            onPress={resetForm}
            disabled={loading}
          >
            <Text style={sharedStyles.buttonTextSecondary}>
              🔄 Limpiar Formulario
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer informativo */}
        <View style={sharedStyles.footer}>
          <Text style={sharedStyles.footerText}>
            💡 Tip: Asegúrate de que todos los valores estén dentro de rangos realistas 
            para obtener mejores resultados en las predicciones.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default AddRecordScreen;