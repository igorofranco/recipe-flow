import type { RecipeStep, RecordField, RecordValue, StepRecord } from './types'

export interface FieldValidationError {
  fieldId: string
  message: string
}

export interface StepValidationResult {
  valid: boolean
  errors: FieldValidationError[]
}

export function isRecordValueEmpty(value: RecordValue | undefined): boolean {
  if (value === undefined) {
    return true
  }

  return typeof value === 'string' && value.trim() === ''
}

export function validateRecordField(
  field: RecordField,
  value: RecordValue | undefined,
): string | undefined {
  if (field.kind === 'boolean') {
    return field.required && value !== true ? 'Confirmação obrigatória' : undefined
  }

  if (isRecordValueEmpty(value)) {
    return field.required ? 'Campo obrigatório' : undefined
  }

  if (field.kind === 'number') {
    const numeric = typeof value === 'number' ? value : Number(value)

    if (Number.isNaN(numeric)) {
      return 'Valor numérico inválido'
    }
    if (field.min !== undefined && numeric < field.min) {
      return `Valor mínimo ${field.min}`
    }
    if (field.max !== undefined && numeric > field.max) {
      return `Valor máximo ${field.max}`
    }

    return undefined
  }

  if (field.kind === 'select' && !field.options.includes(String(value))) {
    return 'Selecione uma opção válida'
  }

  return undefined
}

export function validateStepRecord(step: RecipeStep, record: StepRecord): StepValidationResult {
  const errors = step.requiredFields.reduce<FieldValidationError[]>((result, field) => {
    const message = validateRecordField(field, record.values[field.id])

    if (message) {
      result.push({ fieldId: field.id, message })
    }

    return result
  }, [])

  return { valid: errors.length === 0, errors }
}
