import { useContext, useEffect, useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Button, Grid, Stack, useMediaQuery, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAxesPicker } from '../../ContextProviders/AxesPickerContext';
import { DashboardContext } from '../../ContextProviders/DashboardContext';
import useChartData from '../../hooks/useChartData';
import useSchoolMetadata from '../../hooks/useSchoolMetadata';

const SELECT_MIN_WIDTH = "150px";

// Define custom styled components for shared border radius
const StyledSelect = styled(FormControl)(({ theme, isForHorizontalAxis = true }) => ({
  textTransform: 'capitalize',
  minWidth: SELECT_MIN_WIDTH,

  // Only between sm–lg: display the StyledSelects stitched horizontally (merge right side)
  [theme.breakpoints.between('sm', 'lg')]: {
    '& .MuiOutlinedInput-root': {
      ...(isForHorizontalAxis
        ? {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }
        : {
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        }),
    }
  },

  ...(isForHorizontalAxis === true && {
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderRight: `2px solid ${theme.palette.primary.main}`,
    }
  })
}));

const AxesPicker = (props) => {
  const { allChartsConfigs, setIndividualChartConfig } = useContext(DashboardContext);
  const { data: schoolMetadata } = useSchoolMetadata();
  const allowedItemsForAxes = schoolMetadata?.sensors || [];

  const { chartID, selectedAxes, dataType } = props;
  const { hAxis, vAxis, setHAxis, setVAxis } = useAxesPicker();

  const { isFetching } = useChartData({ chartID });
  const [shouldDisableApplyButton, setShouldDisableApplyButton] = useState(true);

  useEffect(() => {
    const { hAxis: receivedHAxis, vAxis: receivedVAxis } = selectedAxes || {};

    if (receivedHAxis) setHAxis(receivedHAxis);
    if (receivedVAxis) setVAxis(receivedVAxis);
  }, [selectedAxes]);

  useEffect(() => {
    const { hAxis: receivedHAxis, vAxis: receivedVAxis } = selectedAxes;
    if (!(receivedHAxis && receivedVAxis)) {
      return;
    };

    setShouldDisableApplyButton(hAxis === receivedHAxis && vAxis === receivedVAxis);

  }, [hAxis, vAxis, selectedAxes]);

  const applyChanges = () => {
    if (!(vAxis && hAxis)) return;

    setIndividualChartConfig(chartID, {
      ...allChartsConfigs[chartID],
      queryParams: {
        dataType: dataType,
        sensorX: hAxis,
        sensorY: vAxis
      }
    });
  }

  // Disable option if the current dataType isn't in its allowedDataTypes array
  const shouldDisableOption = (option) => {
    return !option.allowedDataTypes.includes(dataType);
  }

  const isLargeScreen = useMediaQuery(theme => theme.breakpoints.up('lg'));

  return (
    <Stack direction="column" alignItems="stretch" gap={1.5} width="100%">
      {
        isLargeScreen ? <Typography color="text.secondary" sx={{ textTransform: "uppercase" }}>Sensor Pair Selection</Typography> : null
      }
      <Grid container item rowGap={1.5} columnGap={1} alignItems="center">
        <Grid container item rowGap={1.5}>
          <Grid item xs={12} sm="auto" lg>
            <StyledSelect fullWidth size="small" isForHorizontalAxis={true}>
              <InputLabel id="x-axis-select-label">Horizontal Axis</InputLabel>
              <Select
                labelId="x-axis-select-label"
                value={hAxis || selectedAxes?.hAxis || null}
                label="Horizontal Axis"
                onChange={(event) => {
                  setHAxis(event.target.value)
                }}
                autoWidth
              >
                {allowedItemsForAxes.map(item => (
                  <MenuItem
                    key={item.location_short}
                    value={item.location_short}
                    disabled={item.location_short === vAxis || shouldDisableOption(item)}
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {item.location_short}{shouldDisableOption(item) && " (No Data)"}
                  </MenuItem>
                ))}
              </Select>
            </StyledSelect>
          </Grid>
          <Grid item xs={12} sm="auto" lg>
            <StyledSelect fullWidth size="small" isForHorizontalAxis={false}>
              <InputLabel id="y-axis-select-label">Vertical Axis</InputLabel>
              <Select
                labelId="y-axis-select-label"
                value={vAxis || selectedAxes?.vAxis || null}
                label="Vertical Axis"
                onChange={(event) => {
                  setVAxis(event.target.value)
                }}
                autoWidth
              >
                {allowedItemsForAxes.map(item => (
                  <MenuItem
                    key={item.location_short}
                    value={item.location_short}
                    disabled={item.location_short === hAxis || shouldDisableOption(item)}
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {item.location_short}{shouldDisableOption(item) && " (No Data)"}
                  </MenuItem>
                ))}
              </Select>
            </StyledSelect>
          </Grid>
        </Grid>

        <Grid item xs={12} sm="auto" lg>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ height: "100%" }}
            onClick={applyChanges}
            disabled={shouldDisableApplyButton || isFetching}
          >
            APPLY
          </Button>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default AxesPicker;
