import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import BatchExecutionLayout from './BatchExecutionLayout'

const steps = ['Preparação', 'Execução', 'Conferência', 'Conclusão']

describe('BatchExecutionLayout', () => {
  it('renders the AppBar and all steps', () => {
    render(
      <BatchExecutionLayout
        title="Recipe Flow"
        batchLabel="Lote #0001"
        steps={steps}
        activeStep={1}
        status="running"
      >
        <div>conteúdo</div>
      </BatchExecutionLayout>,
    )

    expect(screen.getByRole('heading', { name: 'Recipe Flow' })).toBeInTheDocument()
    expect(screen.getByText('Lote #0001')).toBeInTheDocument()
    expect(screen.getByText('Em execução')).toBeInTheDocument()
    steps.forEach((step) => expect(screen.getByText(step)).toBeInTheDocument())
    expect(screen.getByText('conteúdo')).toBeInTheDocument()
  })

  it('fires the action and step handlers', async () => {
    const user = userEvent.setup()
    const onStart = vi.fn()
    const onPause = vi.fn()
    const onFinish = vi.fn()
    const onStepSelect = vi.fn()

    render(
      <BatchExecutionLayout
        title="Recipe Flow"
        batchLabel="Lote #0001"
        steps={steps}
        activeStep={0}
        status="idle"
        onStart={onStart}
        onPause={onPause}
        onFinish={onFinish}
        onStepSelect={onStepSelect}
      >
        <div />
      </BatchExecutionLayout>,
    )

    await user.click(screen.getByRole('button', { name: 'Iniciar' }))
    await user.click(screen.getByRole('tab', { name: 'Conferência' }))

    expect(onStart).toHaveBeenCalledOnce()
    expect(onStepSelect).toHaveBeenCalledWith(2)
    expect(onPause).not.toHaveBeenCalled()
    expect(onFinish).not.toHaveBeenCalled()
  })

  it('disables actions according to the status', () => {
    render(
      <BatchExecutionLayout
        title="Recipe Flow"
        batchLabel="Lote #0001"
        steps={steps}
        activeStep={1}
        status="running"
      >
        <div />
      </BatchExecutionLayout>,
    )

    expect(screen.getByRole('button', { name: 'Iniciar' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Pausar' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Finalizar' })).toBeEnabled()
  })
})
