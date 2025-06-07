

export const Colors = {
  primary: '#007bff',
  primaryLight: '#66b2ff',
  primaryDark: '#0056b3',
  surface: '#ffffff',
  surfaceAlt: '#f2f2f2',
  textPrimary: '#000000',
  textSecondary: '#666666',
  success: '#28a745',
  error: '#dc3545',
};


export const Spacing = (mult = 1) => mult * 4; // Spacing(4) = 16px

export const Typography = {
  h1:     { fontSize: 24, fontWeight: '600' as const, color: Colors.textPrimary },
  h2:     { fontSize: 24, fontWeight: '600' as const, color: Colors.textPrimary },
  body:   { fontSize: 16, fontWeight: '400' as const, color: Colors.textPrimary },
  caption:{ fontSize: 12, fontWeight: '400' as const, color: Colors.textSecondary },
};
