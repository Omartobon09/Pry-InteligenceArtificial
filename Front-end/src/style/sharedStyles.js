import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Colores de la aplicación
export const colors = {
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#4ECDC4',
  info: '#45B7D1',
  warning: '#F39C12',
  danger: '#FF6B6B',
  light: '#f8f9fa',
  white: '#ffffff',
  dark: '#2c3e50',
  gray: '#7f8c8d',
  lightGray: '#ecf0f1',
  border: '#e1e8ed',
  inputBg: '#f8f9fa',
  placeholder: '#999999',
};

// Sombras reutilizables
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
};

// Estilos compartidos
export const sharedStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  content: {
    padding: 20,
  },
  
  // Header styles
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  
  // Section styles
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 15,
    textAlign: 'center',
  },
  
  // Card styles
  card: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    ...shadows.medium,
  },
  cardLarge: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
    ...shadows.large,
  },
  cardWithBorder: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 5,
    ...shadows.medium,
  },
  
  // Input styles
  inputContainer: {
    marginBottom: 20,
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 15,
    ...shadows.medium,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  inputLabelContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
  },
  inputDescription: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.inputBg,
  },
  
  // Button styles
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    ...shadows.medium,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray,
  },
  
  // Text styles
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeDescription: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
  infoText: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
    textAlign: 'center',
  },
  
  // Feature/Item styles
  featureCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 12,
    borderLeftWidth: 5,
    ...shadows.medium,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 18,
  },
  
  // Horizontal card styles
  horizontalCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...shadows.medium,
  },
  horizontalIcon: {
    fontSize: 24,
    marginRight: 15,
    marginTop: 2,
  },
  horizontalContent: {
    flex: 1,
  },
  horizontalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 6,
  },
  horizontalDescription: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
  },
  
  // Prediction styles
  resultsContainer: {
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 20,
  },
  predictionScore: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  predictionStars: {
    fontSize: 18,
    textAlign: 'center',
  },
  
  // Average/Special cards
  averageCard: {
    backgroundColor: colors.lightGray,
    borderRadius: 15,
    padding: 20,
    borderWidth: 2,
    borderColor: '#bdc3c7',
    marginTop: 10,
  },
  averageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 10,
  },
  averageScore: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  averageStars: {
    fontSize: 20,
    textAlign: 'center',
  },
  
  // Error styles
  errorContainer: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.danger,
    marginBottom: 5,
  },
  errorMessage: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
  },
  
  // Footer styles
  footer: {
    backgroundColor: colors.lightGray,
    borderRadius: 15,
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 16,
    color: colors.dark,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 22,
  },
});

export default sharedStyles;