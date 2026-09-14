export interface Rgba {
  r: number
  g: number
  b: number
  a: number
}

export function parseColor(color: string): Rgba {
  const hex = color.trim().match(/^#([0-9a-f]{3,8})$/i)
  if (hex) {
    const value =
      hex[1].length <= 4
        ? hex[1]
            .split('')
            .map((char) => char + char)
            .join('')
        : hex[1]
    return {
      r: parseInt(value.slice(0, 2), 16),
      g: parseInt(value.slice(2, 4), 16),
      b: parseInt(value.slice(4, 6), 16),
      a: value.length === 8 ? parseInt(value.slice(6, 8), 16) / 255 : 1,
    }
  }

  const rgb = color.match(/^rgba?\(([^)]+)\)$/)
  if (!rgb) throw new Error(`unsupported color: ${color}`)
  const [r, g, b, a = '1'] = rgb[1].split(',').map((channel) => channel.trim())
  return { r: Number(r), g: Number(g), b: Number(b), a: Number(a) }
}

export function relativeLuminance(color: string): number {
  const { r, g, b } = parseColor(color)
  const channel = (value: number) => {
    const normalized = value / 255
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

export function contrastRatio(foreground: string, background: string): number {
  const fg = parseColor(foreground)
  const bg = parseColor(background)
  const blended = {
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
  }
  const fgLuminance = relativeLuminance(`rgb(${blended.r}, ${blended.g}, ${blended.b})`)
  const bgLuminance = relativeLuminance(background)
  const [high, low] =
    fgLuminance > bgLuminance ? [fgLuminance, bgLuminance] : [bgLuminance, fgLuminance]
  return (high + 0.05) / (low + 0.05)
}

export function accessibleContrastText(background: string, candidates: string[]): string {
  return candidates.reduce((best, candidate) =>
    contrastRatio(candidate, background) > contrastRatio(best, background) ? candidate : best,
  )
}
