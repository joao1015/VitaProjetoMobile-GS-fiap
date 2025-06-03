// src/services/auth.ts

import { api } from './api';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export interface AuthResponse {
  token: string;
}

// → Cadastro: POST https://localhost:7290/api/Auth/register
export async function register(email: string, password: string): Promise<string> {
  const response = await api.post<AuthResponse>('/Auth/register', {
    email,
    password,
  });
  const token = response.data.token;

  // Salva o token no storage correto (web ou mobile)
  if (Platform.OS === 'web') {
    localStorage.setItem('token', token);
  } else {
    await SecureStore.setItemAsync('token', token);
  }

  return token;
}

// → Login: POST https://localhost:7290/api/Auth/login
export async function login(email: string, password: string): Promise<string> {
  const response = await api.post<AuthResponse>('/Auth/login', {
    email,
    password,
  });
  const token = response.data.token;

  if (Platform.OS === 'web') {
    localStorage.setItem('token', token);
  } else {
    await SecureStore.setItemAsync('token', token);
  }

  return token;
}

// → Logout: remove token do storage
export async function logout(): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem('token');
  } else {
    await SecureStore.deleteItemAsync('token');
  }
}
