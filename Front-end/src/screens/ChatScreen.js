import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  Dimensions
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const ChatScreen = ({ userName = "Usuario" }) => {
  const [messages, setMessages] = useState([
    { from: 'bot', text: '🍷 ¡Hola! Soy tu sommelier virtual. ¿En qué puedo ayudarte con el mundo del vino?' },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef(null);

  // Auto scroll al final cuando se agregan nuevos mensajes
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = async () => {
    if (inputText.trim() === '' || isLoading) return;

    const userMessage = { from: 'user', text: inputText.trim() };
    const userInput = inputText.trim();
    setInputText('');
    setIsLoading(true);
    
    // Agregar mensaje del usuario
    setMessages(prev => [...prev, userMessage]);
    
    // Agregar indicador de escritura
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'bot', text: 'Escribiendo...', isTyping: true }]);
    }, 200);

    try {
      const response = await fetch('https://fa57-181-236-101-182.ngrok-free.app/webhooks/rest/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: 'usuario1',
          message: userInput,
        }),
      });

      const textResponse = await response.text();
      console.log('Respuesta del servidor:', textResponse);

      try {
        const data = JSON.parse(textResponse);
        const botMessages = data.map(entry => ({
          from: 'bot',
          text: entry.text || '🤖 (sin respuesta)',
          isTyping: false,
        }));

        setMessages(prev => {
          // Remover el mensaje de "Escribiendo..."
          const messagesWithoutTyping = prev.filter(msg => !msg.isTyping);
          return [...messagesWithoutTyping, ...botMessages];
        });
      } catch (jsonError) {
        console.error('Error al parsear JSON:', jsonError);
        console.log('Respuesta como texto:', textResponse);
        setMessages(prev => {
          const messagesWithoutTyping = prev.filter(msg => !msg.isTyping);
          return [...messagesWithoutTyping, { 
            from: 'bot', 
            text: '❌ Error de formato en la respuesta del bot.',
            isTyping: false 
          }];
        });
      }
    } catch (error) {
      console.error('Error en la conexión:', error);
      setMessages(prev => {
        const messagesWithoutTyping = prev.filter(msg => !msg.isTyping);
        return [...messagesWithoutTyping, { 
          from: 'bot', 
          text: '❌ Error al conectar con el bot. Verifica tu conexión.',
          isTyping: false 
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (msg, index) => {
    if (msg.from === 'bot') {
      return (
        <View key={index} style={styles.botMessageWrapper}>
          <View style={styles.botMessage}>
            <View style={styles.messageHeader}>
              <Text style={styles.botIcon}>🤖</Text>
              <Text style={styles.botName}>Sommelier Virtual</Text>
            </View>
            <Text style={styles.botMessageText}>{msg.text}</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View key={index} style={styles.userMessageWrapper}>
          <View style={styles.userMessage}>
            <View style={styles.messageHeader}>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.userIcon}>👤</Text>
            </View>
            <Text style={styles.userMessageText}>{msg.text}</Text>
          </View>
        </View>
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* Header del Chat */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🤖 Chat con IA</Text>
        <Text style={styles.headerSubtitle}>Conversando con {userName} - Sommelier Virtual</Text>
      </View>

      {/* Área de mensajes */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((msg, index) => (
          <View key={`message-${index}`} style={styles.messageContainer}>
            {renderMessage(msg, index)}
          </View>
        ))}
      </ScrollView>

      {/* Input Container */}
      <View style={styles.inputSection}>
        <View style={styles.inputContainer}>
          <View style={styles.inputHeader}>
            <Text style={styles.inputIcon}>💬</Text>
            <View style={styles.inputLabelContainer}>
              <Text style={styles.inputLabel}>Mensaje</Text>
              <Text style={styles.inputDescription}>Escribe tu consulta sobre vinos</Text>
            </View>
          </View>
          
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              placeholder="Pregunta sobre vinos..."
              placeholderTextColor="#999999"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              editable={!isLoading}
            />
            
            <TouchableOpacity
              style={[
                styles.sendButton,
                (inputText.trim() === '' || isLoading) && styles.sendButtonDisabled
              ]}
              onPress={handleSend}
              disabled={inputText.trim() === '' || isLoading}
            >
              <Text style={styles.sendButtonText}>
                {isLoading ? 'Enviando...' : 'Enviar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    backgroundColor: '#667eea',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  
  // Messages Area
  messagesContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: 15,
    width: '100%',
  },
  
  // Message Header
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  // Bot Messages
  botMessageWrapper: {
    alignSelf: 'flex-start',
    maxWidth: screenWidth * 0.8,
    minWidth: 100,
  },
  botMessage: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  botIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  botName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
    flex: 1,
  },
  botMessageText: {
    fontSize: 15,
    color: '#2c3e50',
    lineHeight: 22,
    marginTop: 4,
  },
  
  // User Messages
  userMessageWrapper: {
    alignSelf: 'flex-end',
    maxWidth: screenWidth * 0.8,
    minWidth: 100,
  },
  userMessage: {
    backgroundColor: '#667eea',
    borderRadius: 15,
    padding: 15,
    borderRightWidth: 4,
    borderRightColor: '#764ba2',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userIcon: {
    fontSize: 18,
    color: '#ffffff',
    marginLeft: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  userMessageText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.95)',
    lineHeight: 22,
    marginTop: 4,
  },
  
  // Input Section
  inputSection: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e1e8ed',
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
    color: '#667eea',
  },
  inputLabelContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  inputDescription: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    maxHeight: 80,
    minHeight: 44,
    textAlignVertical: 'top',
    color: '#2c3e50',
  },
  sendButton: {
    backgroundColor: '#667eea',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sendButtonDisabled: {
    opacity: 0.6,
    backgroundColor: '#95a5a6',
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default ChatScreen;