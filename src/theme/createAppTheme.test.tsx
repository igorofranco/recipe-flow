import { render } from '@testing-library/react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { describe, expect, it } from 'vitest'
import { createAppTheme } from './createAppTheme'
import { contrastRatio } from './contrast'

const modes = ['light', 'dark'] as const
const semanticColors = ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const

describe('createAppTheme', () => {
  it('builds light and dark schemes from tokens', () => {
    const theme = createAppTheme()
    expect(theme.colorSchemes.light?.palette.primary.main).toBe('#d58e62')
    expect(theme.colorSchemes.dark?.palette.background.default).toBe('#282320')
  })

  it('keeps secondary text readable on both paper surfaces', () => {
    const theme = createAppTheme()
    for (const mode of modes) {
      const palette = theme.colorSchemes[mode]?.palette
      expect(
        contrastRatio(palette!.text.secondary, palette!.background.paper),
      ).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('keeps semantic content readable on its background (WCAG AA)', () => {
    const theme = createAppTheme()
    for (const mode of modes) {
      const palette = theme.colorSchemes[mode]?.palette
      for (const color of semanticColors) {
        const swatch = palette![color]
        expect(contrastRatio(swatch.contrastText, swatch.main)).toBeGreaterThanOrEqual(4.5)
      }
    }
  })

  it('keeps text readable on every base surface', () => {
    const theme = createAppTheme()
    for (const mode of modes) {
      const palette = theme.colorSchemes[mode]?.palette
      const surfaces = [palette!.background.paper, palette!.background.default, palette!.base[300]]
      for (const surface of surfaces) {
        expect(contrastRatio(palette!.text.primary, surface)).toBeGreaterThanOrEqual(4.5)
      }
    }
  })

  it('renders with MUI components', () => {
    const theme = createAppTheme()
    const { container } = render(
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
      </ThemeProvider>,
    )
    expect(container).toBeTruthy()
  })
})
