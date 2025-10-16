import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import AggregationType from './AggregationType';
import { AggregationTypeMetadata } from './DateRangePickerUtils';
import { useContext } from 'react';
import { DashboardContext } from '../../ContextProviders/DashboardContext';
import { KAMPALA } from '../../Utils/GlobalVariables';

export default function AggregationTypeToggle({ aggregationType, setAggregationType }) {
  const { currentSchoolID } = useContext(DashboardContext);

  // Filter out AggregationType.minute if the school is Kampala
  const aggregationTypesToShow = Object.values(AggregationType).filter(type => {
    if (currentSchoolID === KAMPALA && type === AggregationType.minute) {
      return false;
    }
    return true;
  });

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
      {Object.values(aggregationTypesToShow).map(type => (
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