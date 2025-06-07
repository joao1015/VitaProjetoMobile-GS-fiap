// src/screens/HomeScreen.tsx

import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Typography } from '../styles/theme';
import { logout } from '../services/auth';
import { AuthContext } from '../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';


export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { setToken } = useContext(AuthContext);

  // Escala para animação de toque
  const scaleReport = React.useRef(new Animated.Value(1)).current;
  const scaleAlerts = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = (anim: Animated.Value) => {
    Animated.spring(anim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = (anim: Animated.Value) => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  };

  const handleLogout = async () => {
    try {
      await logout();
      setToken(null);
    } catch {
      Alert.alert('Erro', 'Falha ao deslogar.');
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>
        Bem-vindo ao <Text style={styles.titleHighlight}>VITA</Text>!
      </Text>
      <Text style={styles.subtitle}>
        <Text style={{ fontWeight: 'bold', color: Colors.primary }}>VITA</Text>: Juntos contra eventos extremos.{"\n"}
        Reporte enchentes, queimadas e outros riscos na sua região.{"\n"}
        Ganhe pontos, veja eventos próximos e ajude sua comunidade.{"\n"}
        Seus dados ajudam a prevenir desastres com inteligência artificial!
      </Text>

      <View style={styles.buttonsGroup}>
        {/* Botão com Gradient e Animação */}
        <TouchableWithoutFeedback
          onPressIn={() => handlePressIn(scaleReport)}
          onPressOut={() => handlePressOut(scaleReport)}
          onPress={() => navigation.navigate('Report')}
          accessibilityRole="button"
          accessibilityLabel="Reportar Evento"
        >
          <Animated.View style={[styles.btnAnimated, { transform: [{ scale: scaleReport }] }]}>
            <LinearGradient
              colors={[Colors.primary, '#19c4b1']}
              style={styles.gradientBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.btnText}>📤 Reportar Evento</Text>
            </LinearGradient>
          </Animated.View>
        </TouchableWithoutFeedback>

        {/* Botão Outline com animação */}
        <TouchableWithoutFeedback
          onPressIn={() => handlePressIn(scaleAlerts)}
          onPressOut={() => handlePressOut(scaleAlerts)}
          onPress={() => navigation.navigate('Alerts')}
          accessibilityRole="button"
          accessibilityLabel="Ver Alertas"
        >
          <Animated.View style={[styles.btnAnimated, styles.btnOutline, { transform: [{ scale: scaleAlerts }] }]}>
            <Text style={styles.btnTextAlt}>🔔 Ver Alertas</Text>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>

      <TouchableWithoutFeedback
        onPress={handleLogout}
        accessibilityRole="button"
        accessibilityLabel="Sair do aplicativo"
      >
        <View style={styles.logoutBtn}>
          <Text style={styles.logoutText}>🚪 Sair</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: Spacing(6),
    paddingTop: Spacing(10),
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
  },
  title: {
    ...Typography.h1,
    fontSize: 28,
    marginBottom: Spacing(2),
    textAlign: 'center',
  },
  titleHighlight: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 32,
  },
  subtitle: {
    ...Typography.body,
    marginBottom: Spacing(6),
    textAlign: 'center',
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  buttonsGroup: {
    gap: Spacing(2),
    marginBottom: Spacing(2),
  },
  btnAnimated: {
    marginBottom: Spacing(2),
    borderRadius: 14,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  gradientBtn: {
    paddingVertical: Spacing(3),
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  btnOutline: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing(3),
    borderRadius: 14,
  },
  btnTextAlt: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  logoutBtn: {
    marginTop: Spacing(8),
    alignItems: 'center',
  },
  logoutText: {
    color: Colors.error,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
