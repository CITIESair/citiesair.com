import { useContext, useEffect, useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Button, Grid, CircularProgress, Stack, useMediaQuery, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAxesPicker } from '../../ContextProviders/AxesPickerContext';
import { ChartAPIendpointsOrder } from "../../API/Utils";
import { DashboardContext } from '../../ContextProviders/DashboardContext';
import useChartData from '../../hooks/useChartData';

const SELECT_MIN_WIDTH = "150px";

// Define custom styled components for shared border radius
const LeftSelect = styled(FormControl)(({ theme }) => ({
  textTransform: 'capitalize',
  minWidth: SELECT_MIN_WIDTH,

  // Only between sm–lg: stitched (merge right side)
  [theme.breakpoints.between('sm', 'lg')]: {
    '& .MuiOutlinedInput-root': {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderRight: 'none',
    },
  },

  // Focused border fix (optional highlight)
  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderRight: `2px solid ${theme.palette.primary.main}`,
  },
}));


const RightSelect = styled(FormControl)(({ theme }) => ({
  textTransform: 'capitalize',
  minWidth: SELECT_MIN_WIDTH,

  // Only between sm–lg: stitched (merge left side)
  [theme.breakpoints.between('sm', 'lg')]: {
    '& .MuiOutlinedInput-root': {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderLeft: 'none',
    },
  },
}));



const AxesPicker = (props) => {
  const { currentSchoolID, allChartsConfigs, setIndividualChartConfig } = useContext(DashboardContext);
  const { chartID, allowedAxes, selectedAxes, dataType } = props;
  const { hAxis, vAxis, setHAxis, setVAxis } = useAxesPicker();

  const { isFetching } = useChartData(chartID);
  const [shouldDisableApplyButton, setShouldDisableApplyButton] = useState(true);

  useEffect(() => {
    const { hAxis: receivedHAxis, vAxis: receivedVAxis } = selectedAxes || {};

    if (!(receivedHAxis && receivedVAxis)) {
      setShouldDisableApplyButton(true);
      return;
    }

    setHAxis(receivedHAxis);
    setVAxis(receivedVAxis);
  }, [selectedAxes, setHAxis, setVAxis]);

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
            <LeftSelect fullWidth size="small">
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
                {allowedAxes?.map(option => (
                  <MenuItem
                    key={option.sensor}
                    value={option.sensor}
                    disabled={option.sensor === vAxis || shouldDisableOption(option)}
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {option.sensor}{shouldDisableOption(option) && " (No Data)"}
                  </MenuItem>
                ))}
              </Select>
            </LeftSelect>
          </Grid>
          <Grid item xs={12} sm="auto" lg>
            <RightSelect fullWidth size="small">
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
                {allowedAxes?.map(option => (
                  <MenuItem
                    key={option.sensor}
                    value={option.sensor}
                    disabled={option.sensor === hAxis || shouldDisableOption(option)}
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {option.sensor}{shouldDisableOption(option) && " (No Data)"}
                  </MenuItem>
                ))}
              </Select>
            </RightSelect>
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
