// App.tsx

import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, AuthContext } from './src/contexts/AuthContext';
import AuthStack from './src/navegação/AuthStack';
import MainStack from './src/navegação/MainStack';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

function RootNavigator() {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <AuthStack />;
  }
  return <MainStack />;
}
