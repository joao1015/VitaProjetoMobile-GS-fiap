import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { login } from '../services/auth';
import { Colors, Spacing, Typography } from '../styles/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const { setToken } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email.trim() || !pwd.trim()) {
      Alert.alert('Campos obrigatórios', 'Informe e-mail e senha.');
      return;
    }

    try {
      setLoading(true);
    const token = await login(email, pwd); // ✅ Passando email e senha corretamente

      setToken(token);
    } catch {
      Alert.alert('Erro', 'Falha ao fazer login. Verifique as credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        onChangeText={setPwd}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing(4),
    backgroundColor: Colors.surfaceAlt,
  },
  title: {
    ...Typography.h2,
    textAlign: 'center',
    marginBottom: Spacing(4),
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    padding: Spacing(2),
    marginBottom: Spacing(3),
  },
  button: {
    backgroundColor: Colors.primary,
    padding: Spacing(2),
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
