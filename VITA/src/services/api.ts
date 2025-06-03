// src/services/api.ts

import axios from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const devApi =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:5055/api'   // Android → redireciona para localhost:5055
    : 'http://localhost:5055/api'; // iOS Simulator ou Web → usa HTTP localhost:5055

export const api = axios.create({ baseURL: devApi });

api.interceptors.request.use(async (cfg) => {
  let tk: string | null = null;
  if (Platform.OS === 'web') {
    tk = localStorage.getItem('token');
  } else {
    tk = await SecureStore.getItemAsync('token');
  }
  if (tk) {
    cfg.headers.Authorization = `Bearer ${tk}`;
  }
  return cfg;
});

export interface Report {
  id?: number;
  userId: string;
  type: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  date: string;
}

// Retorna todos os relatórios (é protegido: precisa de token)
export const getReports = async (): Promise<Report[]> => {
  const { data } = await api.get<Report[]>('/Reports');
  return data;
};

// → Retorna apenas os relatórios do usuário logado via GET /api/Reports/me
export const getUserReports = async (): Promise<Report[]> => {
  const { data } = await api.get<Report[]>('/Reports/me');
  return data;
};

export const postReport = async (
  report: Omit<Report, 'id' | 'userId' | 'address'>
): Promise<Report> => {
  const { data } = await api.post<Report>('/Reports', report);
  return data;
};

export const deleteReport = async (id: number) => {
  await api.delete(`/Reports/${id}`);
};

export const updateReport = async (
  id: number,
  updated: Partial<Report>
): Promise<Report> => {
  const { data } = await api.put<Report>(`/Reports/${id}`, updated);
  return data;
};
