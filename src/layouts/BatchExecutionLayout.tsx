import type { ReactNode } from 'react'
import {
  AppBar,
  Box,
  Button,
  Chip,
  Step,
  StepButton,
  Stepper,
  Toolbar,
  Typography,
} from '@mui/material'
import type { ChipProps } from '@mui/material'
import type { BatchStatus } from '../domain'

export type { BatchStatus }

const STATUS_CONFIG: Record<BatchStatus, { label: string; color: ChipProps['color'] }> = {
  idle: { label: 'Aguardando', color: 'default' },
  running: { label: 'Em execução', color: 'success' },
  paused: { label: 'Pausado', color: 'warning' },
  done: { label: 'Concluído', color: 'info' },
}

export interface BatchExecutionLayoutProps {
  title: string
  batchLabel: string
  steps: string[]
  activeStep: number
  status: BatchStatus
  onStepSelect?: (step: number) => void
  onStart?: () => void
  onPause?: () => void
  onFinish?: () => void
  children: ReactNode
}

export default function BatchExecutionLayout({
  title,
  batchLabel,
  steps,
  activeStep,
  status,
  onStepSelect,
  onStart,
  onPause,
  onFinish,
  children,
}: BatchExecutionLayoutProps) {
  const statusConfig = STATUS_CONFIG[status]
  const isDone = status === 'done'

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar
        position="static"
        color="inherit"
        elevation={0}
        sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar sx={{ gap: 1.5 }}>
          <Typography variant="h6" component="h1" noWrap sx={{ fontWeight: 700, mr: 'auto' }}>
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            {batchLabel}
          </Typography>
          <Chip size="small" label={statusConfig.label} color={statusConfig.color} />
          <Button
            size="small"
            variant="outlined"
            onClick={onStart}
            disabled={status === 'running' || isDone}
          >
            Iniciar
          </Button>
          <Button size="small" variant="outlined" onClick={onPause} disabled={status !== 'running'}>
            Pausar
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={onFinish}
            disabled={status === 'idle' || isDone}
          >
            Finalizar
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          py: 2,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Stepper nonLinear activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label} completed={index < activeStep}>
              <StepButton onClick={() => onStepSelect?.(index)} disabled={!onStepSelect}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, bgcolor: 'background.default' }}>{children}</Box>
    </Box>
  )
}
