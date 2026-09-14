import { MarkerType } from '@xyflow/react'
import type { Edge } from '@xyflow/react'
import { getOrderedSteps } from '../domain'
import type { Batch, Recipe, StepStatus } from '../domain'
import type { StepNode } from './types'

export const STEP_NODE_WIDTH = 260
export const STEP_NODE_VERTICAL_GAP = 150

export interface FlowGraph {
  nodes: StepNode[]
  edges: Edge[]
}

export function resolveStepStatus(batch: Batch, stepId: string): StepStatus {
  const record = batch.steps[stepId]

  if (record && record.status !== 'pending') {
    return record.status
  }

  if (batch.status !== 'idle' && batch.currentStepId === stepId) {
    return 'active'
  }

  return 'pending'
}

export function buildFlowGraph(recipe: Recipe, batch: Batch): FlowGraph {
  const steps = getOrderedSteps(recipe)
  const activeIndex = batch.currentStepId
    ? steps.findIndex((step) => step.id === batch.currentStepId)
    : -1

  const nodes = steps.map<StepNode>((step, index) => ({
    id: step.id,
    type: 'step',
    position: { x: 0, y: index * STEP_NODE_VERTICAL_GAP },
    data: {
      step,
      status: resolveStepStatus(batch, step.id),
      isCurrent: batch.currentStepId === step.id,
      isLast: index === steps.length - 1,
      index,
    },
    style: { width: STEP_NODE_WIDTH },
    draggable: false,
  }))

  const edges = steps.slice(1).map<Edge>((step, index) => {
    const source = steps[index]

    return {
      id: `${source.id}-${step.id}`,
      source: source.id,
      target: step.id,
      type: 'smoothstep',
      animated: batch.status === 'running' && activeIndex === index + 1,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { strokeWidth: 2 },
    }
  })

  return { nodes, edges }
}
