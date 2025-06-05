
import axios from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Detecta automaticamente o IP base dependendo do ambiente
const baseURL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:5055/api' // Emulador Android
    : 'http://172.20.10.13:5055/api'; // Celular físico ou Web (substitua pelo IP da sua máquina)

// Criação do cliente Axios
export const api = axios.create({ baseURL });

// Interceptador que adiciona token JWT ao header Authorization
api.interceptors.request.use(async (cfg) => {
  let token: string | null = null;

  try {
    if (Platform.OS === 'web') {
      token = localStorage.getItem('token');
    } else {
      token = await SecureStore.getItemAsync('token');
    }

    if (token) {
      cfg.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn('⚠️ Erro ao recuperar token:', err);
  }

  return cfg;
});

// Tipagem de um relatório
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

// Obtém todos os relatos (protegido por token)
export const getReports = async (): Promise<Report[]> => {
  const { data } = await api.get<Report[]>('/Reports');
  return data;
};

// Obtém relatos apenas do usuário logado
export const getUserReports = async (): Promise<Report[]> => {
  const { data } = await api.get<Report[]>('/Reports/me');
  return data;
};

// Cria um novo relato (userId e address definidos no backend)
export const postReport = async (
  report: Omit<Report, 'id' | 'userId' | 'address'>
): Promise<Report> => {
  const { data } = await api.post<Report>('/Reports', report);
  return data;
};

// Remove um relato pelo ID
export const deleteReport = async (id: number): Promise<void> => {
  await api.delete(`/Reports/${id}`);
};

// Atualiza um relato parcialmente
export const updateReport = async (
  id: number,
  updated: Partial<Report>
): Promise<Report> => {
  const { data } = await api.put<Report>(`/Reports/${id}`, updated);
  return data;
};
