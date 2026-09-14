import { describe, expect, it } from 'vitest'
import { createBatchFromRecipe, sampleRecipe } from './index'

describe('createBatchFromRecipe', () => {
  it('cria um lote idle com uma etapa pendente por etapa da receita', () => {
    const batch = createBatchFromRecipe(sampleRecipe, { id: 'lote-teste', label: 'Lote #0042' })

    expect(batch.id).toBe('lote-teste')
    expect(batch.label).toBe('Lote #0042')
    expect(batch.recipeId).toBe(sampleRecipe.id)
    expect(batch.status).toBe('idle')
    expect(batch.currentStepId).toBeNull()
    expect(batch.auditTrail).toEqual([])
    expect(Object.keys(batch.steps)).toHaveLength(sampleRecipe.steps.length)

    for (const step of sampleRecipe.steps) {
      expect(batch.steps[step.id]).toEqual({ stepId: step.id, status: 'pending', values: {} })
    }
  })

  it('gera id e rótulo padrão quando não informados', () => {
    const batch = createBatchFromRecipe(sampleRecipe)

    expect(batch.id).toMatch(/^lote-/)
    expect(batch.label).toBe('Lote #0001')
    expect(Number.isNaN(Date.parse(batch.createdAt))).toBe(false)
  })
})
