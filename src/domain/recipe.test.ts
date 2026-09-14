import { describe, expect, it } from 'vitest'
import { getOrderedSteps, getRecipeStep, sampleRecipe } from './index'

describe('sampleRecipe', () => {
  it('lista as etapas na ordem de execução', () => {
    expect(getOrderedSteps(sampleRecipe).map((step) => step.id)).toEqual([
      'pesagem',
      'preparo',
      'envase',
      'rotulagem',
      'liberacao',
    ])
  })

  it('mantém ids de etapa únicos e order sequencial', () => {
    const ids = sampleRecipe.steps.map((step) => step.id)

    expect(new Set(ids).size).toBe(ids.length)
    expect(getOrderedSteps(sampleRecipe).map((step) => step.order)).toEqual([1, 2, 3, 4, 5])
  })

  it('dá a cada etapa um campo obrigatório com id único dentro da etapa', () => {
    for (const step of sampleRecipe.steps) {
      const fieldIds = step.requiredFields.map((field) => field.id)

      expect(new Set(fieldIds).size).toBe(fieldIds.length)
      expect(step.requiredFields.some((field) => field.required)).toBe(true)
    }
  })

  it('declara opções em todo campo de seleção', () => {
    const selectFields = sampleRecipe.steps
      .flatMap((step) => step.requiredFields)
      .filter((field) => field.kind === 'select')

    expect(selectFields.length).toBeGreaterThan(0)
    for (const field of selectFields) {
      expect(field.options.length).toBeGreaterThan(0)
    }
  })

  it('encontra etapa por id', () => {
    expect(getRecipeStep(sampleRecipe, 'envase')?.name).toBe('Envase')
    expect(getRecipeStep(sampleRecipe, 'inexistente')).toBeUndefined()
  })
})
