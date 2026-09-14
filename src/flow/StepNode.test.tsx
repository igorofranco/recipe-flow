import { render, screen } from '@testing-library/react'
import { ReactFlowProvider } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import type { ReactElement } from 'react'
import { describe, expect, it } from 'vitest'
import type { RecipeStep, StepStatus } from '../domain'
import StepNode from './StepNode'
import type { StepNode as StepNodeType } from './types'

function makeStep(requiredFields: number): RecipeStep {
  return {
    id: 'etapa-teste',
    order: 1,
    name: 'Etapa de teste',
    description: 'Descrição da etapa de teste.',
    parameters: [],
    requiredFields: Array.from({ length: requiredFields }, (_, index) => ({
      id: `campo-${index}`,
      label: `Campo ${index}`,
      kind: 'text' as const,
      required: true,
    })),
  }
}

interface NodeOptions {
  status?: StepStatus
  isCurrent?: boolean
  isLast?: boolean
  index?: number
  selected?: boolean
  requiredFields?: number
}

function nodeElement({
  status = 'pending',
  isCurrent = false,
  isLast = false,
  index = 0,
  selected = false,
  requiredFields = 2,
}: NodeOptions = {}): ReactElement {
  const props = {
    id: 'etapa-teste',
    type: 'step',
    selected,
    dragging: false,
    zIndex: 0,
    isConnectable: true,
    positionAbsoluteX: 0,
    positionAbsoluteY: 0,
    data: {
      step: makeStep(requiredFields),
      status,
      isCurrent,
      isLast,
      index,
    },
  } as unknown as NodeProps<StepNodeType>

  return (
    <ReactFlowProvider>
      <StepNode {...props} />
    </ReactFlowProvider>
  )
}

describe('StepNode', () => {
  it('mostra nome, ordem e o status da etapa', () => {
    render(nodeElement({ status: 'active' }))

    expect(screen.getByText('Etapa de teste')).toBeInTheDocument()
    expect(screen.getByText('Etapa 1')).toBeInTheDocument()
    expect(screen.getByText('Em andamento')).toBeInTheDocument()
  })

  it('rotula os registros no plural', () => {
    render(nodeElement({ requiredFields: 2 }))

    expect(screen.getByText(/2 registros obrigatórios/)).toBeInTheDocument()
  })

  it('rotula o registro no singular', () => {
    render(nodeElement({ requiredFields: 1 }))

    expect(screen.getByText(/1 registro obrigatório$/)).toBeInTheDocument()
  })

  it('destaca a etapa atual', () => {
    render(nodeElement({ status: 'active', isCurrent: true }))

    expect(screen.getByText(/Etapa atual, 2 registros obrigatórios/)).toBeInTheDocument()
  })

  it('renderiza os estados de erro, conclusão e seleção', () => {
    const { rerender } = render(nodeElement({ status: 'error' }))
    expect(screen.getByText('Erro')).toBeInTheDocument()

    rerender(nodeElement({ status: 'done', isLast: true, index: 1 }))
    expect(screen.getByText('Concluída')).toBeInTheDocument()

    rerender(nodeElement({ selected: true }))
    expect(screen.getByText('Pendente')).toBeInTheDocument()
  })
})
