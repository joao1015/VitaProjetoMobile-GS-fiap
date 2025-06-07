// src/navigation/MainStack.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Ícones
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Telas
import HomeScreen from '../telas/HomeScreen';
import ReportScreen from '../telas/ReportScreen';
import AlertsScreen from '../telas/AlertsScreen';
import UserReportsScreen from '../telas/UserReportsScreen';
import MapNearbyScreen from '../telas/MapNearbyScreen';
import EditReportScreen from '../telas/EditReportScreen';

// Tipos
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
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0088cc',   // Altere para sua cor primária
        tabBarInactiveTintColor: '#ccc',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Report"
        component={ReportScreen}
        options={{
          title: 'Reportar',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="alert-plus" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          title: 'Alertas',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="alert-circle-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="MeusRelatos"
        component={UserReportsScreen}
        options={{
          title: 'Meus Relatos',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="format-list-bulleted" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="MapaProximidade"
        component={MapNearbyScreen}
        options={{
          title: 'Eventos Próximos',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map-marker-radius-outline" color={color} size={size} />
          ),
        }}
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
