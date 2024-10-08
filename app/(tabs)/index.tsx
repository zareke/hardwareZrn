import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SMS from 'expo-sms';
import * as Linking from 'expo-linking';
import { useIsFocused } from '@react-navigation/native';

type Subscription = {
  remove: () => void;
};

export default function HomeScreen() {
  const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const isFocused = useIsFocused();

  const SHAKE_THRESHOLD = 5;
  const SHAKE_TIMEOUT = 1000;
  let lastShakeTime = 0;

  useEffect(() => {
    checkAccelerometerAvailability();
    return () => _unsubscribe();
  }, []);

  useEffect(() => {
    if (isFocused && isAvailable) {
      _subscribe();
    } else {
      _unsubscribe();
    }
  }, [isFocused, isAvailable]);

  const checkAccelerometerAvailability = async () => {
    if (Platform.OS === 'web') {
      setIsAvailable(false);
      Alert.alert('Aviso', 'La detección de sacudidas no está disponible en entornos web.');
      return;
    }

    try {
      const available = await Accelerometer.isAvailableAsync();
      setIsAvailable(available);
      if (!available) {
        Alert.alert('Aviso', 'La detección de sacudidas no está disponible en este dispositivo.');
      }
    } catch (error) {
      console.error('Error al verificar la disponibilidad del acelerómetro:', error);
      setIsAvailable(false);
      Alert.alert('Error', 'No se pudo verificar la disponibilidad de la detección de sacudidas.');
    }
  };

  const _subscribe = () => {
    try {
      _unsubscribe();
      const newSubscription = Accelerometer.addListener(accelerometerData => {
        setData(accelerometerData);
        detectShake(accelerometerData);
      });
      setSubscription(newSubscription);
    } catch (error) {
      console.error('Error al suscribirse al acelerómetro:', error);
      Alert.alert('Error', 'No se pudo inicializar el detector de sacudidas.');
    }
  };

  const _unsubscribe = () => {
    if (subscription) {
      subscription.remove();
    }
    setSubscription(null);
  };

  const detectShake = (data: { x: number; y: number; z: number }) => {
    const now = Date.now();
    if (now - lastShakeTime < SHAKE_TIMEOUT) return;

    const force = Math.abs(data.x) + Math.abs(data.y) + Math.abs(data.z);
    if (force > SHAKE_THRESHOLD) {
      lastShakeTime = now;
      enviarMensajeEmergencia();
    }
  };

  const enviarMensajeEmergencia = async () => {
    try {
      const numeroEmergencia = await AsyncStorage.getItem('numeroEmergencia');
      if (numeroEmergencia) {
        const mensaje = '¡Emergencia! Necesito ayuda.';
        
        const isAvailable = await SMS.isAvailableAsync();
        if (isAvailable) {
          const { result } = await SMS.sendSMSAsync(numeroEmergencia, mensaje);
          if (result === 'sent') {
            Alert.alert('Éxito', 'Mensaje de emergencia enviado por SMS');
            return;
          }
        }
        
      }
      }  catch (error) {
      console.error('Error al enviar mensaje de emergencia:', error);
      Alert.alert('Error', 'No se pudo enviar el mensaje de emergencia');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BIENVENIDO/A A LA MEJOR APLICACIÓN DEL MUNDO!</Text>
      <Text style={styles.subtitle}>
        P.D. Si sacudes el dispositivo en esta pantalla se enviará un mensaje de emergencia al número configurado en la sección Emergencia.
      </Text>
      {isAvailable && isFocused ? (
        <Text style={styles.shakeStatus}>Detección de sacudidas activada</Text>
      ) : (
        <Text style={styles.shakeStatus}>Detección de sacudidas no disponible</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
  },
  shakeStatus: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
});