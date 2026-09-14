import { useReducer } from 'react'
import type { ReactNode } from 'react'
import type { CreateBatchOptions, Recipe } from '../domain'
import { BatchExecutionContext } from './BatchExecutionContext'
import { batchExecutionReducer, createInitialBatchExecutionState } from './batchExecutionReducer'

export interface BatchExecutionProviderProps extends CreateBatchOptions {
  recipe: Recipe
  children: ReactNode
}

export function BatchExecutionProvider({
  recipe,
  children,
  ...options
}: BatchExecutionProviderProps) {
  const [state, dispatch] = useReducer(
    batchExecutionReducer,
    { recipe, options },
    (init) => createInitialBatchExecutionState(init.recipe, init.options),
  )

  return (
    <BatchExecutionContext.Provider value={{ state, dispatch }}>
      {children}
    </BatchExecutionContext.Provider>
  )
}
