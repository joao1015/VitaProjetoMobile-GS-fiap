// src/utils/storage.ts
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

export const save = (k: string, v: string) =>
  isWeb ? localStorage.setItem(k, v) : SecureStore.setItemAsync(k, v);

export const load = (k: string) =>
  isWeb ? Promise.resolve(localStorage.getItem(k)) : SecureStore.getItemAsync(k);

export const remove = (k: string) =>
  isWeb ? localStorage.removeItem(k) : SecureStore.deleteItemAsync(k);
