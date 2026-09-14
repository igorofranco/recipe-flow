import { Box } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'
import { Background, Controls, MiniMap, ReactFlow, type Edge, type Node } from '@xyflow/react'
import BatchExecutionLayout from './layouts/BatchExecutionLayout'
import { flowStyles } from './flow/flowStyles'
import { getOrderedSteps, sampleRecipe } from './domain'
import { BatchExecutionProvider, useBatchExecution } from './state'

const nodes: Node[] = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: { label: 'Recipe Flow' },
  },
]

const edges: Edge[] = []

function BatchExecutionScreen() {
  const { recipe, batch, start, pause, finish, selectStep } = useBatchExecution()
  const orderedSteps = getOrderedSteps(recipe)
  const activeStep = batch.currentStepId
    ? Math.max(
        orderedSteps.findIndex((step) => step.id === batch.currentStepId),
        0,
      )
    : 0
  const { mode, systemMode } = useColorScheme()
  const colorMode = mode === 'system' ? (systemMode ?? 'light') : mode

  return (
    <BatchExecutionLayout
      title="Recipe Flow"
      batchLabel={batch.label}
      steps={orderedSteps.map((step) => step.name)}
      activeStep={activeStep}
      status={batch.status}
      onStepSelect={(index) => {
        const step = orderedSteps[index]
        if (step) selectStep(step.id)
      }}
      onStart={start}
      onPause={pause}
      onFinish={finish}
    >
      <Box sx={flowStyles}>
        <ReactFlow colorMode={colorMode} nodes={nodes} edges={edges} fitView>
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </Box>
    </BatchExecutionLayout>
  )
}

export default function App() {
  return (
    <BatchExecutionProvider recipe={sampleRecipe}>
      <BatchExecutionScreen />
    </BatchExecutionProvider>
  )
}
