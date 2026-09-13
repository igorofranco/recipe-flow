import type { Theme } from '@mui/material/styles'

export function flowStyles(theme: Theme) {
  const palette = theme.vars.palette

  return {
    height: '100%',
    '& .react-flow': {
      '--xy-background-color': palette.background.default,
      '--xy-background-pattern-dots-color': palette.action.disabled,
      '--xy-background-pattern-lines-color': palette.divider,
      '--xy-background-pattern-cross-color': palette.divider,

      '--xy-edge-stroke': palette.text.secondary,
      '--xy-edge-stroke-selected': palette.primary.main,
      '--xy-connectionline-stroke': palette.primary.main,

      '--xy-node-background-color': palette.background.paper,
      '--xy-node-color': palette.text.primary,
      '--xy-node-border': `1px solid ${palette.divider}`,
      '--xy-node-border-radius': theme.radius.field,
      '--xy-node-boxshadow-hover': theme.shadows[4],
      '--xy-node-boxshadow-selected': `0 0 0 2px ${palette.primary.main}`,

      '--xy-handle-background-color': palette.primary.main,
      '--xy-handle-border-color': palette.background.paper,

      '--xy-selection-background-color': palette.action.selected,
      '--xy-selection-border': `1px dotted ${palette.primary.main}`,

      '--xy-controls-button-background-color': palette.background.paper,
      '--xy-controls-button-background-color-hover': palette.action.hover,
      '--xy-controls-button-color': palette.text.primary,
      '--xy-controls-button-color-hover': palette.text.primary,
      '--xy-controls-button-border-color': palette.divider,
      '--xy-controls-box-shadow': theme.shadows[2],

      '--xy-minimap-background-color': palette.background.paper,
      '--xy-minimap-mask-background-color': palette.action.selected,
      '--xy-minimap-node-background-color': palette.primary.main,
      '--xy-minimap-node-stroke-color': palette.primary.main,

      '--xy-edge-label-background-color': palette.background.paper,
      '--xy-edge-label-color': palette.text.primary,
      '--xy-attribution-background-color': 'transparent',
    },
    '& .react-flow__attribution a': {
      color: palette.text.disabled,
    },
    '& .react-flow__node-input, & .react-flow__node-default, & .react-flow__node-output, & .react-flow__node-group':
      {
        fontSize: theme.typography.body2.fontSize,
        fontWeight: theme.typography.fontWeightMedium,
      },
    '& .react-flow__controls-button': {
      color: palette.text.primary,
    },
  }
}
