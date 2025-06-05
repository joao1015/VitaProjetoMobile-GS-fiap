// src/services/auth.ts

import { api } from './api';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export interface AuthResponse {
  token: string;
}

export async function register(email: string, password: string): Promise<string> {
  try {
    const response = await api.post<AuthResponse>('/Auth/register', {
      email,
      password,
    });

    const token = response.data.token;
    if (typeof token !== 'string' || !token.trim()) {
      throw new Error('Token inválido');
    }

    if (Platform.OS === 'web') {
      localStorage.setItem('token', token);
    } else {
      await SecureStore.setItemAsync('token', token);
    }

    return token;
  } catch (err: any) {
    console.error('❌ Erro no registro:', err.message);
    if (err.response?.data) {
      console.log('🧾 Erro da API:', err.response.data);
      throw new Error(err.response.data[0]?.description || 'Erro no registro');
    }
    throw new Error('Erro ao registrar. Tente novamente.');
  }
}

export async function login(email: string, password: string): Promise<string> {
  try {
    const response = await api.post<AuthResponse>('/Auth/login', {
      email,
      password,
    });

    const token = response.data.token;
    if (typeof token !== 'string' || !token.trim()) {
      throw new Error('Token inválido');
    }

    if (Platform.OS === 'web') {
      localStorage.setItem('token', token);
    } else {
      await SecureStore.setItemAsync('token', token);
    }

    return token;
  } catch (err: any) {
    console.error('❌ Erro no login:', err.message);
    if (err.response?.data) {
      console.log('🧾 Erro da API:', err.response.data);
      throw new Error(err.response.data?.title || 'Credenciais inválidas');
    }
    throw new Error('Erro de rede ou servidor.');
  }
}

export async function logout(): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem('token');
  } else {
    await SecureStore.deleteItemAsync('token');
  }
}
