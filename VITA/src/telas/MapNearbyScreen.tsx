// src/screens/MapNearbyScreen.tsx

import { Platform } from 'react-native';

let MapNearbyScreen: React.ComponentType<any>;

if (Platform.OS === 'web') {
  // Quando for web, use a variante “.web.tsx”
  MapNearbyScreen = require('./MapNearbyScreen.web').default;
} else {
  // Quando for mobile (Android ou iOS), use a variante “.native.tsx”
  MapNearbyScreen = require('./MapNearbyScreen.web').default;
}

export default MapNearbyScreen;
