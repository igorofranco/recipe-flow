export type ThemeMode = 'light' | 'dark'

export interface OklchColor {
  lightness: number
  chroma: number
  hue: number
}

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

const primaryHue = 52

const sharedOklch = {
  primary: { lightness: 0.71, chroma: 0.105, hue: primaryHue },
  info: { lightness: 0.6157, chroma: 0.076, hue: 218.8 },
  success: { lightness: 0.7, chroma: 0.22628, hue: 142 },
  warning: { lightness: 0.75, chroma: 0.19, hue: 100 },
} satisfies Record<string, OklchColor>

const lightOklch: Record<keyof DesignTokens, OklchColor> = {
  base100: { lightness: 0.9748, chroma: 0.007, hue: primaryHue },
  base200: { lightness: 0.9442, chroma: 0.009, hue: primaryHue },
  base300: { lightness: 0.8923, chroma: 0.011, hue: primaryHue },
  baseContent: { lightness: 0.2178, chroma: 0, hue: 0 },
  primary: sharedOklch.primary,
  primaryContent: { lightness: 1, chroma: 0, hue: 0 },
  secondary: { lightness: 0.8289, chroma: 0.044, hue: primaryHue },
  secondaryContent: { lightness: 0.2178, chroma: 0, hue: 0 },
  accent: { lightness: 0.45, chroma: 0.09, hue: primaryHue },
  accentContent: { lightness: 1, chroma: 0, hue: 0 },
  neutral: { lightness: 0.36, chroma: 0, hue: 0 },
  neutralContent: { lightness: 0.9688, chroma: 0.007, hue: 106.52 },
  info: sharedOklch.info,
  infoContent: { lightness: 1, chroma: 0, hue: 0 },
  success: sharedOklch.success,
  successContent: { lightness: 1, chroma: 0, hue: 0 },
  warning: sharedOklch.warning,
  warningContent: { lightness: 1, chroma: 0, hue: 0 },
  error: { lightness: 0.5855, chroma: 0.193, hue: 19.82 },
  errorContent: { lightness: 1, chroma: 0, hue: 0 },
}

const darkOklch: Record<keyof DesignTokens, OklchColor> = {
  base100: { lightness: 0.3, chroma: 0.012, hue: primaryHue },
  base200: { lightness: 0.26, chroma: 0.01, hue: primaryHue },
  base300: { lightness: 0.23, chroma: 0.008, hue: primaryHue },
  baseContent: { lightness: 0.92, chroma: 0.007, hue: primaryHue },
  primary: sharedOklch.primary,
  primaryContent: { lightness: 0.15, chroma: 0.01, hue: primaryHue },
  secondary: { lightness: 0.45, chroma: 0.04, hue: primaryHue },
  secondaryContent: { lightness: 0.92, chroma: 0.007, hue: primaryHue },
  accent: { lightness: 0.78, chroma: 0.07, hue: primaryHue },
  accentContent: { lightness: 0.15, chroma: 0.01, hue: primaryHue },
  neutral: { lightness: 0.36, chroma: 0.008, hue: primaryHue },
  neutralContent: { lightness: 0.9, chroma: 0.007, hue: primaryHue },
  info: sharedOklch.info,
  infoContent: { lightness: 0.15, chroma: 0.01, hue: primaryHue },
  success: sharedOklch.success,
  successContent: { lightness: 0.15, chroma: 0.01, hue: primaryHue },
  warning: sharedOklch.warning,
  warningContent: { lightness: 0.15, chroma: 0.01, hue: primaryHue },
  error: { lightness: 0.62, chroma: 0.193, hue: 19.82 },
  errorContent: { lightness: 0.15, chroma: 0.01, hue: primaryHue },
}

function channelToHex(channel: number) {
  const encoded = channel <= 0.0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055
  const value = Math.round(Math.min(1, Math.max(0, encoded)) * 255)
  return value.toString(16).padStart(2, '0')
}

export function oklchToHex({ lightness, chroma, hue }: OklchColor): string {
  const radians = (hue * Math.PI) / 180
  const a = chroma * Math.cos(radians)
  const b = chroma * Math.sin(radians)
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3
  const red = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const green = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const blue = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
  return `#${[red, green, blue].map(channelToHex).join('')}`
}

function resolveTokens(oklch: Record<keyof DesignTokens, OklchColor>): DesignTokens {
  const tokens = {} as DesignTokens
  for (const key of Object.keys(oklch) as (keyof DesignTokens)[]) {
    tokens[key] = oklchToHex(oklch[key])
  }
  return tokens
}

export const designSystemByMode: Record<ThemeMode, DesignTokens> = {
  light: resolveTokens(lightOklch),
  dark: resolveTokens(darkOklch),
}
