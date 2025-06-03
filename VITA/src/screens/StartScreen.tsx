// src/screens/StartScreen.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Typography } from '../styles/theme';

export default function StartScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🌊 VITA</Text>
      <Text style={[Typography.body, { textAlign: 'center', marginTop: Spacing(4) }]}>
        Bem-vindo(a)! Para continuar, faça login ou crie sua conta.
      </Text>

      <View style={{ height: Spacing(8) }} />

      <TouchableOpacity
        style={styles.buttonPrimary}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <View style={{ height: Spacing(2) }} />

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.buttonTextAlt}>Criar Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing(6),
  },
  logo: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
    padding: Spacing(4),
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  buttonSecondary: {
    borderWidth: 2,
    borderColor: Colors.primary,
    padding: Spacing(4),
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonTextAlt: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
});
