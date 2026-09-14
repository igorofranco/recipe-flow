import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { sampleRecipe } from '../domain'
import { BatchExecutionProvider } from './BatchExecutionProvider'
import { useBatchExecution } from './useBatchExecution'

function Probe() {
  const { batch, start, pause, finish, selectStep } = useBatchExecution()

  return (
    <div>
      <span data-testid="status">{batch.status}</span>
      <span data-testid="current-step">{batch.currentStepId ?? 'nenhuma'}</span>
      <button onClick={start}>iniciar</button>
      <button onClick={pause}>pausar</button>
      <button onClick={() => selectStep('envase')}>selecionar envase</button>
      <button onClick={finish}>finalizar</button>
    </div>
  )
}

function renderProbe() {
  return render(
    <BatchExecutionProvider recipe={sampleRecipe}>
      <Probe />
    </BatchExecutionProvider>,
  )
}

describe('useBatchExecution', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('expõe o estado inicial do lote', () => {
    renderProbe()

    expect(screen.getByTestId('status')).toHaveTextContent('idle')
    expect(screen.getByTestId('current-step')).toHaveTextContent('nenhuma')
  })

  it('atualiza o estado a partir das ações do operador', async () => {
    const user = userEvent.setup()
    renderProbe()

    await user.click(screen.getByRole('button', { name: 'iniciar' }))
    expect(screen.getByTestId('status')).toHaveTextContent('running')
    expect(screen.getByTestId('current-step')).toHaveTextContent('pesagem')

    await user.click(screen.getByRole('button', { name: 'selecionar envase' }))
    expect(screen.getByTestId('current-step')).toHaveTextContent('envase')

    await user.click(screen.getByRole('button', { name: 'finalizar' }))
    expect(screen.getByTestId('status')).toHaveTextContent('done')
  })

  it('falha ao ser usado fora do provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<Probe />)).toThrow(
      'useBatchExecution deve ser usado dentro de BatchExecutionProvider',
    )
  })
})
