export type StepStatus = 'pending' | 'active' | 'done' | 'error'

export type BatchStatus = 'idle' | 'running' | 'paused' | 'done'

export interface StepParameter {
  id: string
  label: string
  value: string
  unit?: string
}

interface RecordFieldBase {
  id: string
  label: string
  required: boolean
  helperText?: string
}

export interface TextRecordField extends RecordFieldBase {
  kind: 'text'
  multiline?: boolean
}

export interface NumberRecordField extends RecordFieldBase {
  kind: 'number'
  unit?: string
  min?: number
  max?: number
}

export interface SelectRecordField extends RecordFieldBase {
  kind: 'select'
  options: string[]
}

export interface BooleanRecordField extends RecordFieldBase {
  kind: 'boolean'
}

export type RecordField =
  TextRecordField | NumberRecordField | SelectRecordField | BooleanRecordField

export interface RecipeStep {
  id: string
  order: number
  name: string
  description: string
  parameters: StepParameter[]
  requiredFields: RecordField[]
}

export interface Recipe {
  id: string
  code: string
  name: string
  product: string
  version: string
  steps: RecipeStep[]
}

export type RecordValue = string | number | boolean

export interface StepRecord {
  stepId: string
  status: StepStatus
  values: Record<string, RecordValue>
  completedBy?: string
  completedAt?: string
}

export type AuditAction =
  | 'batch.started'
  | 'batch.paused'
  | 'batch.finished'
  | 'step.completed'
  | 'step.reopened'
  | 'step.blocked'

export interface AuditEvent {
  id: string
  timestamp: string
  actor: string
  action: AuditAction
  stepId?: string
  detail?: string
}

export interface Batch {
  id: string
  label: string
  recipeId: string
  status: BatchStatus
  currentStepId: string | null
  steps: Record<string, StepRecord>
  auditTrail: AuditEvent[]
  createdAt: string
}
