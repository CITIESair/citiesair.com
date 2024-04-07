import { ToggleButton, ToggleButtonGroup, Typography, Stack } from '@mui/material';

import AggregationType from './AggregationType';

export default function AggregationTypeToggle({ aggregationType, setAggregationType, smallScreen }) {
  const handleChange = (event, newType) => {
    setAggregationType(newType);
  };

  return (
    <Stack
      direction={smallScreen ? "row" : "column"}
      alignItems={smallScreen ? "center" : "start"}
      spacing={smallScreen === true && 1}
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
        <ToggleButton
          size="small"
          sx={{ textTransform: "capitalize !important", px: 1.25, py: 0.5 }}
          value={AggregationType.hourly}
          aria-label={AggregationType.hourly}
        >
          {AggregationType.hourly}
        </ToggleButton>
        <ToggleButton
          size="small"
          sx={{ textTransform: "capitalize !important", px: 1.25, py: 0.5 }}
          value={AggregationType.daily}
          aria-label={AggregationType.daily}
        >
          {AggregationType.daily}
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack >
  );
}