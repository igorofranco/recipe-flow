import { alpha, createTheme } from '@mui/material/styles'
import type { PaletteColor, PaletteColorOptions } from '@mui/material/styles'
import { fontFamily, radius, tokensByMode } from './tokens'
import type { DesignTokens, ThemeMode } from './tokens'

declare module '@mui/material/styles' {
  interface CssThemeVariables {
    enabled: true
  }

  interface Palette {
    accent: PaletteColor
    neutral: PaletteColor
    base: {
      100: string
      200: string
      300: string
      content: string
    }
  }

  interface PaletteOptions {
    accent?: PaletteColorOptions
    neutral?: PaletteColorOptions
    base?: {
      100: string
      200: string
      300: string
      content: string
    }
  }

  interface Theme {
    radius: typeof radius
  }

  interface ThemeOptions {
    radius?: typeof radius
  }
}

function buildPalette(tokens: DesignTokens, mode: ThemeMode) {
  return {
    mode,
    primary: { main: tokens.primary, contrastText: tokens.primaryContent },
    secondary: { main: tokens.secondary, contrastText: tokens.secondaryContent },
    info: { main: tokens.info, contrastText: tokens.infoContent },
    success: { main: tokens.success, contrastText: tokens.successContent },
    warning: { main: tokens.warning, contrastText: tokens.warningContent },
    error: { main: tokens.error, contrastText: tokens.errorContent },
    accent: { main: tokens.accent, contrastText: tokens.accentContent },
    neutral: { main: tokens.neutral, contrastText: tokens.neutralContent },
    base: {
      100: tokens.base100,
      200: tokens.base200,
      300: tokens.base300,
      content: tokens.baseContent,
    },
    background: { default: tokens.base200, paper: tokens.base100 },
    text: {
      primary: tokens.baseContent,
      secondary: alpha(tokens.baseContent, mode === 'dark' ? 0.72 : 0.65),
    },
    divider: tokens.base300,
  }
}

export function createAppTheme() {
  return createTheme({
    cssVariables: { colorSchemeSelector: 'data' },
    colorSchemes: {
      light: { palette: buildPalette(tokensByMode.light, 'light') },
      dark: { palette: buildPalette(tokensByMode.dark, 'dark') },
    },
    shape: { borderRadius: 8 },
    radius,
    typography: {
      fontFamily,
      fontSize: 14,
      fontWeightMedium: 600,
      button: { textTransform: 'none', fontWeight: 600 },
    },
  })
}

export type AppTheme = ReturnType<typeof createAppTheme>
