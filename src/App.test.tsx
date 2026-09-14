import { render, screen } from '@testing-library/react'
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
})
