import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { getRecipeStep, sampleRecipe } from '../domain'
import type { RecordField, RecordValue } from '../domain'
import RecordFieldInput from './RecordFieldInput'

function field(stepId: string, fieldId: string): RecordField {
  const step = getRecipeStep(sampleRecipe, stepId)
  const found = step?.requiredFields.find((item) => item.id === fieldId)

  if (!found) {
    throw new Error(`Campo ${fieldId} não encontrado`)
  }

  return found
}

interface HarnessProps {
  field: RecordField
  initialValue?: RecordValue
  onChange: (value: RecordValue) => void
}

function Harness({ field: recordField, initialValue, onChange }: HarnessProps) {
  const [value, setValue] = useState<RecordValue | undefined>(initialValue)

  return (
    <RecordFieldInput
      field={recordField}
      value={value}
      onChange={(next) => {
        onChange(next)
        setValue(next)
      }}
    />
  )
}

describe('RecordFieldInput', () => {
  it('emite o texto digitado no campo de texto', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<Harness field={field('pesagem', 'lote-insumo')} onChange={onChange} />)

    await user.type(screen.getByLabelText(/Lote do insumo/), 'LOTE-1')

    expect(onChange).toHaveBeenLastCalledWith('LOTE-1')
  })

  it('converte o valor do campo numérico e respeita o campo vazio', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <Harness field={field('pesagem', 'massa-pesada')} initialValue={505} onChange={onChange} />,
    )

    const input = screen.getByLabelText(/Massa pesada/)

    await user.clear(input)
    expect(onChange).toHaveBeenLastCalledWith('')

    await user.type(input, '508')
    expect(onChange).toHaveBeenLastCalledWith(508)
    expect(screen.getByText('mg')).toBeInTheDocument()
  })

  it('emite a opção escolhida no campo select', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<Harness field={field('envase', 'equipamento')} onChange={onChange} />)

    await user.click(screen.getByRole('combobox', { name: /Envasadora utilizada/ }))
    await user.click(await screen.findByRole('option', { name: 'Envasadora A' }))

    expect(onChange).toHaveBeenLastCalledWith('Envasadora A')
  })

  it('emite a confirmação do campo booleano', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <Harness
        field={field('pesagem', 'balanca-calibrada')}
        initialValue={false}
        onChange={onChange}
      />,
    )

    await user.click(screen.getByLabelText(/Balança calibrada no turno/))

    expect(onChange).toHaveBeenLastCalledWith(true)
  })

  it('mostra o erro da validação no lugar do texto de apoio', () => {
    render(
      <RecordFieldInput
        field={field('pesagem', 'lote-insumo')}
        value=""
        error="Campo obrigatório"
        onChange={vi.fn()}
      />,
    )

    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument()
    expect(screen.getByLabelText(/Lote do insumo/)).toHaveAttribute('aria-invalid', 'true')
  })
})
