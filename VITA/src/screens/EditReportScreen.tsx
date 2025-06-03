// src/screens/EditReportScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { updateReport } from '../services/api';
import { Colors, Spacing, Typography } from '../styles/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainStack';
import DateTimePicker from '@react-native-community/datetimepicker';

type Props = NativeStackScreenProps<MainStackParamList, 'EditarRelato'>;

export default function EditReportScreen({ route, navigation }: Props) {
  const { report } = route.params;

  // Inicializamos cada campo com o valor atual do relatório
  const [type, setType] = useState(report.type);
  const [description, setDescription] = useState(report.description);
  const [latitude, setLatitude] = useState(String(report.latitude));
  const [longitude, setLongitude] = useState(String(report.longitude));
  const [address, setAddress] = useState(report.address || '');
  const [date, setDate] = useState(new Date(report.date));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    // Validações básicas
    if (!type.trim() || !description.trim() || !latitude.trim() || !longitude.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    const latNum = parseFloat(latitude.replace(',', '.'));
    const lonNum = parseFloat(longitude.replace(',', '.'));
    if (isNaN(latNum) || isNaN(lonNum)) {
      Alert.alert('Erro', 'Latitude e longitude devem ser números válidos.');
      return;
    }

    setLoading(true);
    try {
      const updatedReport = {
        type,
        description,
        latitude: latNum,
        longitude: lonNum,
        address,
        date: date.toISOString(),
      };
      await updateReport(report.id!, updatedReport);
      Alert.alert('Sucesso', 'Relato atualizado!');
      navigation.goBack(); // Retorna para "Meus Relatos", que será recarregado
    } catch {
      Alert.alert('Erro', 'Falha ao atualizar o relato.');
    } finally {
      setLoading(false);
    }
  };

  const onChangeDate = (_: any, selected?: Date) => {
    setShowDatePicker(false);
    if (selected) {
      setDate(selected);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Tipo de evento:</Text>
      <TextInput
        style={styles.input}
        value={type}
        onChangeText={setType}
        placeholder="Ex: Enchente"
      />

      <Text style={[styles.label, { marginTop: Spacing(2) }]}>Descrição:</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        multiline
        value={description}
        onChangeText={setDescription}
        placeholder="Descreva o que aconteceu"
      />

      <Text style={[styles.label, { marginTop: Spacing(2) }]}>Endereço:</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Rua, número, bairro, cidade"
      />

      <Text style={[styles.label, { marginTop: Spacing(2) }]}>Latitude:</Text>
      <TextInput
        style={styles.input}
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="decimal-pad"
        placeholder="-23.564293"
      />

      <Text style={[styles.label, { marginTop: Spacing(2) }]}>Longitude:</Text>
      <TextInput
        style={styles.input}
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="decimal-pad"
        placeholder="-46.652590"
      />

      <Text style={[styles.label, { marginTop: Spacing(2) }]}>Data/Hora do Evento:</Text>
      <View>
        <Button
          title={date.toLocaleString('pt-BR')}
          onPress={() => setShowDatePicker(true)}
          color={Colors.primaryDark}
        />
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={onChangeDate}
        />
      )}

      <View style={{ height: Spacing(4) }} />
      <Button title="Salvar Alterações" onPress={handleSave} color={Colors.primary} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing(4),
    backgroundColor: Colors.surface,
  },
  label: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing(1),
    color: Colors.primaryDark,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.textSecondary,
    borderRadius: 8,
    padding: Spacing(2),
    fontSize: 16,
    color: Colors.textPrimary,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
});
