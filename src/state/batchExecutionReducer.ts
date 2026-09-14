import {
  createAuditEvent,
  createBatchFromRecipe,
  getOrderedSteps,
  getRecipeStep,
  validateStepRecord,
} from '../domain'
import type {
  Batch,
  CreateAuditEventInput,
  CreateBatchOptions,
  Recipe,
  RecordValue,
} from '../domain'

export type BatchExecutionAction =
  | { type: 'started' }
  | { type: 'paused' }
  | { type: 'finished' }
  | { type: 'stepSelected'; stepId: string }
  | { type: 'recordChanged'; stepId: string; fieldId: string; value: RecordValue }
  | { type: 'stepCompleted'; stepId: string }
  | { type: 'stepReopened'; stepId: string }

export const DEFAULT_OPERATOR = 'Operador'

export interface BatchExecutionState {
  recipe: Recipe
  batch: Batch
  operator: string
}

function appendAudit(
  batch: Batch,
  actor: string,
  event: Omit<CreateAuditEventInput, 'actor'>,
): Batch {
  return {
    ...batch,
    auditTrail: [...batch.auditTrail, createAuditEvent({ actor, ...event })],
  }
}

export function createInitialBatchExecutionState(
  recipe: Recipe,
  options?: CreateBatchOptions,
  operator: string = DEFAULT_OPERATOR,
): BatchExecutionState {
  return { recipe, batch: createBatchFromRecipe(recipe, options), operator }
}

export function batchExecutionReducer(
  state: BatchExecutionState,
  action: BatchExecutionAction,
): BatchExecutionState {
  const { batch, operator } = state

  switch (action.type) {
    case 'started': {
      if (batch.status === 'running' || batch.status === 'done') {
        return state
      }

      const firstStepId = getOrderedSteps(state.recipe)[0]?.id ?? null
      const nextBatch = appendAudit(
        {
          ...batch,
          status: 'running',
          currentStepId: batch.currentStepId ?? firstStepId,
        },
        operator,
        {
          action: 'batch.started',
          detail: `${state.recipe.name} (${state.recipe.code})`,
        },
      )

      return { ...state, batch: nextBatch }
    }

    case 'paused': {
      if (batch.status !== 'running') {
        return state
      }

      const nextBatch = appendAudit({ ...batch, status: 'paused' }, operator, {
        action: 'batch.paused',
      })

      return { ...state, batch: nextBatch }
    }

    case 'finished': {
      if (batch.status === 'idle' || batch.status === 'done') {
        return state
      }

      const nextBatch = appendAudit({ ...batch, status: 'done', currentStepId: null }, operator, {
        action: 'batch.finished',
        detail: batch.label,
      })

      return { ...state, batch: nextBatch }
    }

    case 'stepSelected': {
      if (!(action.stepId in batch.steps)) {
        return state
      }

      return { ...state, batch: { ...batch, currentStepId: action.stepId } }
    }

    case 'recordChanged': {
      const record = batch.steps[action.stepId]

      if (!record) {
        return state
      }

      return {
        ...state,
        batch: {
          ...batch,
          steps: {
            ...batch.steps,
            [action.stepId]: {
              ...record,
              values: { ...record.values, [action.fieldId]: action.value },
            },
          },
        },
      }
    }

    case 'stepCompleted': {
      const step = getRecipeStep(state.recipe, action.stepId)
      const record = batch.steps[action.stepId]

      if (!step || !record) {
        return state
      }

      const validation = validateStepRecord(step, record)

      if (!validation.valid) {
        const detail = validation.errors
          .map((error) => {
            const field = step.requiredFields.find((item) => item.id === error.fieldId)
            return `${field?.label ?? error.fieldId} (${error.message})`
          })
          .join('; ')

        const blockedBatch = appendAudit(
          {
            ...batch,
            steps: {
              ...batch.steps,
              [action.stepId]: { ...record, status: 'error' },
            },
          },
          operator,
          { action: 'step.blocked', stepId: step.id, detail },
        )

        return { ...state, batch: blockedBatch }
      }

      const orderedSteps = getOrderedSteps(state.recipe)
      const currentIndex = orderedSteps.findIndex((item) => item.id === action.stepId)
      const nextStep = orderedSteps[currentIndex + 1]

      const completedBatch = appendAudit(
        {
          ...batch,
          steps: {
            ...batch.steps,
            [action.stepId]: {
              ...record,
              status: 'done',
              completedAt: new Date().toISOString(),
            },
          },
          currentStepId: nextStep ? nextStep.id : null,
          status: nextStep ? batch.status : 'done',
        },
        operator,
        { action: 'step.completed', stepId: step.id, detail: step.name },
      )

      if (nextStep) {
        return { ...state, batch: completedBatch }
      }

      return {
        ...state,
        batch: appendAudit(completedBatch, operator, {
          action: 'batch.finished',
          detail: batch.label,
        }),
      }
    }

    case 'stepReopened': {
      const record = batch.steps[action.stepId]

      if (!record || record.status === 'pending') {
        return state
      }

      const orderedSteps = getOrderedSteps(state.recipe)
      const reopenIndex = orderedSteps.findIndex((step) => step.id === action.stepId)

      if (reopenIndex < 0) {
        return state
      }

      const steps = { ...batch.steps }

      orderedSteps.slice(reopenIndex).forEach((step) => {
        const current = steps[step.id]
        steps[step.id] = { ...current, status: 'pending', completedAt: undefined }
      })

      const reopenedBatch = appendAudit(
        {
          ...batch,
          status: batch.status === 'done' ? 'running' : batch.status,
          currentStepId: action.stepId,
          steps,
        },
        operator,
        { action: 'step.reopened', stepId: action.stepId, detail: orderedSteps[reopenIndex].name },
      )

      return { ...state, batch: reopenedBatch }
    }
  }
}
