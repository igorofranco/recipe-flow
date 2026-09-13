export type ThemeMode = 'light' | 'dark'

export interface DesignTokens {
  base100: string
  base200: string
  base300: string
  baseContent: string
  primary: string
  primaryContent: string
  secondary: string
  secondaryContent: string
  accent: string
  accentContent: string
  neutral: string
  neutralContent: string
  info: string
  infoContent: string
  success: string
  successContent: string
  warning: string
  warningContent: string
  error: string
  errorContent: string
}

export const lightTokens: DesignTokens = {
  base100: '#fbf5f2',
  base200: '#f2ebe7',
  base300: '#e2dad5',
  baseContent: '#1a1a1a',
  primary: '#d58e62',
  primaryContent: '#ffffff',
  secondary: '#dfc0ad',
  secondaryContent: '#1a1a1a',
  accent: '#7c4521',
  accentContent: '#ffffff',
  neutral: '#3d3d3d',
  neutralContent: '#f5f5f0',
  info: '#4a90a4',
  infoContent: '#ffffff',
  success: '#28be1a',
  successContent: '#ffffff',
  warning: '#cbae00',
  warningContent: '#ffffff',
  error: '#d6394a',
  errorContent: '#ffffff',
}

export const darkTokens: DesignTokens = {
  base100: '#332c28',
  base200: '#282320',
  base300: '#201c1a',
  baseContent: '#e9e3e0',
  primary: '#d58e62',
  primaryContent: '#0f0a08',
  secondary: '#684f41',
  secondaryContent: '#e9e3e0',
  accent: '#dcab8e',
  accentContent: '#0f0a08',
  neutral: '#413c39',
  neutralContent: '#e2ddda',
  info: '#4a90a4',
  infoContent: '#0f0a08',
  success: '#28be1a',
  successContent: '#0f0a08',
  warning: '#cbae00',
  warningContent: '#0f0a08',
  error: '#e34554',
  errorContent: '#0f0a08',
}

export const tokensByMode: Record<ThemeMode, DesignTokens> = {
  light: lightTokens,
  dark: darkTokens,
}

export const fontFamily = [
  'ui-sans-serif',
  'system-ui',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  '"Noto Sans"',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
  '"Noto Color Emoji"',
].join(', ')

export const radius = {
  selector: '1.9rem',
  field: '0.5rem',
  box: '0.5rem',
} as const
