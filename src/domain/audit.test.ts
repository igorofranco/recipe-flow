import { describe, expect, it } from 'vitest'
import { AUDIT_ACTION_LABELS, createAuditEvent, formatAuditTimestamp } from './index'

describe('createAuditEvent', () => {
  it('cria um evento com ator, ação, horário e id', () => {
    const event = createAuditEvent({
      actor: 'Operador',
      action: 'step.completed',
      stepId: 'pesagem',
      detail: 'Pesagem de insumos',
    })

    expect(event.action).toBe('step.completed')
    expect(event.actor).toBe('Operador')
    expect(event.stepId).toBe('pesagem')
    expect(event.detail).toBe('Pesagem de insumos')
    expect(event.id).toMatch(/^evento-/)
    expect(Number.isNaN(Date.parse(event.timestamp))).toBe(false)
  })
})

describe('formatAuditTimestamp', () => {
  it('formata o horário em pt-BR', () => {
    const formatted = formatAuditTimestamp('2026-09-14T10:30:00.000Z')

    expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/)
  })
})

describe('AUDIT_ACTION_LABELS', () => {
  it('cobre todas as ações de auditoria', () => {
    expect(Object.keys(AUDIT_ACTION_LABELS).sort()).toEqual([
      'batch.finished',
      'batch.paused',
      'batch.started',
      'step.blocked',
      'step.completed',
      'step.reopened',
    ])
  })
})
