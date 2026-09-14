import { describe, expect, it } from 'vitest'
import { createBatchFromRecipe, getOrderedSteps, sampleRecipe } from '../domain'
import type { Batch, StepStatus } from '../domain'
import { buildFlowGraph, resolveStepStatus, STEP_NODE_VERTICAL_GAP } from './buildFlowGraph'

function emptyBatch(overrides: Partial<Batch> = {}): Batch {
  return { ...createBatchFromRecipe(sampleRecipe, { id: 'lote-teste' }), ...overrides }
}

function batchWithStepStatus(stepId: string, status: StepStatus): Batch {
  const batch = emptyBatch()

  return {
    ...batch,
    steps: { ...batch.steps, [stepId]: { ...batch.steps[stepId], status } },
  }
}

describe('resolveStepStatus', () => {
  it('mantém a etapa pendente enquanto o lote está idle', () => {
    expect(resolveStepStatus(emptyBatch(), 'pesagem')).toBe('pending')
  })

  it('marca a etapa atual como ativa durante a execução', () => {
    const batch = emptyBatch({ status: 'running', currentStepId: 'preparo' })

    expect(resolveStepStatus(batch, 'preparo')).toBe('active')
    expect(resolveStepStatus(batch, 'pesagem')).toBe('pending')
  })

  it('mantém a etapa atual ativa quando o lote está pausado', () => {
    const batch = emptyBatch({ status: 'paused', currentStepId: 'preparo' })

    expect(resolveStepStatus(batch, 'preparo')).toBe('active')
  })

  it('respeita o status registrado na etapa', () => {
    expect(resolveStepStatus(batchWithStepStatus('pesagem', 'done'), 'pesagem')).toBe('done')
    expect(resolveStepStatus(batchWithStepStatus('pesagem', 'error'), 'pesagem')).toBe('error')
  })
})

describe('buildFlowGraph', () => {
  it('gera um nó por etapa na ordem da receita', () => {
    const { nodes } = buildFlowGraph(sampleRecipe, emptyBatch())
    const orderedIds = getOrderedSteps(sampleRecipe).map((step) => step.id)

    expect(nodes.map((node) => node.id)).toEqual(orderedIds)
    expect(nodes.every((node) => node.type === 'step')).toBe(true)
    expect(nodes.every((node) => node.data.status === 'pending')).toBe(true)
    expect(nodes.map((node) => node.position.y)).toEqual(
      orderedIds.map((_, index) => index * STEP_NODE_VERTICAL_GAP),
    )
  })

  it('marca o primeiro e o último nó corretamente', () => {
    const { nodes } = buildFlowGraph(sampleRecipe, emptyBatch())

    expect(nodes[0].data.index).toBe(0)
    expect(nodes[0].data.isLast).toBe(false)
    expect(nodes[nodes.length - 1].data.isLast).toBe(true)
  })

  it('conecta as etapas com arestas na ordem da receita', () => {
    const { nodes, edges } = buildFlowGraph(sampleRecipe, emptyBatch())

    expect(edges).toHaveLength(nodes.length - 1)
    expect(edges[0]).toMatchObject({ source: 'pesagem', target: 'preparo' })
    expect(edges[edges.length - 1]).toMatchObject({ source: 'rotulagem', target: 'liberacao' })
  })

  it('anima apenas a aresta que leva à etapa atual', () => {
    const batch = emptyBatch({ status: 'running', currentStepId: 'envase' })
    const { edges } = buildFlowGraph(sampleRecipe, batch)

    expect(edges.filter((edge) => edge.animated)).toHaveLength(1)
    expect(edges[1]).toMatchObject({ source: 'preparo', target: 'envase', animated: true })
  })

  it('destaca a etapa atual no nó correspondente', () => {
    const batch = emptyBatch({ status: 'running', currentStepId: 'envase' })
    const { nodes } = buildFlowGraph(sampleRecipe, batch)
    const current = nodes.find((node) => node.id === 'envase')

    expect(current?.data.isCurrent).toBe(true)
    expect(current?.data.status).toBe('active')
  })
})
