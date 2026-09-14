import type { Node } from '@xyflow/react'
import type { RecipeStep, StepStatus } from '../domain'

export type StepNodeData = {
  step: RecipeStep
  status: StepStatus
  isCurrent: boolean
  isLast: boolean
  index: number
}

export type StepNode = Node<StepNodeData, 'step'>
