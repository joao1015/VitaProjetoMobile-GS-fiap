// src/screens/RegisterScreen.tsx

import React, { useState, useContext } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { register } from '../services/auth';
import { AuthContext } from '../contexts/AuthContext';
import { Colors, Spacing, Typography } from '../styles/theme';

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const { setToken } = useContext(AuthContext);

  const handle = async () => {
    if (!email.trim() || !pwd.trim()) {
      Alert.alert('Erro', 'Por favor, preencha e-mail e senha.');
      return;
    }
    try {
      const token = await register(email, pwd);
      setToken(token);
      // RootNavigator detecta token ≠ null e muda para MainStack
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 400) {
          const serverMsg =
            err.response.data?.message ||
            'Senha fora do padrão ou e-mail inválido.';
          Alert.alert('Erro de validação', serverMsg);
        } else if (err.response.status === 409) {
          Alert.alert('Usuário já existe', 'E-mail já cadastrado.');
        } else {
          Alert.alert('Erro', 'Não foi possível cadastrar. Tente mais tarde.');
        }
      } else {
        Alert.alert('Erro de conexão', 'Não foi possível conectar ao servidor.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta no VITA</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor={Colors.textSecondary}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={pwd}
        onChangeText={setPwd}
        secureTextEntry
        placeholderTextColor={Colors.textSecondary}
      />

      <TouchableOpacity style={styles.button} onPress={handle}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={[Typography.caption, { color: Colors.primary, marginTop: Spacing(2) }]}>
          Já possui conta? Faça login aqui.
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing(6),
    backgroundColor: Colors.surface,
  },
  title: {
    ...Typography.h1,
    marginBottom: Spacing(6),
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.textSecondary,
    borderRadius: 8,
    padding: Spacing(3),
    marginBottom: Spacing(3),
    fontSize: 16,
    color: Colors.textPrimary,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing(3),
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
