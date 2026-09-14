import { Card, CardContent, Chip, Stack, Typography } from '@mui/material'
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

export default function StepNode({ data, selected }: NodeProps<StepNodeType>) {
  const { step, status, isCurrent, isLast, index } = data
  const meta = STATUS_META[status]
  const requiredCount = step.requiredFields.filter((field) => field.required).length

  return (
    <Card
      variant="outlined"
      elevation={0}
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        borderWidth: isCurrent ? 2 : 1,
        borderColor: isCurrent ? 'primary.main' : 'divider',
        boxShadow: selected ? 3 : 'none',
      }}
    >
      {index > 0 ? <Handle type="target" position={Position.Top} /> : null}

      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
          <Chip size="small" variant="outlined" label={`Etapa ${step.order}`} />
          <Chip size="small" color={meta.color} label={meta.label} />
        </Stack>
        <Typography variant="subtitle2" component="p" sx={{ fontWeight: 700 }}>
          {step.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {requiredCount} registro{requiredCount === 1 ? '' : 's'} obrigatório
          {requiredCount === 1 ? '' : 's'}
        </Typography>
      </CardContent>

      {isLast ? null : <Handle type="source" position={Position.Bottom} />}
    </Card>
  )
}
