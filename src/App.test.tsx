import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material'
import { describe, expect, it } from 'vitest'
import App from './App'
import { sampleRecipe } from './domain'
import { createAppTheme } from './theme'

function renderApp(defaultMode: 'light' | 'dark') {
  const theme = createAppTheme()
  return render(
    <ThemeProvider theme={theme} defaultMode={defaultMode}>
      <App />
    </ThemeProvider>,
  )
}

function getFlowNode(container: HTMLElement, name: string): Element | undefined {
  return Array.from(container.querySelectorAll('.react-flow__node')).find((node) =>
    node.textContent?.includes(name),
  )
}

describe('App', () => {
  it('renders the batch layout and the flow canvas', () => {
    const { container } = renderApp('light')

    expect(screen.getByRole('heading', { name: 'Recipe Flow' })).toBeInTheDocument()
    expect(container.querySelector('.react-flow')).toBeInTheDocument()
  })

  it('syncs the ReactFlow color mode with the MUI scheme', () => {
    const { container } = renderApp('dark')

    expect(container.querySelector('.react-flow')).toHaveClass('dark')
  })

  it('renderiza uma etapa da receita como nó do fluxo', () => {
    const { container } = renderApp('light')

    expect(container.querySelectorAll('.react-flow__node')).toHaveLength(sampleRecipe.steps.length)
    expect(container.querySelector('.react-flow__node')).toHaveTextContent('Pesagem de insumos')
  })

  it('mostra o painel da primeira etapa antes de iniciar o lote', () => {
    renderApp('light')

    expect(screen.getByRole('heading', { name: 'Pesagem de insumos' })).toBeInTheDocument()
  })

  it('percorre os estados da etapa ativa até concluir o registro', async () => {
    const user = userEvent.setup()
    const { container } = renderApp('light')

    await user.click(screen.getByRole('button', { name: 'Iniciar' }))
    expect(screen.getByText('Etapa atual')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Concluir etapa' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Registro incompleto ou inválido')

    await user.type(screen.getByLabelText(/Lote do insumo/), 'LOTE-1')
    await user.type(screen.getByLabelText(/Massa pesada/), '505')
    await user.click(screen.getByLabelText(/Balança calibrada no turno/))
    await user.click(screen.getByRole('button', { name: 'Concluir etapa' }))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(getFlowNode(container, 'Pesagem de insumos')).toHaveTextContent('Concluída')
    expect(screen.getByRole('heading', { name: 'Preparo da solução' })).toBeInTheDocument()
  })
})
