import type { Batch, Recipe, RecipeStep, StepRecord } from './types'

function createId(prefix: string): string {
  const unique =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2)
  return `${prefix}-${unique}`
}

export interface CreateBatchOptions {
  id?: string
  label?: string
  createdAt?: string
}

export function getOrderedSteps(recipe: Recipe): RecipeStep[] {
  return [...recipe.steps].sort((a, b) => a.order - b.order)
}

export function getRecipeStep(recipe: Recipe, stepId: string): RecipeStep | undefined {
  return recipe.steps.find((step) => step.id === stepId)
}

export function createBatchFromRecipe(recipe: Recipe, options: CreateBatchOptions = {}): Batch {
  const steps = recipe.steps.reduce<Record<string, StepRecord>>((records, step) => {
    records[step.id] = { stepId: step.id, status: 'pending', values: {} }
    return records
  }, {})

  return {
    id: options.id ?? createId('lote'),
    label: options.label ?? 'Lote #0001',
    recipeId: recipe.id,
    status: 'idle',
    currentStepId: null,
    steps,
    auditTrail: [],
    createdAt: options.createdAt ?? new Date().toISOString(),
  }
}
