// src/screens/UserReportsScreen.tsx

import React, { useContext, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getUserReports, deleteReport, Report } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { Colors, Spacing, Typography } from '../styles/theme';

export default function UserReportsScreen({ navigation }: any) {
  const { token } = useContext(AuthContext);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  // Busca GET /api/Reports/me
  const fetchMyReports = async () => {
    setLoading(true);
    try {
      const data = await getUserReports();
      setReports(data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        Alert.alert('Não autorizado', 'Faça login novamente.');
      } else {
        Alert.alert('Erro', 'Falha ao carregar seus relatos.');
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (token) {
        fetchMyReports();
      } else {
        setLoading(false);
      }
    }, [token])
  );

  const handleDelete = (id: number) => {
    Alert.alert(
      'Confirmar exclusão',
      'Deseja realmente excluir este relato?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReport(id);
              fetchMyReports(); // Recarrega após excluir
            } catch {
              Alert.alert('Erro', 'Falha ao excluir relato.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {reports.length === 0 ? (
        <Text style={styles.empty}>Você ainda não enviou nenhum relato.</Text>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.info}>
                <Text style={styles.cardTitle}>{item.type}</Text>
                <Text style={styles.cardDesc}>{item.description}</Text>
                <Text style={styles.cardMeta}>
                  📍 {item.address || 'Endereço não informado'}{'\n'}
                  📅 {new Date(item.date).toLocaleString('pt-BR')}
                </Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => navigation.navigate('EditarRelato', { report: item })}
                >
                  <Text style={styles.editText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(item.id!)}
                >
                  <Text style={styles.deleteText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing(4),
    backgroundColor: Colors.surface,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  card: {
    backgroundColor: Colors.surfaceAlt,
    padding: Spacing(4),
    borderRadius: 8,
    marginBottom: Spacing(3),
    flexDirection: 'column',
  },
  info: {
    marginBottom: Spacing(2),
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: Colors.primaryDark,
    marginBottom: Spacing(1),
  },
  cardDesc: {
    ...Typography.body,
    marginBottom: Spacing(1),
  },
  cardMeta: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editBtn: {
    marginRight: Spacing(3),
  },
  editText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  deleteBtn: {},
  deleteText: {
    color: Colors.error,
    fontWeight: '600',
  },
  empty: {
    ...Typography.caption,
    textAlign: 'center',
    marginTop: Spacing(6),
    color: Colors.textSecondary,
  },
});
