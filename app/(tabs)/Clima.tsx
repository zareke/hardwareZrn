import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';

const Clima: React.FC = () => {
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permiso para acceder a la ubicación fue denegado');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      fetchWeather(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  const fetchWeather = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get('https://api.tomorrow.io/v4/timelines', {
        params: {
          location: `${latitude},${longitude}`,
          fields: ['temperature', 'precipitationProbability', 'humidity'],
          units: 'metric',
          timesteps: '1h',
          startTime: new Date().toISOString(),
          endTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
          apikey: 'Z07Hw9R2nV97fCSjhxcUU6P1orItnDQR',
        },
      });

      if (response.data.data.timelines.length > 0) {
        setCurrentWeather(response.data.data.timelines[0].intervals[0]);
      }
    } catch (error) {
      console.error('Error al obtener el clima:', error);
      setError('No se pudo obtener la información del clima.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>El clima en tu ubicación</Text>
      {loading ? (
        <Text>Cargando información del clima...</Text>
      ) : error ? (
        <Text>{error}</Text>
      ) : currentWeather ? (
        <View style={styles.weatherContainer}>
          <Text>Temperatura: {currentWeather.values.temperature}°C</Text>
          <Text>Probabilidad de lluvia: {currentWeather.values.precipitationProbability}%</Text>
          <Text>Humedad: {currentWeather.values.humidity}%</Text>
          {location && (
            <View>
            <Text>
              Latitud: {location.coords.latitude.toFixed(4)}
            </Text>
            <Text>
              Longitud: {location.coords.longitude.toFixed(4)}
            </Text>
            </View>
          )}
        </View>
      ) : (
        <Text>No hay datos disponibles.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5FCFF',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  weatherContainer: {
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default Clima;