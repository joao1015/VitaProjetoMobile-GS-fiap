import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Typography } from '../styles/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function StartScreen() {
  const navigation = useNavigation<any>();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🌊</Text>
      <Text style={styles.appName}>VITA</Text>
      <Text style={styles.slogan}>Monitoramento de eventos extremos</Text>

      <Text style={styles.introText}>
        Acompanhe alertas, reporte eventos e ajude a proteger sua região.
      </Text>

      <View style={{ height: Spacing(8) }} />

      <Animated.View style={{ width: '80%', transform: [{ scale }] }}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => navigation.navigate('Login')}
          accessibilityRole="button"
          accessibilityLabel="Entrar no aplicativo"
        >
          <LinearGradient
            colors={[Colors.primary, '#19c4b1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonPrimary}
          >
            <Text style={styles.buttonText}>Entrar</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <View style={{ height: Spacing(2) }} />

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => navigation.navigate('Register')}
        accessibilityRole="button"
        accessibilityLabel="Criar conta"
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
    fontSize: 60,
    marginBottom: Spacing(1),
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    marginBottom: Spacing(1),
    letterSpacing: 2,
  },
  slogan: {
    color: Colors.primary,
    fontSize: 16,
    marginBottom: Spacing(3),
    textAlign: 'center',
    fontWeight: '500',
  },
  introText: {
    ...Typography.body,
    textAlign: 'center',
    marginTop: Spacing(2),
    color: Colors.textSecondary,
  },
  buttonPrimary: {
    padding: Spacing(4),
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      android: { elevation: 2 },
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
    }),
  },
  buttonSecondary: {
    borderWidth: 2,
    borderColor: Colors.primary,
    padding: Spacing(4),
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginTop: Spacing(1),
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonTextAlt: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 16,
  },
});
