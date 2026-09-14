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

  it('registra um valor de campo sem mutar o estado anterior', () => {
    const initial = initialState()
    const updated = batchExecutionReducer(initial, {
      type: 'recordChanged',
      stepId: 'pesagem',
      fieldId: 'lote-insumo',
      value: 'ABC123',
    })

    expect(updated.batch.steps.pesagem.values['lote-insumo']).toBe('ABC123')
    expect(initial.batch.steps.pesagem.values).toEqual({})
    expect(updated.batch.steps.preparo).toBe(initial.batch.steps.preparo)
  })

  it('ignora o registro em uma etapa inexistente', () => {
    const initial = initialState()

    expect(
      batchExecutionReducer(initial, {
        type: 'recordChanged',
        stepId: 'inexistente',
        fieldId: 'campo',
        value: 1,
      }),
    ).toBe(initial)
  })

  it('conclui a etapa válida e avança para a próxima', () => {
    const started = batchExecutionReducer(initialState(), { type: 'started' })
    const filled = [
      {
        type: 'recordChanged' as const,
        stepId: 'pesagem',
        fieldId: 'lote-insumo',
        value: 'LOTE-1',
      },
      { type: 'recordChanged' as const, stepId: 'pesagem', fieldId: 'massa-pesada', value: 505 },
      {
        type: 'recordChanged' as const,
        stepId: 'pesagem',
        fieldId: 'balanca-calibrada',
        value: true,
      },
    ].reduce(batchExecutionReducer, started)

    const completed = batchExecutionReducer(filled, { type: 'stepCompleted', stepId: 'pesagem' })

    expect(completed.batch.steps.pesagem.status).toBe('done')
    expect(completed.batch.steps.pesagem.completedAt).toBeDefined()
    expect(completed.batch.currentStepId).toBe('preparo')
    expect(completed.batch.status).toBe('running')
  })

  it('marca erro e não avança quando o registro é inválido', () => {
    const started = batchExecutionReducer(initialState(), { type: 'started' })
    const withInvalidValue = batchExecutionReducer(started, {
      type: 'recordChanged',
      stepId: 'pesagem',
      fieldId: 'massa-pesada',
      value: 900,
    })

    const blocked = batchExecutionReducer(withInvalidValue, {
      type: 'stepCompleted',
      stepId: 'pesagem',
    })

    expect(blocked.batch.steps.pesagem.status).toBe('error')
    expect(blocked.batch.currentStepId).toBe('pesagem')
    expect(blocked.batch.status).toBe('running')
  })

  it('conclui o lote ao finalizar a última etapa', () => {
    const started = batchExecutionReducer(initialState(), { type: 'started' })
    const onLastStep = batchExecutionReducer(started, {
      type: 'stepSelected',
      stepId: 'liberacao',
    })
    const filled = [
      {
        type: 'recordChanged' as const,
        stepId: 'liberacao',
        fieldId: 'laudo-aprovado',
        value: true,
      },
      {
        type: 'recordChanged' as const,
        stepId: 'liberacao',
        fieldId: 'responsavel',
        value: 'Maria',
      },
    ].reduce(batchExecutionReducer, onLastStep)

    const completed = batchExecutionReducer(filled, { type: 'stepCompleted', stepId: 'liberacao' })

    expect(completed.batch.steps.liberacao.status).toBe('done')
    expect(completed.batch.currentStepId).toBeNull()
    expect(completed.batch.status).toBe('done')
  })

  it('ignora concluir uma etapa inexistente', () => {
    const initial = initialState()

    expect(batchExecutionReducer(initial, { type: 'stepCompleted', stepId: 'inexistente' })).toBe(
      initial,
    )
  })
})
