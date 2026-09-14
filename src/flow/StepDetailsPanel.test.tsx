import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { getRecipeStep, sampleRecipe } from '../domain'
import type { RecordValue } from '../domain'
import StepDetailsPanel from './StepDetailsPanel'

function step(id: string) {
  const found = getRecipeStep(sampleRecipe, id)
  if (!found) {
    throw new Error(`Etapa ${id} não encontrada`)
  }
  return found
}

interface HarnessProps {
  stepId: string
  onChange: (fieldId: string, value: RecordValue) => void
}

function Harness({ stepId, onChange }: HarnessProps) {
  const [values, setValues] = useState<Record<string, RecordValue>>({})

  return (
    <StepDetailsPanel
      step={step(stepId)}
      status="active"
      record={{ stepId, status: 'active', values }}
      onRecordChange={(fieldId, value) => {
        onChange(fieldId, value)
        setValues((previous) => ({ ...previous, [fieldId]: value }))
      }}
    />
  )
}

describe('StepDetailsPanel', () => {
  it('mostra detalhes e parâmetros da etapa selecionada', () => {
    render(
      <StepDetailsPanel
        step={step('pesagem')}
        status="active"
        record={{ stepId: 'pesagem', status: 'active', values: {} }}
        onRecordChange={vi.fn()}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Pesagem de insumos' })).toBeInTheDocument()
    expect(screen.getByText('Em andamento')).toBeInTheDocument()
    expect(screen.getByText('Paracetamol')).toBeInTheDocument()
    expect(screen.getByText('500 mg')).toBeInTheDocument()
  })

  it('emite a mudança de cada tipo de registro obrigatório', async () => {
    const user = userEvent.setup()
    const onRecordChange = vi.fn()

    render(<Harness stepId="pesagem" onChange={onRecordChange} />)

    await user.type(screen.getByLabelText(/Lote do insumo/), 'ABC123')
    expect(onRecordChange).toHaveBeenLastCalledWith('lote-insumo', 'ABC123')

    await user.type(screen.getByLabelText(/Massa pesada/), '505')
    expect(onRecordChange).toHaveBeenLastCalledWith('massa-pesada', 505)

    await user.click(screen.getByLabelText(/Balança calibrada no turno/))
    expect(onRecordChange).toHaveBeenLastCalledWith('balanca-calibrada', true)
  })

  it('mostra os valores já registrados na etapa', () => {
    render(
      <StepDetailsPanel
        step={step('envase')}
        status="active"
        record={{
          stepId: 'envase',
          status: 'active',
          values: { 'lote-envase': 'ENV-42' },
        }}
        onRecordChange={vi.fn()}
      />,
    )

    expect(screen.getByLabelText(/Lote de envase/)).toHaveValue('ENV-42')
  })
})
