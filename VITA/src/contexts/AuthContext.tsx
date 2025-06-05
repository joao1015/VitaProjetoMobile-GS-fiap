import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  logoutUser: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  logoutUser: () => {},
});

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [token, setTokenState] = useState<string | null>(null);

  // 🔐 Carregar token salvo
  useEffect(() => {
    const loadToken = async () => {
      const storedToken = Platform.OS === 'web'
        ? localStorage.getItem('token')
        : await SecureStore.getItemAsync('token');
      console.log('🔍 AuthProvider: token lido do storage =', storedToken);
      if (storedToken) {
        setTokenState(storedToken);
      }
    };
    loadToken();
  }, []);

  // 🔐 Salvar token no storage
  const setToken = async (newToken: string | null) => {
    console.log('✏️ AuthProvider: setToken chamado com =', newToken);

    setTokenState(newToken);

    if (!newToken) {
      if (Platform.OS === 'web') {
        localStorage.removeItem('token');
      } else {
        await SecureStore.deleteItemAsync('token');
      }
      return;
    }

    if (Platform.OS === 'web') {
      localStorage.setItem('token', newToken);
    } else {
      await SecureStore.setItemAsync('token', newToken);
    }
  };

  // 🔓 Logout
  const logoutUser = async () => {
    console.log('🚪 Logout executado');
    await setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
