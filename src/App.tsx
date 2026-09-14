import { useMemo } from 'react'
import { Box } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'
import { Background, Controls, MiniMap, ReactFlow } from '@xyflow/react'
import type { Edge } from '@xyflow/react'
import BatchExecutionLayout from './layouts/BatchExecutionLayout'
import { flowStyles } from './flow/flowStyles'
import { buildFlowGraph, resolveStepStatus } from './flow/buildFlowGraph'
import { nodeTypes } from './flow/nodeTypes'
import StepDetailsPanel from './flow/StepDetailsPanel'
import AuditTrailPanel from './flow/AuditTrailPanel'
import type { StepNode } from './flow/types'
import { getOrderedSteps, getRecipeStep, sampleRecipe } from './domain'
import { BatchExecutionProvider, useBatchExecution } from './state'

function BatchExecutionScreen() {
  const {
    recipe,
    batch,
    start,
    pause,
    finish,
    selectStep,
    setRecordField,
    completeStep,
    reopenStep,
  } = useBatchExecution()
  const orderedSteps = getOrderedSteps(recipe)
  const { nodes, edges } = useMemo(() => buildFlowGraph(recipe, batch), [recipe, batch])

  const activeStep = batch.currentStepId
    ? Math.max(
        orderedSteps.findIndex((step) => step.id === batch.currentStepId),
        0,
      )
    : 0

  const selectedStep = batch.currentStepId ? getRecipeStep(recipe, batch.currentStepId) : undefined
  const panelStep = selectedStep ?? orderedSteps[0]
  const panelStatus = panelStep ? resolveStepStatus(batch, panelStep.id) : 'pending'
  const isPanelCurrent = panelStep ? batch.currentStepId === panelStep.id : false
  const canComplete =
    isPanelCurrent &&
    (batch.status === 'running' || batch.status === 'paused') &&
    panelStatus !== 'done'
  const canReopen = !canComplete && (panelStatus === 'done' || panelStatus === 'error')

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
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          height: '100%',
          minHeight: 0,
        }}
      >
        <Box sx={(theme) => ({ ...flowStyles(theme), flex: 1, minWidth: 0 })}>
          <ReactFlow<StepNode, Edge>
            colorMode={colorMode}
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodeClick={(_, node) => selectStep(node.id)}
            nodesConnectable={false}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: { xs: '100%', md: 360 },
            flexShrink: 0,
            minHeight: 0,
            borderLeft: { xs: 0, md: 1 },
            borderTop: { xs: 1, md: 0 },
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          {panelStep ? (
            <StepDetailsPanel
              step={panelStep}
              status={panelStatus}
              record={batch.steps[panelStep.id]}
              isCurrent={isPanelCurrent}
              canComplete={canComplete}
              canReopen={canReopen}
              onComplete={() => completeStep(panelStep.id)}
              onReopen={() => reopenStep(panelStep.id)}
              onRecordChange={(fieldId, value) => setRecordField(panelStep.id, fieldId, value)}
            />
          ) : null}

          <AuditTrailPanel events={batch.auditTrail} />
        </Box>
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
