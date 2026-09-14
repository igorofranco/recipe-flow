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

  it('mostra o motivo quando a etapa está em erro', () => {
    render(
      <StepDetailsPanel
        step={step('pesagem')}
        status="error"
        record={{ stepId: 'pesagem', status: 'error', values: {} }}
        isCurrent
        canComplete
        onRecordChange={vi.fn()}
      />,
    )

    const alert = screen.getByRole('alert')

    expect(alert).toHaveTextContent('Registro incompleto ou inválido')
    expect(alert).toHaveTextContent('Lote do insumo: Campo obrigatório')
  })

  it('destaca a próxima ação e só habilita a conclusão quando aplicável', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    const { rerender } = render(
      <StepDetailsPanel
        step={step('pesagem')}
        status="active"
        record={{ stepId: 'pesagem', status: 'active', values: {} }}
        isCurrent
        canComplete
        onComplete={onComplete}
        onRecordChange={vi.fn()}
      />,
    )

    expect(screen.getByText('Próxima ação')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Concluir etapa' }))
    expect(onComplete).toHaveBeenCalledOnce()

    rerender(
      <StepDetailsPanel
        step={step('pesagem')}
        status="pending"
        record={{ stepId: 'pesagem', status: 'pending', values: {} }}
        onRecordChange={vi.fn()}
      />,
    )

    expect(screen.queryByRole('button', { name: 'Concluir etapa' })).not.toBeInTheDocument()
    expect(
      screen.getByText('Selecione a etapa atual para registrar e avançar.'),
    ).toBeInTheDocument()
  })

  it('marca o campo que falhou na validação', () => {
    render(
      <StepDetailsPanel
        step={step('pesagem')}
        status="error"
        record={{ stepId: 'pesagem', status: 'error', values: { 'lote-insumo': 'LOTE-1' } }}
        isCurrent
        canComplete
        onRecordChange={vi.fn()}
      />,
    )

    expect(screen.getByLabelText(/Massa pesada/)).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText(/Lote do insumo/)).toHaveAttribute('aria-invalid', 'false')
  })

  it('oferece reabrir uma etapa concluída', async () => {
    const user = userEvent.setup()
    const onReopen = vi.fn()

    render(
      <StepDetailsPanel
        step={step('pesagem')}
        status="done"
        record={{ stepId: 'pesagem', status: 'done', values: {} }}
        canReopen
        onReopen={onReopen}
        onRecordChange={vi.fn()}
      />,
    )

    expect(screen.queryByRole('button', { name: 'Concluir etapa' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reabrir etapa' }))
    expect(onReopen).toHaveBeenCalledOnce()
  })
})
