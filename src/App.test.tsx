import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material'
import { describe, expect, it } from 'vitest'
import App from './App'
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
})
