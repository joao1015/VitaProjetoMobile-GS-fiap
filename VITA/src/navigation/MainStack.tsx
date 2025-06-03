// src/navigation/MainStack.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import ReportScreen from '../screens/ReportScreen';
import AlertsScreen from '../screens/AlertsScreen';
import UserReportsScreen from '../screens/UserReportsScreen';
import MapNearbyScreen from '../screens/MapNearbyScreen';
import EditReportScreen from '../screens/EditReportScreen';

import { Report } from '../services/api';

export type MainStackParamList = {
  Tabs: undefined;
  Home: undefined;
  Report: undefined;
  Alerts: undefined;
  MeusRelatos: undefined;
  MapaProximidade: undefined;
  EditarRelato: { report: Report };
};

const Tab = createBottomTabNavigator<MainStackParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
      <Tab.Screen name="Report" component={ReportScreen} options={{ title: 'Reportar' }} />
      <Tab.Screen name="Alerts" component={AlertsScreen} options={{ title: 'Alertas' }} />
      <Tab.Screen
        name="MeusRelatos"
        component={UserReportsScreen}
        options={{ title: 'Meus Relatos' }}
      />
      <Tab.Screen
        name="MapaProximidade"
        component={MapNearbyScreen}
        options={{ title: 'Eventos Próximos' }}
      />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen
        name="EditarRelato"
        component={EditReportScreen}
        options={{
          headerShown: true,
          title: 'Editar Relato',
        }}
      />
    </Stack.Navigator>
  );
}
