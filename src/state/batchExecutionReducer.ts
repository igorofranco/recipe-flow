import { createBatchFromRecipe, getOrderedSteps } from '../domain'
import type { Batch, CreateBatchOptions, Recipe } from '../domain'

export type BatchExecutionAction =
  | { type: 'started' }
  | { type: 'paused' }
  | { type: 'finished' }
  | { type: 'stepSelected'; stepId: string }

export interface BatchExecutionState {
  recipe: Recipe
  batch: Batch
}

export function createInitialBatchExecutionState(
  recipe: Recipe,
  options?: CreateBatchOptions,
): BatchExecutionState {
  return { recipe, batch: createBatchFromRecipe(recipe, options) }
}

export function batchExecutionReducer(
  state: BatchExecutionState,
  action: BatchExecutionAction,
): BatchExecutionState {
  const { batch } = state

  switch (action.type) {
    case 'started': {
      if (batch.status === 'running' || batch.status === 'done') {
        return state
      }

      const firstStepId = getOrderedSteps(state.recipe)[0]?.id ?? null

      return {
        ...state,
        batch: {
          ...batch,
          status: 'running',
          currentStepId: batch.currentStepId ?? firstStepId,
        },
      }
    }

    case 'paused': {
      if (batch.status !== 'running') {
        return state
      }

      return { ...state, batch: { ...batch, status: 'paused' } }
    }

    case 'finished': {
      if (batch.status === 'idle' || batch.status === 'done') {
        return state
      }

      return { ...state, batch: { ...batch, status: 'done', currentStepId: null } }
    }

    case 'stepSelected': {
      if (!(action.stepId in batch.steps)) {
        return state
      }

      return { ...state, batch: { ...batch, currentStepId: action.stepId } }
    }
  }
}
