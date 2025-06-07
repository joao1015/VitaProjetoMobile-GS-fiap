import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import { postReport } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { Colors, Spacing, Typography } from '../styles/theme';
import { LinearGradient } from 'expo-linear-gradient';

const eventTypes = ['Enchente', 'Deslizamento', 'Árvores Caídas', 'Queimadas'];

export default function ReportScreen({ navigation }: any) {
  const [type, setType] = useState(eventTypes[0]);
  const [description, setDescription] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [manualLat, setManualLat] = useState('');
  const [manualLon, setManualLon] = useState('');
  const [loadingLoc, setLoadingLoc] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const { token } = useContext(AuthContext);

  // Para animação de toque no botão
  const scaleBtn = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') throw new Error('Sem permissão');
        const loc = await Location.getCurrentPositionAsync({});
        setCoords({ lat: loc.coords.latitude, lon: loc.coords.longitude });
      } catch {
        // Apenas alerta se der erro (já está previsto abaixo)
      } finally {
        setLoadingLoc(false);
      }
    })();
  }, []);

  // Atualiza coords caso usuário preencha manualmente
  useEffect(() => {
    if (manualLat && manualLon && !isNaN(Number(manualLat)) && !isNaN(Number(manualLon))) {
      setCoords({ lat: Number(manualLat), lon: Number(manualLon) });
    }
  }, [manualLat, manualLon]);

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
      Alert.alert('Atenção', 'Aguardando localização ou preencha manualmente.');
      return;
    }
    setLoadingSubmit(true);
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
      setManualLat('');
      setManualLon('');
      navigation.navigate('Alerts');
    } catch {
      Alert.alert('Erro', 'Falha ao enviar evento.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handlePressIn = () => {
    Animated.spring(scaleBtn, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleBtn, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Reportar Evento</Text>
      <Text style={styles.label}>Tipo de Evento:</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={type} onValueChange={setType} style={styles.picker}>
          {eventTypes.map((ev) => (
            <Picker.Item key={ev} label={ev} value={ev} />
          ))}
        </Picker>
      </View>
      <Text style={styles.label}>Descrição:</Text>
      <TextInput
        placeholder="Ex: Avenida alagada, trânsito bloqueado, árvores caídas..."
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
        numberOfLines={3}
        accessibilityLabel="Descrição do evento"
      />
      <Text style={styles.label}>Localização:</Text>
      {loadingLoc ? (
        <ActivityIndicator size="small" color={Colors.primary} style={{ marginVertical: 10 }} />
      ) : coords ? (
        <Text style={styles.coords}>{`Latitude: ${coords.lat.toFixed(4)}   Longitude: ${coords.lon.toFixed(4)}`}</Text>
      ) : (
        <Text style={{ color: Colors.error, marginBottom: 4 }}>Sem localização automática. Informe manualmente:</Text>
      )}
      {!coords && (
        <View>
          <TextInput
            placeholder="Latitude"
            value={manualLat}
            onChangeText={setManualLat}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Longitude"
            value={manualLon}
            onChangeText={setManualLon}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
      )}

      <Animated.View style={{ transform: [{ scale: scaleBtn }], marginTop: Spacing(4) }}>
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handleSubmit}
          disabled={loadingSubmit || !description.trim() || !coords}
          accessibilityRole="button"
          accessibilityLabel="Enviar evento"
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[Colors.primary, '#19c4b1']}
            style={[
              styles.btn,
              (loadingSubmit || !description.trim() || !coords) && { opacity: 0.6 },
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {loadingSubmit ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.btnText}>Enviar Evento</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing(5),
    backgroundColor: Colors.surfaceAlt,
    flexGrow: 1,
  },
  title: {
    ...Typography.h1,
    fontSize: 22,
    textAlign: 'center',
    marginBottom: Spacing(4),
  },
  label: {
    ...Typography.body,
    marginTop: Spacing(2),
    marginBottom: 2,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  pickerWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: Spacing(2),
  },
  picker: {
    width: '100%',
    color: Colors.textPrimary,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: Spacing(2),
    marginBottom: Spacing(2),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
  },
  coords: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: Spacing(2),
  },
  btn: {
    borderRadius: 12,
    paddingVertical: Spacing(3),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    minWidth: 180,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});

