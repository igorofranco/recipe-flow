import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { AuditEvent } from '../domain'
import AuditTrailPanel from './AuditTrailPanel'

const events: AuditEvent[] = [
  {
    id: 'evento-1',
    timestamp: '2026-09-14T10:00:00.000Z',
    actor: 'Operador',
    action: 'batch.started',
    detail: 'Solução oral de paracetamol 500 mg (SOL-PAR-500)',
  },
  {
    id: 'evento-2',
    timestamp: '2026-09-14T10:05:00.000Z',
    actor: 'Maria',
    action: 'step.completed',
    stepId: 'pesagem',
    detail: 'Pesagem de insumos',
  },
]

describe('AuditTrailPanel', () => {
  it('mostra o estado vazio sem eventos', () => {
    render(<AuditTrailPanel events={[]} />)

    expect(screen.getByText('Nenhum evento registrado.')).toBeInTheDocument()
  })

  it('lista os eventos do mais recente para o mais antigo', () => {
    render(<AuditTrailPanel events={events} />)

    const items = screen.getAllByText(/Lote iniciado|Etapa concluída/)

    expect(items[0]).toHaveTextContent('Etapa concluída')
    expect(items[1]).toHaveTextContent('Lote iniciado')
  })

  it('mostra ator, horário e detalhe do evento', () => {
    render(<AuditTrailPanel events={events} />)

    expect(screen.getByText(/Maria/)).toBeInTheDocument()
    expect(screen.getByText('Pesagem de insumos')).toBeInTheDocument()
    expect(screen.getByText(/Operador/)).toBeInTheDocument()
  })
})
