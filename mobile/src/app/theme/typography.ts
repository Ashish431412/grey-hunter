/**
 * Typography scale and definitions for the app
 */
export const typography = {
  fontFamily: {
    regular: 'System', // Ideally configure a monospace or tech font (e.g., FiraCode, Roboto Mono)
    medium: 'System',
    bold: 'System',
    mono: 'monospace',
  },
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 42,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    bold: '700' as const,
  },
};
