import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Emergencia: React.FC = () => {
  const [numeroEmergencia, setNumeroEmergencia] = useState('');

  useEffect(() => {
    cargarNumeroEmergencia();
  }, []);

  const cargarNumeroEmergencia = async () => {
    try {
      const numero = await AsyncStorage.getItem('numeroEmergencia');
      if (numero !== null) {
        setNumeroEmergencia(numero);
      }
    } catch (error) {
      console.error('Error al cargar el número de emergencia:', error);
    }
  };

  const guardarNumeroEmergencia = async () => {
    if (numeroEmergencia.length != 10) {
      Alert.alert('Error', 'Por favor, ingrese un número de teléfono válido');
      return;
    }
    try {
      await AsyncStorage.setItem('numeroEmergencia', numeroEmergencia);
      Alert.alert('Éxito', 'Número de emergencia guardado correctamente');
    } catch (error) {
      console.error('Error al guardar el número de emergencia:', error);
      Alert.alert('Error', 'No se pudo guardar el número de emergencia');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Configuración de Número de Emergencia</Text>
      <TextInput
        style={styles.input}
        value={numeroEmergencia}
        onChangeText={setNumeroEmergencia}
        placeholder="Ingrese el número de emergencia"
        keyboardType="phone-pad"
      />
      <Button title="Guardar número" onPress={guardarNumeroEmergencia} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white', 
  },
});

export default Emergencia;