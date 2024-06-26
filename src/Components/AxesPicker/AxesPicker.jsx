import React, { useContext, useEffect, useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Button, Stack, Grid, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAxesPicker } from '../../ContextProviders/AxesPickerContext';
import { ChartEndpoints, getCorrelationChartApiUrl } from '../../Utils/ApiFunctions/ApiUtils';
import { DashboardContext } from '../../ContextProviders/DashboardContext';
import { fetchDataFromURL } from '../../Utils/ApiFunctions/ApiCalls';

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
  const { currentSchoolID, setIndividualChartData } = useContext(DashboardContext);
  const { allowedAxes, selectedAxes, dataType } = props;
  const { hAxis, vAxis, setHAxis, setVAxis } = useAxesPicker();
  const [chartUrl, setChartUrl] = useState();
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [shouldDisableApplyButton, setShouldDisableApplyButton] = useState(true);

  useEffect(() => {
    const { hAxis: receivedHAxis, vAxis: receivedVAxis } = selectedAxes;
    if (!(receivedHAxis && receivedVAxis)) {
      setShouldDisableApplyButton(true);
      return;
    };

    if (!(hAxis === receivedHAxis && vAxis === receivedVAxis)) {
      setVAxis(receivedVAxis);
      setHAxis(receivedHAxis);
    }
  }, [selectedAxes]);

  const handleHAxisChange = (event) => {
    const newHAxis = event.target.value;
    setHAxis(newHAxis);
    if (newHAxis === vAxis) {
      setVAxis('');
    }
  };

  const handleVAxisChange = (event) => {
    setVAxis(event.target.value);
    if (event.target.value === hAxis) {
      setHAxis('');
    }
  };

  useEffect(() => {
    const { hAxis: receivedHAxis, vAxis: receivedVAxis } = selectedAxes;
    if (!(receivedHAxis && receivedVAxis)) {
      return;
    };

    setShouldDisableApplyButton(hAxis === receivedHAxis && vAxis === receivedVAxis);

  }, [hAxis, vAxis, selectedAxes]);

  const applyChanges = () => {
    if (!(vAxis && hAxis)) return;

    const newUrl = getCorrelationChartApiUrl({
      endpoint: ChartEndpoints.correlationDailyAverage,
      school_id: currentSchoolID,
      dataType: dataType,
      sensorX: hAxis,
      sensorY: vAxis
    });

    if (newUrl !== chartUrl) {
      setIsFetchingData(true);

      fetchDataFromURL({
        url: newUrl
      })
        .then((data) => {
          setIndividualChartData(5, data); // last chart -> chartIndex = 5
          setChartUrl(newUrl);
          setIsFetchingData(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12} sm="auto">
        <Stack direction="row" spacing={0}>
          <LeftSelect fullWidth size="small">
            <InputLabel id="x-axis-select-label">X Axis</InputLabel>
            <Select
              labelId="x-axis-select-label"
              value={hAxis || selectedAxes?.hAxis || null}
              label="X Axis"
              onChange={handleHAxisChange}
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
              onChange={handleVAxisChange}
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
          disabled={shouldDisableApplyButton}
        >
          {renderApplyButtonLabel()}
        </Button>
      </Grid>
    </Grid>
  );
};

export default AxesPicker;
