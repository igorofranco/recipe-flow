import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import type { ChipProps } from '@mui/material'
import type { RecipeStep, RecordValue, StepRecord, StepStatus } from '../domain'
import { validateStepRecord } from '../domain'
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
  isCurrent?: boolean
  canComplete?: boolean
  canReopen?: boolean
  onComplete?: () => void
  onReopen?: () => void
  onRecordChange: (fieldId: string, value: RecordValue) => void
}

export default function StepDetailsPanel({
  step,
  status,
  record,
  isCurrent = false,
  canComplete = false,
  canReopen = false,
  onComplete,
  onReopen,
  onRecordChange,
}: StepDetailsPanelProps) {
  const meta = STATUS_META[status]
  const errors =
    status === 'error'
      ? validateStepRecord(step, record ?? { stepId: step.id, status, values: {} }).errors
      : []
  const errorByField = new Map(errors.map((error) => [error.fieldId, error.message]))

  return (
    <Paper
      square
      elevation={0}
      sx={{
        width: '100%',
        flex: 1,
        minHeight: 0,
        border: 0,
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
          {isCurrent ? <Chip size="small" color="primary" label="Etapa atual" /> : null}
        </Stack>

        <Box>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
            {step.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {step.description}
          </Typography>
        </Box>

        {errors.length > 0 ? (
          <Alert severity="error">
            <AlertTitle>Registro incompleto ou inválido</AlertTitle>
            <Stack component="ul" spacing={0.5} sx={{ my: 0, pl: 2 }}>
              {errors.map((error) => {
                const field = step.requiredFields.find((item) => item.id === error.fieldId)

                return (
                  <Typography key={error.fieldId} component="li" variant="body2">
                    {field?.label ?? error.fieldId}: {error.message}
                  </Typography>
                )
              })}
            </Stack>
          </Alert>
        ) : null}

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
                error={errorByField.get(field.id)}
                onChange={(value) => onRecordChange(field.id, value)}
              />
            ))}
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="overline" color="text.secondary">
            {isCurrent ? 'Próxima ação' : 'Ação'}
          </Typography>

          {canComplete ? (
            <>
              <Button
                fullWidth
                variant="contained"
                color={status === 'error' ? 'error' : 'primary'}
                onClick={onComplete}
                sx={{ mt: 1 }}
              >
                Concluir etapa
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Preencha os registros obrigatórios para avançar.
              </Typography>
            </>
          ) : canReopen ? (
            <>
              <Button
                fullWidth
                variant="outlined"
                color="warning"
                onClick={onReopen}
                sx={{ mt: 1 }}
              >
                Reabrir etapa
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Reabrir permite corrigir o registro. As etapas seguintes voltam a pendente.
              </Typography>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Selecione a etapa atual para registrar e avançar.
            </Typography>
          )}
        </Box>
      </Stack>
    </Paper>
  )
}
