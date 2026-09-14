import { describe, expect, it } from 'vitest'
import { sampleRecipe } from '../domain'
import { batchExecutionReducer, createInitialBatchExecutionState } from './batchExecutionReducer'

function initialState() {
  return createInitialBatchExecutionState(sampleRecipe, { id: 'lote-teste' })
}

describe('batchExecutionReducer', () => {
  it('inicia o lote e aponta para a primeira etapa', () => {
    const state = batchExecutionReducer(initialState(), { type: 'started' })

    expect(state.batch.status).toBe('running')
    expect(state.batch.currentStepId).toBe('pesagem')
  })

  it('ignora iniciar um lote já em execução', () => {
    const running = batchExecutionReducer(initialState(), { type: 'started' })

    expect(batchExecutionReducer(running, { type: 'started' })).toBe(running)
  })

  it('pausa um lote em execução', () => {
    const running = batchExecutionReducer(initialState(), { type: 'started' })

    expect(batchExecutionReducer(running, { type: 'paused' }).batch.status).toBe('paused')
  })

  it('não pausa um lote que não está em execução', () => {
    const initial = initialState()

    expect(batchExecutionReducer(initial, { type: 'paused' })).toBe(initial)
  })

  it('finaliza o lote e limpa a etapa atual', () => {
    const running = batchExecutionReducer(initialState(), { type: 'started' })
    const done = batchExecutionReducer(running, { type: 'finished' })

    expect(done.batch.status).toBe('done')
    expect(done.batch.currentStepId).toBeNull()
  })

  it('não finaliza um lote idle ou já concluído', () => {
    const initial = initialState()

    expect(batchExecutionReducer(initial, { type: 'finished' })).toBe(initial)
  })

  it('seleciona uma etapa existente e ignora id desconhecido', () => {
    const initial = initialState()
    const selected = batchExecutionReducer(initial, { type: 'stepSelected', stepId: 'envase' })

    expect(selected.batch.currentStepId).toBe('envase')
    expect(batchExecutionReducer(initial, { type: 'stepSelected', stepId: 'inexistente' })).toBe(
      initial,
    )
  })
})
