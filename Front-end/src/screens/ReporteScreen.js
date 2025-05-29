import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { sharedStyles, colors } from '../style/sharedStyles';

const { width } = Dimensions.get('window');

const ReportsScreen = ({ userName = "Usuario" }) => {
  const [activeTab, setActiveTab] = useState('quality');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Estados para diferentes tipos de reportes
  const [qualityStats, setQualityStats] = useState(null);
  const [alcoholStats, setAlcoholStats] = useState(null);
  const [generalStats, setGeneralStats] = useState(null);

  const tabs = [
    { key: 'quality', label: 'Por Calidad', icon: '⭐' },
    { key: 'alcohol', label: 'Por Alcohol', icon: '🍷' },
    { key: 'general', label: 'Estadísticas', icon: '📊' }
  ];

  useEffect(() => {
    loadReportData();
  }, [activeTab]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      // Aquí debes cambiar por la URL de tu API de reportes
      const response = await fetch(`http://192.168.102.73:8000/reports/${activeTab}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      switch (activeTab) {
        case 'quality':
          setQualityStats(data);
          break;
        case 'alcohol':
          setAlcoholStats(data);
          break;
        case 'general':
          setGeneralStats(data);
          break;
      }

      setReportData(data);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
      // Datos de ejemplo para mostrar la estructura
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    const mockData = {
      quality: {
        distribution: [
          { range: '3-4', count: 15, percentage: 12 },
          { range: '5-6', count: 89, percentage: 65 },
          { range: '7-8', count: 28, percentage: 20 },
          { range: '9-10', count: 4, percentage: 3 }
        ],
        average: 5.8,
        total: 136
      },
      alcohol: {
        ranges: [
          { range: '8-10%', count: 42, percentage: 31 },
          { range: '10-12%', count: 67, percentage: 49 },
          { range: '12-14%', count: 23, percentage: 17 },
          { range: '14%+', count: 4, percentage: 3 }
        ],
        average: 10.8,
        total: 136
      },
      general: {
        totalWines: 136,
        averageQuality: 5.8,
        averageAlcohol: 10.8,
        averagePH: 3.2,
        topQualityCount: 32,
        lastUpdated: new Date().toLocaleDateString()
      }
    };

    switch (activeTab) {
      case 'quality':
        setQualityStats(mockData.quality);
        setReportData(mockData.quality);
        break;
      case 'alcohol':
        setAlcoholStats(mockData.alcohol);
        setReportData(mockData.alcohol);
        break;
      case 'general':
        setGeneralStats(mockData.general);
        setReportData(mockData.general);
        break;
    }
  };

  const renderTabButton = (tab) => (
    <TouchableOpacity
      key={tab.key}
      style={[
        {
          flex: 1,
          padding: 12,
          borderRadius: 10,
          marginHorizontal: 4,
          backgroundColor: activeTab === tab.key ? colors.primary : colors.white,
          borderWidth: 1,
          borderColor: activeTab === tab.key ? colors.primary : colors.border,
        }
      ]}
      onPress={() => setActiveTab(tab.key)}
    >
      <Text style={{
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '600',
        color: activeTab === tab.key ? colors.white : colors.gray
      }}>
        {tab.icon} {tab.label}
      </Text>
    </TouchableOpacity>
  );

  const renderQualityReport = () => (
    <>
      <View style={sharedStyles.card}>
        <Text style={sharedStyles.welcomeTitle}>⭐ Distribución por Calidad</Text>
        <Text style={sharedStyles.welcomeDescription}>
          Análisis de {reportData?.total || 0} vinos registrados
        </Text>
      </View>

      {reportData?.distribution?.map((item, index) => (
        <View key={index} style={[
          sharedStyles.featureCard,
          { borderLeftColor: getQualityColor(item.range) }
        ]}>
          <View style={sharedStyles.featureHeader}>
            <Text style={sharedStyles.featureIcon}>📊</Text>
            <View style={sharedStyles.featureContent}>
              <Text style={sharedStyles.featureTitle}>
                Calidad {item.range}
              </Text>
              <Text style={sharedStyles.featureDescription}>
                {item.count} vinos ({item.percentage}% del total)
              </Text>
            </View>
            <Text style={[
              sharedStyles.featureIcon,
              { color: getQualityColor(item.range) }
            ]}>
              {item.percentage}%
            </Text>
          </View>
          <View style={{
            height: 8,
            backgroundColor: colors.lightGray,
            borderRadius: 4,
            marginTop: 8
          }}>
            <View style={{
              height: 8,
              backgroundColor: getQualityColor(item.range),
              borderRadius: 4,
              width: `${item.percentage}%`
            }} />
          </View>
        </View>
      ))}

      <View style={sharedStyles.averageCard}>
        <Text style={sharedStyles.averageTitle}>📈 Calidad Promedio</Text>
        <Text style={sharedStyles.averageScore}>
          {reportData?.average || 0} / 10
        </Text>
        <Text style={sharedStyles.averageStars}>
          {'★'.repeat(Math.round(reportData?.average || 0))}
          {'☆'.repeat(10 - Math.round(reportData?.average || 0))}
        </Text>
      </View>
    </>
  );

  const renderAlcoholReport = () => (
    <>
      <View style={sharedStyles.card}>
        <Text style={sharedStyles.welcomeTitle}>🍷 Distribución por Alcohol</Text>
        <Text style={sharedStyles.welcomeDescription}>
          Análisis del contenido alcohólico de {reportData?.total || 0} vinos
        </Text>
      </View>

      {reportData?.ranges?.map((item, index) => (
        <View key={index} style={[
          sharedStyles.featureCard,
          { borderLeftColor: getAlcoholColor(item.range) }
        ]}>
          <View style={sharedStyles.featureHeader}>
            <Text style={sharedStyles.featureIcon}>🍷</Text>
            <View style={sharedStyles.featureContent}>
              <Text style={sharedStyles.featureTitle}>
                {item.range}
              </Text>
              <Text style={sharedStyles.featureDescription}>
                {item.count} vinos ({item.percentage}% del total)
              </Text>
            </View>
            <Text style={[
              sharedStyles.featureIcon,
              { color: getAlcoholColor(item.range) }
            ]}>
              {item.percentage}%
            </Text>
          </View>
          <View style={{
            height: 8,
            backgroundColor: colors.lightGray,
            borderRadius: 4,
            marginTop: 8
          }}>
            <View style={{
              height: 8,
              backgroundColor: getAlcoholColor(item.range),
              borderRadius: 4,
              width: `${item.percentage}%`
            }} />
          </View>
        </View>
      ))}

      <View style={sharedStyles.averageCard}>
        <Text style={sharedStyles.averageTitle}>🍷 Alcohol Promedio</Text>
        <Text style={sharedStyles.averageScore}>
          {reportData?.average || 0}% ABV
        </Text>
      </View>
    </>
  );

  const renderGeneralReport = () => (
    <>
      <View style={sharedStyles.card}>
        <Text style={sharedStyles.welcomeTitle}>📊 Estadísticas Generales</Text>
        <Text style={sharedStyles.welcomeDescription}>
          Resumen completo de la base de datos
        </Text>
      </View>

      <View style={[sharedStyles.featureCard, { borderLeftColor: colors.primary }]}>
        <View style={sharedStyles.featureHeader}>
          <Text style={sharedStyles.featureIcon}>🍷</Text>
          <View style={sharedStyles.featureContent}>
            <Text style={sharedStyles.featureTitle}>Total de Vinos</Text>
            <Text style={sharedStyles.featureDescription}>
              Registros en la base de datos
            </Text>
          </View>
          <Text style={[sharedStyles.featureIcon, { color: colors.primary }]}>
            {reportData?.totalWines || 0}
          </Text>
        </View>
      </View>

      <View style={[sharedStyles.featureCard, { borderLeftColor: colors.success }]}>
        <View style={sharedStyles.featureHeader}>
          <Text style={sharedStyles.featureIcon}>⭐</Text>
          <View style={sharedStyles.featureContent}>
            <Text style={sharedStyles.featureTitle}>Calidad Promedio</Text>
            <Text style={sharedStyles.featureDescription}>
              Puntuación media de todos los vinos
            </Text>
          </View>
          <Text style={[sharedStyles.featureIcon, { color: colors.success }]}>
            {reportData?.averageQuality || 0}/10
          </Text>
        </View>
      </View>

      <View style={[sharedStyles.featureCard, { borderLeftColor: colors.warning }]}>
        <View style={sharedStyles.featureHeader}>
          <Text style={sharedStyles.featureIcon}>🍾</Text>
          <View style={sharedStyles.featureContent}>
            <Text style={sharedStyles.featureTitle}>Alcohol Promedio</Text>
            <Text style={sharedStyles.featureDescription}>
              Contenido alcohólico medio
            </Text>
          </View>
          <Text style={[sharedStyles.featureIcon, { color: colors.warning }]}>
            {reportData?.averageAlcohol || 0}%
          </Text>
        </View>
      </View>

      <View style={[sharedStyles.featureCard, { borderLeftColor: colors.info }]}>
        <View style={sharedStyles.featureHeader}>
          <Text style={sharedStyles.featureIcon}>🔬</Text>
          <View style={sharedStyles.featureContent}>
            <Text style={sharedStyles.featureTitle}>pH Promedio</Text>
            <Text style={sharedStyles.featureDescription}>
              Nivel de acidez medio
            </Text>
          </View>
          <Text style={[sharedStyles.featureIcon, { color: colors.info }]}>
            {reportData?.averagePH || 0}
          </Text>
        </View>
      </View>

      <View style={sharedStyles.footer}>
        <Text style={sharedStyles.footerText}>
          📅 Última actualización: {reportData?.lastUpdated || 'No disponible'}
        </Text>
      </View>
    </>
  );

  const getQualityColor = (range) => {
    if (range.includes('3-4')) return colors.danger;
    if (range.includes('5-6')) return colors.warning;
    if (range.includes('7-8')) return colors.success;
    return colors.primary;
  };

  const getAlcoholColor = (range) => {
    if (range.includes('8-10')) return colors.info;
    if (range.includes('10-12')) return colors.success;
    if (range.includes('12-14')) return colors.warning;
    return colors.danger;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={[sharedStyles.card, { alignItems: 'center', padding: 40 }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[sharedStyles.welcomeDescription, { marginTop: 15 }]}>
            Cargando reportes...
          </Text>
        </View>
      );
    }

    switch (activeTab) {
      case 'quality':
        return renderQualityReport();
      case 'alcohol':
        return renderAlcoholReport();
      case 'general':
        return renderGeneralReport();
      default:
        return null;
    }
  };

  return (
    <ScrollView style={sharedStyles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={sharedStyles.header}>
        <Text style={sharedStyles.title}>📊 Reportes</Text>
        <Text style={sharedStyles.subtitle}>Dashboard de Análisis de Vinos</Text>
      </View>

      <View style={sharedStyles.content}>
        {/* Tabs de navegación */}
        <View style={[sharedStyles.card, { padding: 15 }]}>
          <View style={{ flexDirection: 'row' }}>
            {tabs.map(renderTabButton)}
          </View>
        </View>

        {/* Contenido del reporte */}
        {renderContent()}

        {/* Botón de actualizar */}
        <View style={sharedStyles.buttonContainer}>
          <TouchableOpacity 
            style={[sharedStyles.button, sharedStyles.buttonPrimary]} 
            onPress={loadReportData}
            disabled={loading}
          >
            <Text style={sharedStyles.buttonText}>
              🔄 Actualizar Reportes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ReportsScreen;