import { alpha, createTheme } from '@mui/material/styles'
import type { PaletteColor, PaletteColorOptions } from '@mui/material/styles'
import { accessibleContrastText } from './contrast'
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
  const contrast = (main: string, content: string) =>
    accessibleContrastText(main, [content, tokens.baseContent])

  return {
    mode,
    primary: {
      main: tokens.primary,
      contrastText: contrast(tokens.primary, tokens.primaryContent),
    },
    secondary: {
      main: tokens.secondary,
      contrastText: contrast(tokens.secondary, tokens.secondaryContent),
    },
    info: { main: tokens.info, contrastText: contrast(tokens.info, tokens.infoContent) },
    success: {
      main: tokens.success,
      contrastText: contrast(tokens.success, tokens.successContent),
    },
    warning: {
      main: tokens.warning,
      contrastText: contrast(tokens.warning, tokens.warningContent),
    },
    error: { main: tokens.error, contrastText: contrast(tokens.error, tokens.errorContent) },
    accent: { main: tokens.accent, contrastText: contrast(tokens.accent, tokens.accentContent) },
    neutral: {
      main: tokens.neutral,
      contrastText: contrast(tokens.neutral, tokens.neutralContent),
    },
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
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: { root: { minHeight: 40, borderRadius: radius.field } },
      },
      MuiCard: {
        styleOverrides: { root: { borderRadius: radius.box } },
      },
      MuiChip: {
        styleOverrides: { root: { borderRadius: radius.selector } },
      },
      MuiOutlinedInput: {
        styleOverrides: { root: { borderRadius: radius.field } },
      },
    },
  })
}

export type AppTheme = ReturnType<typeof createAppTheme>
