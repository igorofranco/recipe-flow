import { describe, expect, it } from 'vitest'
import { getOrderedSteps, getRecipeStep, sampleRecipe } from './index'
import { isRecordValueEmpty, validateRecordField, validateStepRecord } from './validation'

function step(id: string) {
  const found = getRecipeStep(sampleRecipe, id)
  if (!found) {
    throw new Error(`Etapa ${id} não encontrada`)
  }
  return found
}

describe('isRecordValueEmpty', () => {
  it('trata undefined e texto vazio como vazio', () => {
    expect(isRecordValueEmpty(undefined)).toBe(true)
    expect(isRecordValueEmpty('   ')).toBe(true)
    expect(isRecordValueEmpty('')).toBe(true)
  })

  it('trata número e booleano como preenchido', () => {
    expect(isRecordValueEmpty(0)).toBe(false)
    expect(isRecordValueEmpty(false)).toBe(false)
  })
})

describe('validateRecordField', () => {
  it('cobra campo de texto obrigatório', () => {
    const field = step('pesagem').requiredFields.find((item) => item.id === 'lote-insumo')!

    expect(validateRecordField(field, undefined)).toBe('Campo obrigatório')
    expect(validateRecordField(field, 'LOTE-1')).toBeUndefined()
  })

  it('valida a faixa do campo numérico', () => {
    const field = step('pesagem').requiredFields.find((item) => item.id === 'massa-pesada')!

    expect(validateRecordField(field, 505)).toBeUndefined()
    expect(validateRecordField(field, 498)).toBe('Valor mínimo 500')
    expect(validateRecordField(field, 520)).toBe('Valor máximo 510')
  })

  it('exige confirmação do campo booleano obrigatório', () => {
    const field = step('pesagem').requiredFields.find((item) => item.id === 'balanca-calibrada')!

    expect(validateRecordField(field, false)).toBe('Confirmação obrigatória')
    expect(validateRecordField(field, true)).toBeUndefined()
  })

  it('recusa opção fora da lista do campo select', () => {
    const field = step('envase').requiredFields.find((item) => item.id === 'equipamento')!

    expect(validateRecordField(field, 'Envasadora A')).toBeUndefined()
    expect(validateRecordField(field, 'Envasadora C')).toBe('Selecione uma opção válida')
  })

  it('cobra o campo select obrigatório vazio', () => {
    const field = step('envase').requiredFields.find((item) => item.id === 'equipamento')!

    expect(validateRecordField(field, undefined)).toBe('Campo obrigatório')
    expect(validateRecordField(field, '   ')).toBe('Campo obrigatório')
  })

  it('aceita número informado como texto e converte antes de comparar', () => {
    const field = step('pesagem').requiredFields.find((item) => item.id === 'massa-pesada')!

    expect(validateRecordField(field, '505')).toBeUndefined()
    expect(validateRecordField(field, '498')).toBe('Valor mínimo 500')
  })

  it('recusa valor numérico não numérico', () => {
    const field = step('pesagem').requiredFields.find((item) => item.id === 'massa-pesada')!

    expect(validateRecordField(field, 'abc')).toBe('Valor numérico inválido')
  })

  it('ignora campo opcional vazio', () => {
    const field = step('liberacao').requiredFields.find((item) => item.id === 'observacoes')!

    expect(validateRecordField(field, undefined)).toBeUndefined()
  })

  it('não exige confirmação de campo booleano opcional', () => {
    expect(
      validateRecordField(
        { id: 'opcional', label: 'Opcional', kind: 'boolean', required: false },
        false,
      ),
    ).toBeUndefined()
  })
})

describe('validateStepRecord', () => {
  it('acumula os erros dos campos faltantes', () => {
    const result = validateStepRecord(step('pesagem'), {
      stepId: 'pesagem',
      status: 'active',
      values: {},
    })

    expect(result.valid).toBe(false)
    expect(result.errors.map((error) => error.fieldId)).toEqual([
      'lote-insumo',
      'massa-pesada',
      'balanca-calibrada',
    ])
  })

  it('aprova a etapa com todos os registros válidos', () => {
    const result = validateStepRecord(step('pesagem'), {
      stepId: 'pesagem',
      status: 'active',
      values: { 'lote-insumo': 'LOTE-1', 'massa-pesada': 505, 'balanca-calibrada': true },
    })

    expect(result).toEqual({ valid: true, errors: [] })
  })

  it('cobre todas as etapas da receita', () => {
    const ids = getOrderedSteps(sampleRecipe).map((item) => item.id)

    expect(ids).toHaveLength(5)
  })
})
