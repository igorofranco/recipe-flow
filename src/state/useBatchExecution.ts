import { useContext, useMemo } from 'react'
import type { Batch, Recipe, RecordValue } from '../domain'
import { BatchExecutionContext } from './BatchExecutionContext'

export interface UseBatchExecutionResult {
  recipe: Recipe
  batch: Batch
  start: () => void
  pause: () => void
  finish: () => void
  selectStep: (stepId: string) => void
  setRecordField: (stepId: string, fieldId: string, value: RecordValue) => void
}

export function useBatchExecution(): UseBatchExecutionResult {
  const context = useContext(BatchExecutionContext)

  if (!context) {
    throw new Error('useBatchExecution deve ser usado dentro de BatchExecutionProvider')
  }

  const { state, dispatch } = context

  return useMemo(
    () => ({
      recipe: state.recipe,
      batch: state.batch,
      start: () => dispatch({ type: 'started' }),
      pause: () => dispatch({ type: 'paused' }),
      finish: () => dispatch({ type: 'finished' }),
      selectStep: (stepId: string) => dispatch({ type: 'stepSelected', stepId }),
      setRecordField: (stepId: string, fieldId: string, value: RecordValue) =>
        dispatch({ type: 'recordChanged', stepId, fieldId, value }),
    }),
    [state, dispatch],
  )
}
