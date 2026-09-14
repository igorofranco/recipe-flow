import { fireEvent, render, screen } from '@testing-library/react'
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

  it('permite reabrir uma etapa concluída para corrigir o registro', async () => {
    const user = userEvent.setup()
    const { container } = renderApp('light')

    await user.click(screen.getByRole('button', { name: 'Iniciar' }))
    await user.type(screen.getByLabelText(/Lote do insumo/), 'LOTE-1')
    await user.type(screen.getByLabelText(/Massa pesada/), '505')
    await user.click(screen.getByLabelText(/Balança calibrada no turno/))
    await user.click(screen.getByRole('button', { name: 'Concluir etapa' }))

    await user.click(screen.getByRole('tab', { name: 'Pesagem de insumos' }))
    expect(screen.getByRole('button', { name: 'Reabrir etapa' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reabrir etapa' }))

    expect(getFlowNode(container, 'Pesagem de insumos')).toHaveTextContent('Em andamento')
    expect(screen.getByRole('button', { name: 'Concluir etapa' })).toBeInTheDocument()
  })

  it('registra na trilha de auditoria as ações do operador', async () => {
    const user = userEvent.setup()
    renderApp('light')

    expect(screen.getByText('Nenhum evento registrado.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Iniciar' }))
    expect(screen.getByText('Lote iniciado')).toBeInTheDocument()

    await user.type(screen.getByLabelText(/Lote do insumo/), 'LOTE-1')
    await user.type(screen.getByLabelText(/Massa pesada/), '505')
    await user.click(screen.getByLabelText(/Balança calibrada no turno/))
    await user.click(screen.getByRole('button', { name: 'Concluir etapa' }))

    expect(screen.getByText('Etapa concluída')).toBeInTheDocument()
  })

  it('seleciona a etapa ao clicar no nó do fluxo', () => {
    const { container } = renderApp('light')

    const node = getFlowNode(container, 'Envase')

    expect(node).toBeDefined()

    fireEvent.click(node as Element)

    expect(screen.getByRole('heading', { name: 'Envase' })).toBeInTheDocument()
  })

  it('pausa e finaliza o lote pelas ações do cabeçalho', async () => {
    const user = userEvent.setup()
    renderApp('light')

    await user.click(screen.getByRole('button', { name: 'Iniciar' }))
    expect(screen.getByText('Em execução')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Pausar' }))
    expect(screen.getByText('Pausado')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Finalizar' }))
    expect(screen.getByText('Concluído')).toBeInTheDocument()
  })

  it('executa a receita inteira e mantém a trilha de auditoria', async () => {
    const user = userEvent.setup()
    const { container } = renderApp('light')

    await user.click(screen.getByRole('button', { name: 'Iniciar' }))

    await user.type(screen.getByLabelText(/Lote do insumo/), 'LOTE-1')
    await user.type(screen.getByLabelText(/Massa pesada/), '505')
    await user.click(screen.getByLabelText(/Balança calibrada no turno/))
    await user.click(screen.getByRole('button', { name: 'Concluir etapa' }))

    await user.type(screen.getByLabelText(/Volume de água purificada/), '15.2')
    await user.type(screen.getByLabelText(/Temperatura medida/), '25')
    await user.type(screen.getByLabelText(/pH medido/), '5.5')
    await user.click(screen.getByLabelText(/Solução límpida e sem partículas/))
    await user.click(screen.getByRole('button', { name: 'Concluir etapa' }))

    await user.type(screen.getByLabelText(/Lote de envase/), 'ENV-42')
    await user.click(screen.getByRole('combobox', { name: /Envasadora utilizada/ }))
    await user.click(await screen.findByRole('option', { name: 'Envasadora A' }))
    await user.type(screen.getByLabelText(/Volume envasado/), '15.1')
    await user.type(screen.getByLabelText(/Frascos aprovados/), '120')
    await user.click(screen.getByRole('button', { name: 'Concluir etapa' }))

    await user.type(screen.getByLabelText(/Lote do rótulo/), 'ROT-1')
    await user.click(screen.getByLabelText(/Dados do rótulo conferidos/))
    await user.click(screen.getByRole('button', { name: 'Concluir etapa' }))

    await user.click(screen.getByLabelText(/Laudo aprovado/))
    await user.type(screen.getByLabelText(/Responsável pela liberação/), 'Maria')
    await user.click(screen.getByRole('button', { name: 'Concluir etapa' }))

    expect(screen.getByText('Concluído')).toBeInTheDocument()
    expect(getFlowNode(container, 'Liberação do lote')).toHaveTextContent('Concluída')
    expect(screen.getAllByText('Etapa concluída')).toHaveLength(sampleRecipe.steps.length)
    expect(screen.getByText('Lote finalizado')).toBeInTheDocument()
  })
})
