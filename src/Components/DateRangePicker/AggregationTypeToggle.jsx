import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import AggregationType from './AggregationType';
import { AggregationTypeMetadata } from './DateRangePickerUtils';

export default function AggregationTypeToggle({ aggregationType, setAggregationType }) {
  const handleChange = (_, newType) => {
    if (newType !== null) {
      setAggregationType(newType);
    }
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={aggregationType}
      exclusive
      onChange={handleChange}
      aria-label="aggregation type toggle for graph average"
      size="small"
      fullWidth
      sx={{ height: "100%" }}
    >
      {Object.values(AggregationType).map(type => (
        <ToggleButton
          key={type}
          size="small"
          sx={{ textTransform: "capitalize !important", px: 1.25, py: 0.5 }}
          value={type}
          aria-label={type}
        >
          {AggregationTypeMetadata[type]?.label || ""}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}