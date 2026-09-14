import { createContext } from 'react'
import type { Dispatch } from 'react'
import type { BatchExecutionAction, BatchExecutionState } from './batchExecutionReducer'

export interface BatchExecutionContextValue {
  state: BatchExecutionState
  dispatch: Dispatch<BatchExecutionAction>
}

export const BatchExecutionContext = createContext<BatchExecutionContextValue | null>(null)
