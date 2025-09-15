import { ToggleButton, ToggleButtonGroup, Typography, Stack } from '@mui/material';

import AggregationType from './AggregationType';

export default function AggregationTypeToggle({ aggregationType, setAggregationType }) {
  const handleChange = (_, newType) => {
    if (newType !== null) {
      setAggregationType(newType);
    }
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
    >
      <Typography variant="caption" display="block" color="text.secondary">
        AVERAGE
      </Typography>

      <ToggleButtonGroup
        color="primary"
        value={aggregationType}
        exclusive
        onChange={handleChange}
        aria-label="aggregation type toggle for graph average"
        size="small"
      >
        {Object.values(AggregationType).map(type => (
          <ToggleButton
            key={type}
            size="small"
            sx={{ textTransform: "capitalize !important", px: 1.25, py: 0.5 }}
            value={type}
            aria-label={type}
          >
            {type}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Stack>
  );
}