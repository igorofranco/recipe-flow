import { Box, Chip, Divider, Paper, Stack, Typography } from '@mui/material'
import type { ChipProps } from '@mui/material'
import type { RecipeStep, RecordValue, StepRecord, StepStatus } from '../domain'
import RecordFieldInput from './RecordFieldInput'

const STATUS_META: Record<StepStatus, { label: string; color: ChipProps['color'] }> = {
  pending: { label: 'Pendente', color: 'default' },
  active: { label: 'Em andamento', color: 'primary' },
  done: { label: 'Concluída', color: 'success' },
  error: { label: 'Erro', color: 'error' },
}

export interface StepDetailsPanelProps {
  step: RecipeStep
  status: StepStatus
  record?: StepRecord
  onRecordChange: (fieldId: string, value: RecordValue) => void
}

export default function StepDetailsPanel({
  step,
  status,
  record,
  onRecordChange,
}: StepDetailsPanelProps) {
  const meta = STATUS_META[status]

  return (
    <Paper
      square
      elevation={0}
      sx={{
        width: { xs: '100%', md: 360 },
        flexShrink: 0,
        borderLeft: { xs: 0, md: 1 },
        borderTop: { xs: 1, md: 0 },
        borderColor: 'divider',
        bgcolor: 'background.paper',
        overflowY: 'auto',
      }}
    >
      <Stack spacing={2} sx={{ p: 2 }}>
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{ flexWrap: 'wrap', alignItems: 'center' }}
        >
          <Chip size="small" variant="outlined" label={`Etapa ${step.order}`} />
          <Chip size="small" color={meta.color} label={meta.label} />
        </Stack>

        <Box>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
            {step.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {step.description}
          </Typography>
        </Box>

        <Divider />

        <Box>
          <Typography variant="overline" color="text.secondary">
            Parâmetros
          </Typography>
          <Stack spacing={0.5} sx={{ mt: 0.5 }}>
            {step.parameters.map((parameter) => (
              <Stack
                key={parameter.id}
                direction="row"
                spacing={2}
                sx={{ justifyContent: 'space-between' }}
              >
                <Typography variant="body2" color="text.secondary">
                  {parameter.label}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {parameter.value}
                  {parameter.unit ? ` ${parameter.unit}` : ''}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="overline" color="text.secondary">
            Registro da etapa
          </Typography>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {step.requiredFields.map((field) => (
              <RecordFieldInput
                key={field.id}
                field={field}
                value={record?.values[field.id]}
                onChange={(value) => onRecordChange(field.id, value)}
              />
            ))}
          </Stack>
        </Box>
      </Stack>
    </Paper>
  )
}
