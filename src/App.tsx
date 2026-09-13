import { useState } from 'react'
import { Box } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'
import { Background, Controls, MiniMap, ReactFlow, type Edge, type Node } from '@xyflow/react'
import BatchExecutionLayout, { type BatchStatus } from './layouts/BatchExecutionLayout'
import { flowStyles } from './flow/flowStyles'

const STEPS = ['Preparação', 'Execução', 'Conferência', 'Conclusão']

const nodes: Node[] = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: { label: 'Recipe Flow' },
  },
]

const edges: Edge[] = []

export default function App() {
  const [activeStep, setActiveStep] = useState(0)
  const [status, setStatus] = useState<BatchStatus>('idle')
  const { mode, systemMode } = useColorScheme()
  const colorMode = mode === 'system' ? (systemMode ?? 'light') : mode

  const handleStart = () => {
    setStatus('running')
    setActiveStep((step) => (step === 0 ? 1 : step))
  }

  const handlePause = () => {
    setStatus('paused')
  }

  const handleFinish = () => {
    setActiveStep(STEPS.length)
    setStatus('done')
  }

  return (
    <BatchExecutionLayout
      title="Recipe Flow"
      batchLabel="Lote #0001"
      steps={STEPS}
      activeStep={activeStep}
      status={status}
      onStepSelect={setActiveStep}
      onStart={handleStart}
      onPause={handlePause}
      onFinish={handleFinish}
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
