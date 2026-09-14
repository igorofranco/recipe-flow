import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import type { ChipProps } from '@mui/material'
import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import type { StepStatus } from '../domain'
import type { StepNode as StepNodeType } from './types'

const STATUS_META: Record<StepStatus, { label: string; color: ChipProps['color'] }> = {
  pending: { label: 'Pendente', color: 'default' },
  active: { label: 'Em andamento', color: 'primary' },
  done: { label: 'Concluída', color: 'success' },
  error: { label: 'Erro', color: 'error' },
}

const BORDER_COLOR: Record<StepStatus, string> = {
  pending: 'divider',
  active: 'primary.main',
  done: 'success.main',
  error: 'error.main',
}

export default function StepNode({ data, selected }: NodeProps<StepNodeType>) {
  const { step, status, isCurrent, isLast, index } = data
  const meta = STATUS_META[status]
  const requiredCount = step.requiredFields.filter((field) => field.required).length

  return (
    <Card
      variant="outlined"
      elevation={0}
      sx={(theme) => ({
        width: '100%',
        bgcolor: 'background.paper',
        borderWidth: status === 'active' || status === 'error' ? 2 : 1,
        borderColor: BORDER_COLOR[status],
        boxShadow: isCurrent ? theme.shadows[4] : selected ? theme.shadows[2] : 'none',
        overflow: 'hidden',
      })}
    >
      {index > 0 ? <Handle type="target" position={Position.Top} /> : null}

      {isCurrent ? <Box sx={{ height: 4, bgcolor: 'primary.main' }} /> : null}

      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
          <Chip size="small" variant="outlined" label={`Etapa ${step.order}`} />
          <Chip size="small" color={meta.color} label={meta.label} />
        </Stack>
        <Typography variant="subtitle2" component="p" sx={{ fontWeight: 700 }}>
          {step.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {isCurrent ? 'Etapa atual, ' : ''}
          {requiredCount} registro{requiredCount === 1 ? '' : 's'} obrigatório
          {requiredCount === 1 ? '' : 's'}
        </Typography>
      </CardContent>

      {isLast ? null : <Handle type="source" position={Position.Bottom} />}
    </Card>
  )
}
