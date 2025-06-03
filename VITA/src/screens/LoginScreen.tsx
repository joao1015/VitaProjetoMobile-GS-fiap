// src/screens/LoginScreen.tsx

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
import { login } from '../services/auth';
import { AuthContext } from '../contexts/AuthContext';
import { Colors, Spacing, Typography } from '../styles/theme';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const { setToken } = useContext(AuthContext);

  const handle = async () => {
    if (!email.trim() || !pwd.trim()) {
      Alert.alert('Erro', 'Por favor, preencha e-mail e senha.');
      return;
    }
    try {
      const token = await login(email, pwd);
      setToken(token);
      // O RootNavigator detecta token ≠ null e muda para MainStack automaticamente
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 401) {
          Alert.alert('Credenciais inválidas', 'Usuário não cadastrado ou senha incorreta.');
        } else if (err.response.status === 400) {
          // Supondo que o backend envie objeto { message: '...' } ou ModelState
          const serverMsg =
            err.response.data?.message ||
            'Senha fora do padrão. Verifique requisitos.';
          Alert.alert('Erro de validação', serverMsg);
        } else {
          Alert.alert('Erro', 'Não foi possível fazer login. Tente novamente mais tarde.');
        }
      } else {
        Alert.alert('Erro de conexão', 'Não foi possível conectar ao servidor.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar no VITA</Text>

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
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={[Typography.caption, { color: Colors.primary, marginTop: Spacing(2) }]}>
          Ainda não tem conta? Cadastre-se aqui.
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
