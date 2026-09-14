import { designSystemByMode } from './designSystem'
import type { DesignTokens, ThemeMode } from './designSystem'

export type { DesignTokens, ThemeMode }

export const lightTokens = designSystemByMode.light
export const darkTokens = designSystemByMode.dark

export const tokensByMode: Record<ThemeMode, DesignTokens> = designSystemByMode

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
