import { describe, expect, it } from 'vitest'
import { sampleRecipe } from '../domain'
import type { BatchExecutionState } from './batchExecutionReducer'
import { batchExecutionReducer, createInitialBatchExecutionState } from './batchExecutionReducer'

function initialState() {
  return createInitialBatchExecutionState(sampleRecipe, { id: 'lote-teste' })
}

function recordValues(
  state: BatchExecutionState,
  stepId: string,
  values: Record<string, string | number | boolean>,
): BatchExecutionState {
  return Object.entries(values).reduce(
    (result, [fieldId, value]) =>
      batchExecutionReducer(result, { type: 'recordChanged', stepId, fieldId, value }),
    state,
  )
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

  it('reabre uma etapa concluída e invalida as etapas seguintes', () => {
    const started = batchExecutionReducer(initialState(), { type: 'started' })
    const completedPesagem = batchExecutionReducer(
      recordValues(started, 'pesagem', {
        'lote-insumo': 'LOTE-1',
        'massa-pesada': 505,
        'balanca-calibrada': true,
      }),
      { type: 'stepCompleted', stepId: 'pesagem' },
    )
    const completedPreparo = batchExecutionReducer(
      recordValues(completedPesagem, 'preparo', {
        'volume-agua': 15.2,
        'temperatura-medida': 25,
        'ph-medido': 5.5,
        'aspecto-conforme': true,
      }),
      { type: 'stepCompleted', stepId: 'preparo' },
    )

    expect(completedPreparo.batch.currentStepId).toBe('envase')

    const reopened = batchExecutionReducer(completedPreparo, {
      type: 'stepReopened',
      stepId: 'pesagem',
    })

    expect(reopened.batch.currentStepId).toBe('pesagem')
    expect(reopened.batch.steps.pesagem.status).toBe('pending')
    expect(reopened.batch.steps.pesagem.completedAt).toBeUndefined()
    expect(reopened.batch.steps.preparo.status).toBe('pending')
    expect(reopened.batch.steps.envase.status).toBe('pending')
  })

  it('ignora reabrir uma etapa registrada fora da ordem da receita', () => {
    const initial = initialState()
    const withUnknownStep: BatchExecutionState = {
      ...initial,
      batch: {
        ...initial.batch,
        steps: {
          ...initial.batch.steps,
          fantasma: { stepId: 'fantasma', status: 'done', values: {} },
        },
      },
    }

    expect(
      batchExecutionReducer(withUnknownStep, { type: 'stepReopened', stepId: 'fantasma' }),
    ).toBe(withUnknownStep)
  })

  it('reabre uma etapa de um lote concluído e retoma a execução', () => {
    const started = batchExecutionReducer(initialState(), { type: 'started' })
    const completed = batchExecutionReducer(
      recordValues(started, 'pesagem', {
        'lote-insumo': 'LOTE-1',
        'massa-pesada': 505,
        'balanca-calibrada': true,
      }),
      { type: 'stepCompleted', stepId: 'pesagem' },
    )
    const finished = batchExecutionReducer(completed, { type: 'finished' })

    expect(finished.batch.status).toBe('done')

    const reopened = batchExecutionReducer(finished, { type: 'stepReopened', stepId: 'pesagem' })

    expect(reopened.batch.status).toBe('running')
    expect(reopened.batch.currentStepId).toBe('pesagem')
  })

  it('ignora reabrir etapa pendente ou inexistente', () => {
    const initial = initialState()

    expect(batchExecutionReducer(initial, { type: 'stepReopened', stepId: 'pesagem' })).toBe(
      initial,
    )
    expect(batchExecutionReducer(initial, { type: 'stepReopened', stepId: 'inexistente' })).toBe(
      initial,
    )
  })

  it('registra o início do lote na trilha de auditoria', () => {
    const started = batchExecutionReducer(initialState(), { type: 'started' })

    expect(started.batch.auditTrail).toHaveLength(1)
    expect(started.batch.auditTrail[0]).toMatchObject({
      action: 'batch.started',
      actor: 'Operador',
    })
    expect(Date.parse(started.batch.auditTrail[0].timestamp)).not.toBeNaN()
  })

  it('atribui os eventos ao operador configurado', () => {
    const state = createInitialBatchExecutionState(sampleRecipe, undefined, 'Maria')
    const started = batchExecutionReducer(state, { type: 'started' })

    expect(started.batch.auditTrail[0].actor).toBe('Maria')
  })

  it('registra o avanço bloqueado com o motivo', () => {
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
    const lastEvent = blocked.batch.auditTrail[blocked.batch.auditTrail.length - 1]

    expect(lastEvent).toMatchObject({ action: 'step.blocked', stepId: 'pesagem' })
    expect(lastEvent.detail).toContain('Massa pesada')
  })

  it('registra a conclusão da etapa e do lote', () => {
    const started = batchExecutionReducer(initialState(), { type: 'started' })
    const onLastStep = batchExecutionReducer(started, {
      type: 'stepSelected',
      stepId: 'liberacao',
    })
    const filled = recordValues(onLastStep, 'liberacao', {
      'laudo-aprovado': true,
      responsavel: 'Maria',
    })
    const completed = batchExecutionReducer(filled, { type: 'stepCompleted', stepId: 'liberacao' })

    expect(completed.batch.auditTrail.map((event) => event.action)).toEqual([
      'batch.started',
      'step.completed',
      'batch.finished',
    ])
  })

  it('registra pausa e reabertura de etapa', () => {
    const started = batchExecutionReducer(initialState(), { type: 'started' })
    const paused = batchExecutionReducer(started, { type: 'paused' })
    const completed = batchExecutionReducer(
      recordValues(paused, 'pesagem', {
        'lote-insumo': 'LOTE-1',
        'massa-pesada': 505,
        'balanca-calibrada': true,
      }),
      { type: 'stepCompleted', stepId: 'pesagem' },
    )

    expect(completed.batch.auditTrail.map((event) => event.action)).toEqual([
      'batch.started',
      'batch.paused',
      'step.completed',
    ])

    const reopened = batchExecutionReducer(completed, { type: 'stepReopened', stepId: 'pesagem' })

    expect(reopened.batch.auditTrail[reopened.batch.auditTrail.length - 1]).toMatchObject({
      action: 'step.reopened',
      stepId: 'pesagem',
    })
  })
})
