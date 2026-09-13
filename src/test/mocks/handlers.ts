import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/recipes', () =>
    HttpResponse.json([
      { id: '1', name: 'Bolo de cenoura' },
      { id: '2', name: 'Pão de queijo' },
    ]),
  ),
]
