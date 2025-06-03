// MapNearbyScreen.web.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { WebView } from 'react-native-webview';
import { Colors, Typography } from '../styles/theme';

export default function MapNearbyScreenWeb() {
  const [loc, setLoc] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') throw new Error('Sem permissão');
        const position = await Location.getCurrentPositionAsync({});
        setLoc({ lat: position.coords.latitude, lon: position.coords.longitude });
      } catch {
        // fallback: centro do Brasil
        setLoc({ lat: -15.78, lon: -47.93 });
      }
    })();
  }, []);

  if (!loc) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={Typography.body}>Carregando mapa…</Text>
      </View>
    );
  }

  const url = `https://www.google.com/maps/@${loc.lat},${loc.lon},14z`;
  return <WebView source={{ uri: url }} style={styles.map} />;
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
});
