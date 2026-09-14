import { describe, expect, it } from 'vitest'

const sourceFiles = import.meta.glob('../**/*.{ts,tsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const COLOR_LITERAL = /(['"`])#[0-9a-f]{3,8}\1|\b(?:rgb|rgba|hsl|hsla|oklch|oklab)\(/i

describe('uso do tema', () => {
  it('não usa cores hardcoded fora de src/theme', () => {
    const offenders = Object.entries(sourceFiles)
      .filter(
        ([path]) =>
          path.startsWith('../') &&
          !path.startsWith('../theme/') &&
          !path.startsWith('../test/') &&
          !path.includes('.test.'),
      )
      .filter(([, content]) => COLOR_LITERAL.test(content))
      .map(([path]) => path)

    expect(offenders).toEqual([])
  })
})
