import { render } from '@testing-library/react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { describe, expect, it } from 'vitest'
import { createAppTheme } from './createAppTheme'

function parseColor(color: string) {
  const hex = color.match(/^#([0-9a-f]{6})$/i)
  if (hex) {
    const h = hex[1]
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
      a: 1,
    }
  }
  const rgba = color.match(/rgba?\(([^)]+)\)/)
  if (!rgba) throw new Error(`unsupported color: ${color}`)
  const [r, g, b, a = '1'] = rgba[1].split(',').map((value) => value.trim())
  return { r: Number(r), g: Number(g), b: Number(b), a: Number(a) }
}

function luminance(color: string) {
  const { r, g, b } = parseColor(color)
  const channel = (value: number) => {
    const c = value / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

function contrastRatio(foreground: string, background: string) {
  const fg = parseColor(foreground)
  const bg = parseColor(background)
  const blended = {
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  }
  const fgLum = luminance(`rgba(${blended.r}, ${blended.g}, ${blended.b}, 1)`)
  const bgLum = luminance(background)
  const [high, low] = fgLum > bgLum ? [fgLum, bgLum] : [bgLum, fgLum]
  return (high + 0.05) / (low + 0.05)
}

describe('createAppTheme', () => {
  it('builds light and dark schemes from tokens', () => {
    const theme = createAppTheme()
    expect(theme.colorSchemes.light?.palette.primary.main).toBe('#d58e62')
    expect(theme.colorSchemes.dark?.palette.background.default).toBe('#282320')
  })

  it('keeps secondary text readable on both paper surfaces', () => {
    const theme = createAppTheme()
    for (const mode of ['light', 'dark'] as const) {
      const palette = theme.colorSchemes[mode]?.palette
      expect(
        contrastRatio(palette!.text.secondary, palette!.background.paper),
      ).toBeGreaterThanOrEqual(4.5)
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
