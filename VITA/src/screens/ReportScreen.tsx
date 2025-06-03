// src/screens/ReportScreen.tsx

import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import { postReport } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { Colors, Spacing, Typography } from '../styles/theme';

const eventTypes = ['Enchente', 'Deslizamento', 'Árvores Caídas', 'Queimadas'];

export default function ReportScreen({ navigation }: any) {
  const [type, setType] = useState(eventTypes[0]);
  const [description, setDescription] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [loadingLoc, setLoadingLoc] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') throw new Error('Sem permissão');
        const loc = await Location.getCurrentPositionAsync({});
        setCoords({ lat: loc.coords.latitude, lon: loc.coords.longitude });
      } catch {
        Alert.alert('GPS', 'Não foi possível obter localização; preencha manualmente.');
      } finally {
        setLoadingLoc(false);
      }
    })();
  }, []);

  const handleSubmit = async () => {
    if (!token) {
      Alert.alert('Atenção', 'Você precisa fazer login antes de enviar um evento.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha a descrição.');
      return;
    }
    if (!coords) {
      Alert.alert('Atenção', 'Aguardando localização...');
      return;
    }

    try {
      await postReport({
        type,
        description,
        latitude: coords.lat,
        longitude: coords.lon,
        date: new Date().toISOString(),
      });
      Alert.alert('Sucesso', 'Evento reportado com sucesso!');

      setDescription('');
      navigation.navigate('Alerts');
      // Como AlertsScreen usa useFocusEffect, ele recarregará automaticamente
    } catch {
      Alert.alert('Erro', 'Falha ao enviar evento.');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Reportar Evento</Text>

      <Picker selectedValue={type} onValueChange={(v) => setType(v as string)}>
        {eventTypes.map((ev) => (
          <Picker.Item key={ev} label={ev} value={ev} />
        ))}
      </Picker>

      <TextInput
        placeholder="Descrição"
        value={description}
        onChangeText={setDescription}
        style={{ borderBottomWidth: 1, marginVertical: 16, padding: 4 }}
      />

      {loadingLoc ? (
        <ActivityIndicator size="small" color={Colors.primary} />
      ) : coords ? (
        <Text>{`Latitude: ${coords.lat.toFixed(4)}\nLongitude: ${coords.lon.toFixed(4)}`}</Text>
      ) : (
        <Text>Sem localização: informe manualmente em descrição.</Text>
      )}

      <View style={{ height: 16 }} />
      <Button title="Enviar Evento" onPress={handleSubmit} color={Colors.primary} />
    </ScrollView>
  );
}
