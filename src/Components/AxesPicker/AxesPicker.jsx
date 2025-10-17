import { useContext, useEffect, useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Button, Stack, Grid, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAxesPicker } from '../../ContextProviders/AxesPickerContext';
import { ChartAPIendpointsOrder } from "../../API/Utils";
import { DashboardContext } from '../../ContextProviders/DashboardContext';

// Define custom styled components for shared border radius
const LeftSelect = styled(FormControl)(({ theme }) => ({
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  textTransform: 'capitalize',
  minWidth: '150px',
  maxWidth: '250px',
  '& .MuiOutlinedInput-root': {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderRight: 'none'
  },
  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderRight: `2px solid ${theme.palette.primary.main}`
  }
}));

const RightSelect = styled(FormControl)(({ theme }) => ({
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  textTransform: 'capitalize',
  minWidth: '150px',
  maxWidth: '250px',
  '& .MuiOutlinedInput-root': {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
}));

const AxesPicker = (props) => {
  const { currentSchoolID, setIndividualChartConfig } = useContext(DashboardContext);
  const { chartID, allowedAxes, selectedAxes, dataType } = props;
  const { hAxis, vAxis, setHAxis, setVAxis } = useAxesPicker();
  const [isFetchingData, setIsFetchingData] = useState(false);
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
      endpoint: ChartAPIendpointsOrder[chartID],
      school_id: currentSchoolID,
      queryParams: {
        dataType: dataType,
        sensorX: hAxis,
        sensorY: vAxis
      }
    });
  }

  const renderApplyButtonLabel = () => {
    return (
      isFetchingData ? <CircularProgress disableShrink size="1.4375rem" color="inherit" /> : "APPLY"
    )
  };

  // Disable option if the current dataType isn't in its allowedDataTypes array
  const shouldDisableOption = (option) => {
    return !option.allowedDataTypes.includes(dataType);
  }

  return (
    <Grid container item spacing={1} alignItems="center">
      <Grid item xs={12} sm="auto">
        <Stack direction="row" spacing={0}>
          <LeftSelect fullWidth size="small">
            <InputLabel id="x-axis-select-label">X Axis</InputLabel>
            <Select
              labelId="x-axis-select-label"
              value={hAxis || selectedAxes?.hAxis || null}
              label="X Axis"
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
          <RightSelect fullWidth size="small">
            <InputLabel id="y-axis-select-label">Y Axis</InputLabel>
            <Select
              labelId="y-axis-select-label"
              value={vAxis || selectedAxes?.vAxis || null}
              label="Y Axis"
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
        </Stack>
      </Grid>
      <Grid item xs={12} sm="auto">
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ height: "100%" }}
          onClick={applyChanges}
          disabled={shouldDisableApplyButton || isFetchingData}
        >
          {renderApplyButtonLabel()}
        </Button>
      </Grid>
    </Grid>
  );
};

export default AxesPicker;
