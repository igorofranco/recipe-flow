import { createDomainId } from './batch'
import type { AuditAction, AuditEvent } from './types'

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  'batch.started': 'Lote iniciado',
  'batch.paused': 'Lote pausado',
  'batch.finished': 'Lote finalizado',
  'step.completed': 'Etapa concluída',
  'step.reopened': 'Etapa reaberta',
  'step.blocked': 'Avanço bloqueado',
}

export interface CreateAuditEventInput {
  actor: string
  action: AuditAction
  stepId?: string
  detail?: string
}

export function createAuditEvent(input: CreateAuditEventInput): AuditEvent {
  return {
    id: createDomainId('evento'),
    timestamp: new Date().toISOString(),
    ...input,
  }
}

export function formatAuditTimestamp(timestamp: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(new Date(timestamp))
}
