import { Box, Divider, Stack, Typography } from '@mui/material'
import { AUDIT_ACTION_LABELS, formatAuditTimestamp } from '../domain'
import type { AuditEvent } from '../domain'

export interface AuditTrailPanelProps {
  events: AuditEvent[]
}

export default function AuditTrailPanel({ events }: AuditTrailPanelProps) {
  const orderedEvents = [...events].reverse()

  return (
    <Box
      sx={{
        borderTop: 1,
        borderColor: 'divider',
        maxHeight: 280,
        overflowY: 'auto',
        bgcolor: 'background.paper',
      }}
    >
      <Stack spacing={1.5} sx={{ p: 2 }}>
        <Typography variant="overline" color="text.secondary">
          Trilha de auditoria
        </Typography>

        {orderedEvents.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Nenhum evento registrado.
          </Typography>
        ) : (
          orderedEvents.map((event, index) => (
            <Box key={event.id}>
              {index > 0 ? <Divider sx={{ mb: 1.5 }} /> : null}
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {AUDIT_ACTION_LABELS[event.action]}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {formatAuditTimestamp(event.timestamp)} · {event.actor}
              </Typography>
              {event.detail ? (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {event.detail}
                </Typography>
              ) : null}
            </Box>
          ))
        )}
      </Stack>
    </Box>
  )
}
