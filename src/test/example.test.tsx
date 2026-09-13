import { useEffect, useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button, List, ListItem, ListItemText } from '@mui/material'
import { describe, expect, it } from 'vitest'

type Recipe = { id: string; name: string }

function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!show) return
    fetch('/api/recipes')
      .then((res) => res.json())
      .then(setRecipes)
  }, [show])

  return (
    <div>
      <Button onClick={() => setShow(true)}>Carregar receitas</Button>
      <List>
        {recipes.map((recipe) => (
          <ListItem key={recipe.id}>
            <ListItemText primary={recipe.name} />
          </ListItem>
        ))}
      </List>
    </div>
  )
}

describe('Recipes', () => {
  it('fetches recipes from the MSW handler', async () => {
    const user = userEvent.setup()
    render(<Recipes />)

    await user.click(screen.getByRole('button', { name: 'Carregar receitas' }))

    expect(await screen.findByText('Bolo de cenoura')).toBeInTheDocument()
    expect(screen.getByText('Pão de queijo')).toBeInTheDocument()
  })
})
