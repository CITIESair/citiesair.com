import { ToggleButton, ToggleButtonGroup, useMediaQuery, useTheme } from '@mui/material';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { keyframes } from '@mui/system';

import { AggregationType, type AggregationTypeValue } from '../../shared/constants';
import { AggregationTypeMetadata } from './DateRangePickerUtils';
import { AQI_Database } from '../../business-domain/air-quality/air-quality.database';

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
`;

type AggregationTypeToggleProps = {
  aggregationType: AggregationTypeValue;
  setAggregationType: (aggregationType: AggregationTypeValue) => void;
};

export default function AggregationTypeToggle({
  aggregationType,
  setAggregationType,
}: AggregationTypeToggleProps) {
  const theme = useTheme();

  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const extraSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (_: React.MouseEvent<HTMLElement>, newType: AggregationTypeValue | null) => {
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
      sx={{ height: '100%', [theme.breakpoints.down('sm')]: { width: '100%' } }}
      orientation={isLargeScreen ? 'vertical' : 'horizontal'}
    >
      {(Object.values(AggregationType) as AggregationTypeValue[]).map((type) => (
        <ToggleButton
          key={type}
          size="small"
          sx={{ textTransform: 'capitalize !important', px: 1.25, py: 0.5, color: 'text.secondary' }}
          value={type}
          aria-label={type}
        >
          {type === AggregationType.minute && (
            <RadioButtonCheckedIcon
              sx={{
                ...(isLargeScreen
                  ? {
                      position: 'absolute',
                      left: '50%',
                      transform: 'translateX(calc(-50% - 2.5rem))',
                    }
                  : {
                      mr: 0.3,
                    }),
                color: AQI_Database[3].color.Light,
                fontSize: '0.75rem',
                animation: `${pulse} 2s infinite ease-in-out`,
              }}
            />
          )}

          {AggregationTypeMetadata[type]?.label || ''}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
