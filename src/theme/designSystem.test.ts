import { describe, expect, it } from 'vitest'
import { designSystemByMode, oklchToHex } from './designSystem'
import type { DesignTokens } from './designSystem'

const lightExpected: DesignTokens = {
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

const darkExpected: DesignTokens = {
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

describe('designSystem (mapeamento de @cambiata/ui)', () => {
  it('converte a cor primária compartilhada para o hex da marca', () => {
    expect(oklchToHex({ lightness: 0.71, chroma: 0.105, hue: 52 })).toBe('#d58e62')
  })

  it('mapeia os tokens do tema claro', () => {
    expect(designSystemByMode.light).toEqual(lightExpected)
  })

  it('mapeia os tokens do tema escuro', () => {
    expect(designSystemByMode.dark).toEqual(darkExpected)
  })
})
