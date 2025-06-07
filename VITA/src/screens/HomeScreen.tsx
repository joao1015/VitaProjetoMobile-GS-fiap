// src/screens/HomeScreen.tsx

import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Typography } from '../styles/theme';
import { logout } from '../services/auth';
import { AuthContext } from '../contexts/AuthContext';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { setToken } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout();
      setToken(null); // Força o RootNavigator a exibir AuthStack novamente
    } catch {
      Alert.alert('Erro', 'Falha ao deslogar.');
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>
        Bem-vindo ao <Text style={{ color: Colors.primary }}>VITA</Text>!
      </Text>
      <Text style={styles.subtitle}>
        <Text style={{ fontWeight: 'bold', color: Colors.primary }}>VITA</Text>: Juntos contra eventos extremos.{"\n"}
        Reporte enchentes, queimadas e outros riscos na sua região.{"\n"}
        Ganhe pontos, veja eventos próximos e ajude sua comunidade.{"\n"}
        Seus dados ajudam a prevenir desastres com inteligência artificial!
      </Text>

      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Report')}>
        <Text style={styles.btnText}>📤 Reportar Evento</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnOutline} onPress={() => navigation.navigate('Alerts')}>
        <Text style={styles.btnTextAlt}>🔔 Ver Alertas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: Spacing(6),
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
  },
  title: {
    ...Typography.h1,
    fontSize: 28,
    marginBottom: Spacing(2),
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    marginBottom: Spacing(6),
    textAlign: 'center',
    color: Colors.textSecondary,
  },
  btn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing(3),
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: Spacing(3),
  },
  btnOutline: {
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingVertical: Spacing(3),
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  btnTextAlt: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  logoutBtn: {
    marginTop: Spacing(8),
    alignItems: 'center',
  },
  logoutText: {
    color: Colors.error,
    fontSize: 16,
    fontWeight: '600',
  },
});
