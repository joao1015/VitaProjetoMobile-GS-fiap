// src/screens/AlertsScreen.tsx

import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
  Linking,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getReports, Report } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { Colors, Spacing, Typography } from '../styles/theme';

const contactList = [
  { label: 'Defesa Civil', phone: '199', site: 'https://www.defesacivil.sp.gov.br/' },
  { label: 'Bombeiros', phone: '193', site: 'https://www.corpodebombeiros.sp.gov.br/' },
  { label: 'Polícia Militar', phone: '190', site: 'https://www.policiamilitar.sp.gov.br/' },
];

export default function AlertsScreen() {
  const { token } = useContext(AuthContext);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar relatórios
  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await getReports();
      setReports(data);
    } catch {
      // Se der 401 ou outro erro, silencia ou avisa
    } finally {
      setLoading(false);
    }
  };

  // useFocusEffect faz com que, sempre que a tela ganhar foco, chamemos fetchReports
  useFocusEffect(
    useCallback(() => {
      if (token) {
        fetchReports();
      } else {
        setLoading(false);
      }
    }, [token])
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🔔 Alertas Recentes</Text>

      {reports.length === 0 ? (
        <Text style={styles.empty}>Nenhum alerta reportado.</Text>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(it) => String(it.id)}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>⚠️ {item.type}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
              <Text style={styles.cardMeta}>
                📍 {item.address || 'Endereço não informado'}{'\n'}
                📅 {new Date(item.date).toLocaleString('pt-BR')}
              </Text>
            </View>
          )}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: Spacing(4) }}
        />
      )}

      <Text style={styles.sectionTitle}>📞 Contatos de Emergência</Text>
      {contactList.map((contact) => (
        <View key={contact.label} style={styles.contactCard}>
          <Text style={styles.contactTitle}>{contact.label}</Text>
          <Text
            style={styles.contactText}
            onPress={() => Linking.openURL(`tel:${contact.phone}`)}
          >
            📞 Telefone: {contact.phone}
          </Text>
          <Text
            style={styles.contactText}
            onPress={() => Linking.openURL(contact.site)}
          >
            🌐 Site: {contact.site.replace('https://', '')}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing(4),
    backgroundColor: Colors.surface,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  title: {
    ...Typography.h1,
    fontSize: 22,
    marginBottom: Spacing(4),
  },
  sectionTitle: {
    ...Typography.h1,
    fontSize: 20,
    marginTop: Spacing(6),
    marginBottom: Spacing(3),
  },
  card: {
    backgroundColor: Colors.surfaceAlt,
    padding: Spacing(4),
    borderRadius: 10,
    marginBottom: Spacing(3),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: Spacing(1),
    color: Colors.primaryDark,
  },
  cardDesc: {
    ...Typography.body,
    marginBottom: Spacing(2),
  },
  cardMeta: {
    ...Typography.caption,
  },
  contactCard: {
    backgroundColor: Colors.surfaceAlt,
    padding: Spacing(3),
    borderRadius: 8,
    marginBottom: Spacing(3),
  },
  contactTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: Spacing(1),
    color: Colors.primary,
  },
  contactText: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: Spacing(1),
    textDecorationLine: 'underline',
  },
  empty: {
    ...Typography.caption,
    textAlign: 'center',
    marginVertical: Spacing(4),
  },
});
