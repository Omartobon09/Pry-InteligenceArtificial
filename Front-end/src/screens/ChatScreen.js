import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from 'react-native';
import styles from '../style/styles';

const ChatScreen = ({ userName }) => {
  const [messages, setMessages] = useState([
    { from: 'bot', text: '🍷 ¡Hola! Soy tu sommelier virtual. ¿En qué puedo ayudarte con el mundo del vino?' },
  ]);
  const [inputText, setInputText] = useState('');

  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();

    if (msg.includes('vino tinto')) {
      return 'El vino tinto suele acompañar muy bien las carnes rojas y quesos curados.';
    }
    if (msg.includes('vino blanco')) {
      return 'El vino blanco es ideal para mariscos, pescados y comidas ligeras.';
    }
    if (msg.includes('maridaje')) {
      return 'El maridaje perfecto depende del tipo de vino y del plato. ¿Qué piensas comer?';
    }
    if (msg.includes('tipos') || msg.includes('variedades')) {
      return 'Existen muchas variedades: Cabernet Sauvignon, Merlot, Malbec, Chardonnay, entre otros.';
    }
    if (msg.includes('recomiendas') || msg.includes('me sugieres')) {
      return 'Si estás empezando, un vino Merlot puede ser una buena opción por su suavidad.';
    }
    if (msg.includes('salud') || msg.includes('beneficios')) {
      return 'Un consumo moderado de vino tinto puede tener beneficios para la salud cardiovascular.';
    }

    return 'Interesante pregunta 🍇. ¿Podrías especificarme un poco más sobre lo que quieres saber de los vinos?';
  };

  const handleSend = () => {
  if (inputText.trim() === '') return;

  const userMessage = { from: 'user', text: inputText };
  setMessages(prev => [...prev, userMessage]);
  const userInput = inputText;
  setInputText('');

  setMessages(prev => [...prev, { from: 'bot', text: 'Escribiendo...' }]);

  setTimeout(() => {
    setMessages(prev => {
      const messagesWithoutTyping = prev.slice(0, -1); 
      const botResponse = getBotResponse(userInput);
      return [...messagesWithoutTyping, { from: 'bot', text: botResponse }];
    });
  }, 2000);
};


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.containers}
    >
      <View style={styles.chatHeader}>
        <Text style={styles.chatUserName}>{userName}</Text>
        <Text style={styles.chatStatus}>🟢 En línea - Sommelier virtual</Text>
      </View>
      <ScrollView contentContainerStyle={styles.chatScroll}>
        <View style={styles.containers_p}>
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.chatBubble,
                msg.from === 'user' ? styles.chatUser : styles.chatBot,
              ]}
            >
              <Text style={styles.chatText}>{msg.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.chatInputContainer}>
        <TextInput
          style={styles.chatInput}
          placeholder="Escribe un mensaje..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.chatSendButton} onPress={handleSend}>
          <Text style={styles.chatSendText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

