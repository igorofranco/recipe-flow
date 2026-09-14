import { describe, expect, it } from 'vitest'
import { accessibleContrastText, contrastRatio, parseColor, relativeLuminance } from './contrast'

describe('parseColor', () => {
  it('interpreta hex de 6 dígitos', () => {
    expect(parseColor('#fbf5f2')).toEqual({ r: 251, g: 245, b: 242, a: 1 })
  })

  it('expande hex de 3 dígitos', () => {
    expect(parseColor('#abc')).toEqual({ r: 170, g: 187, b: 204, a: 1 })
  })

  it('interpreta hex de 8 dígitos com alfa', () => {
    const color = parseColor('#00000080')

    expect(color.r).toBe(0)
    expect(color.b).toBe(0)
    expect(color.a).toBeCloseTo(0.5, 1)
  })

  it('interpreta rgb e rgba', () => {
    expect(parseColor('rgb(10, 20, 30)')).toEqual({ r: 10, g: 20, b: 30, a: 1 })
    expect(parseColor('rgba(10, 20, 30, 0.5)')).toEqual({ r: 10, g: 20, b: 30, a: 0.5 })
  })

  it('rejeita formatos não suportados', () => {
    expect(() => parseColor('hsl(0, 0%, 0%)')).toThrow('unsupported color')
  })
})

describe('relativeLuminance', () => {
  it('vai de 0 no preto a 1 no branco', () => {
    expect(relativeLuminance('#000000')).toBe(0)
    expect(relativeLuminance('#ffffff')).toBeCloseTo(1, 5)
  })

  it('usa o ramo linear para canais escuros', () => {
    expect(relativeLuminance('#0a0a0a')).toBeLessThan(0.01)
  })
})

describe('contrastRatio', () => {
  it('retorna o contraste máximo entre preto e branco', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0)
  })

  it('considera o alfa da cor de frente', () => {
    const solid = contrastRatio('#000000', '#ffffff')
    const translucent = contrastRatio('rgba(0, 0, 0, 0.5)', '#ffffff')

    expect(translucent).toBeLessThan(solid)
  })
})

describe('accessibleContrastText', () => {
  it('escolhe o texto de maior contraste', () => {
    expect(accessibleContrastText('#ffffff', ['#eeeeee', '#111111'])).toBe('#111111')
    expect(accessibleContrastText('#000000', ['#222222', '#fafafa'])).toBe('#fafafa')
  })
})
