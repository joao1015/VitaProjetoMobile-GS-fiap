// src/contexts/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

interface AuthContextData {
  token: string | null;
  setToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextData>({
  token: null,
  setToken: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadToken = async (): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem('token');
    } else {
      return await SecureStore.getItemAsync('token');
    }
  };

  const storeToken = async (newToken: string | null) => {
    if (Platform.OS === 'web') {
      if (newToken) localStorage.setItem('token', newToken);
      else localStorage.removeItem('token');
    } else {
      if (newToken) await SecureStore.setItemAsync('token', newToken);
      else await SecureStore.deleteItemAsync('token');
    }
  };

  useEffect(() => {
    (async () => {
      const stored = await loadToken();
      console.log('🔍 AuthProvider: token lido do storage =', stored);
      if (stored) {
        setTokenState(stored);
      }
      setLoading(false);
    })();
  }, []);

  const setToken = async (newToken: string | null) => {
    console.log('✏️ AuthProvider: setToken chamado com =', newToken);
    await storeToken(newToken);
    setTokenState(newToken);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}
