import { FormControlLabel, InputAdornment, MenuItem, Switch, TextField } from '@mui/material'
import type { RecordField, RecordValue } from '../domain'

export interface RecordFieldInputProps {
  field: RecordField
  value: RecordValue | undefined
  onChange: (value: RecordValue) => void
}

export default function RecordFieldInput({ field, value, onChange }: RecordFieldInputProps) {
  switch (field.kind) {
    case 'text':
      return (
        <TextField
          fullWidth
          size="small"
          label={field.label}
          required={field.required}
          helperText={field.helperText}
          multiline={field.multiline}
          minRows={field.multiline ? 3 : undefined}
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(event.target.value)}
        />
      )

    case 'number':
      return (
        <TextField
          fullWidth
          size="small"
          type="number"
          label={field.label}
          required={field.required}
          helperText={field.helperText}
          value={typeof value === 'number' || value === '' ? value : ''}
          onChange={(event) => {
            const next = event.target.value
            onChange(next === '' ? '' : Number(next))
          }}
          slotProps={{
            htmlInput: { min: field.min, max: field.max, step: 'any' },
            input: field.unit
              ? { endAdornment: <InputAdornment position="end">{field.unit}</InputAdornment> }
              : undefined,
          }}
        />
      )

    case 'select':
      return (
        <TextField
          fullWidth
          select
          size="small"
          label={field.label}
          required={field.required}
          helperText={field.helperText}
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(event.target.value)}
        >
          {field.options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      )

    case 'boolean':
      return (
        <FormControlLabel
          control={
            <Switch checked={value === true} onChange={(event) => onChange(event.target.checked)} />
          }
          label={field.label}
        />
      )
  }
}
