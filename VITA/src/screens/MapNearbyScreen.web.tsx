// src/screens/MapNearbyScreen.tsx
import React, { useEffect, useState, useMemo } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { View, StyleSheet, ActivityIndicator, Text, Button } from 'react-native';
import * as Location from 'expo-location';
import { getReports, Report } from '../services/api';
import { Colors } from '../styles/theme';

export default function MapNearbyScreen() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setError(null);
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permissão de localização negada');
      }

      const pos = await Location.getCurrentPositionAsync({});
      const current = { 
        latitude: pos.coords.latitude, 
        longitude: pos.coords.longitude 
      };
      setLocation(current);

      const allReports = await getReports();
      setReports(allReports);
    } catch (err) {
      setError('Não foi possível carregar os dados. Verifique sua conexão e permissões de localização.');
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Atualiza os reports a cada 5 minutos
    const intervalId = setInterval(() => {
      getReports().then(updatedReports => {
        setReports(updatedReports);
      }).catch(console.warn);
    }, 300000);

    return () => clearInterval(intervalId);
  }, []);

  const nearbyReports = useMemo(() => {
    if (!location) return [];
    
    return reports.filter(r => 
      r.latitude != null && 
      r.longitude != null && 
      getDistance(location, { latitude: r.latitude, longitude: r.longitude }) <= 10000
    );
  }, [reports, location]);

  const getMarkerColor = (type: string) => {
    const colors: Record<string, string> = {
      flood: 'red',
      enchente: 'red',
      fire: 'orange',
      incêndio: 'orange',
      accident: 'blue',
      acidente: 'blue',
      default: Colors.primary,
    };
    const lowerType = type.toLowerCase();
    return colors[lowerType] || colors.default;
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button 
          title="Tentar novamente" 
          onPress={loadData}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (!location || loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text>Carregando mapa…</Text>
      </View>
    );
  }

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      initialRegion={{
        ...location,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
      showsUserLocation={true}
      showsMyLocationButton={true}
    >
      <Marker
        coordinate={location}
        title="Sua localização"
        pinColor="green"
      />
      
      {nearbyReports.map((report) => (
        <Marker
          key={report.id}
          coordinate={{ 
            latitude: report.latitude, 
            longitude: report.longitude 
          }}
          pinColor={getMarkerColor(report.type)}
          title={report.type.charAt(0).toUpperCase() + report.type.slice(1)}
          description={report.description}
        />
      ))}
    </MapView>
  );
}

// Distância em metros (fórmula Haversine)
function getDistance(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371e3; // raio da Terra em metros

  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);

  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const aCalc = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(aCalc), Math.sqrt(1 - aCalc));

  return R * c;
}

const styles = StyleSheet.create({
  map: { 
    flex: 1 
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 20,
  },
  errorText: {
    color: Colors.error,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    paddingHorizontal: 20,
  },
});