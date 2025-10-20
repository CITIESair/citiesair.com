import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { keyframes } from '@mui/system';

import AggregationType from './AggregationType';
import { AggregationTypeMetadata } from './DateRangePickerUtils';
import { useContext } from 'react';
import { DashboardContext } from '../../ContextProviders/DashboardContext';
import { KAMPALA } from '../../Utils/GlobalVariables';
import { useTheme } from '@emotion/react';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { AQI_Database } from '../../Utils/AirQuality/AirQualityIndexHelper';

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
`;

export default function AggregationTypeToggle({ aggregationType, setAggregationType }) {
  const { currentSchoolID } = useContext(DashboardContext);
  const theme = useTheme();

  const isLargeScreen = useMediaQuery(theme => theme.breakpoints.up('lg'));
  const extraSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

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
      fullWidth={extraSmallScreen}
      color="primary"
      value={aggregationType}
      exclusive
      onChange={handleChange}
      aria-label="aggregation type toggle for graph average"
      size="small"
      sx={{ height: "100%", [theme.breakpoints.down('sm')]: { width: '100%' } }}
      orientation={isLargeScreen ? "vertical" : "horizontal"}
    >
      {Object.values(aggregationTypesToShow).map(type => (
        <ToggleButton
          key={type}
          size="small"
          sx={{ textTransform: "capitalize !important", px: 1.25, py: 0.5, color: "text.secondary" }}
          value={type}
          aria-label={type}
        >
          {/* Show pulsing red icon if type === AggregationType.minute */}
          {type === AggregationType.minute && (
            <RadioButtonCheckedIcon
              sx={{
                ...(isLargeScreen ? {
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(calc(-50% - 2.5rem))',
                } : {
                  mr: 0.3,
                }),
                color: AQI_Database[3].color.Light,
                fontSize: "0.75rem",
                animation: `${pulse} 2s infinite ease-in-out`,
              }}
            />
          )}

          {AggregationTypeMetadata[type]?.label || ""}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}