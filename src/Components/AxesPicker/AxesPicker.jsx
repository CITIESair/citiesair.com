import React, { useContext, useEffect, useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Button, Stack, Grid, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAxesPicker } from '../../ContextProviders/AxesPickerContext';
import { ChartEndpoints, getCorrelationChartApiUrl } from '../../Utils/ApiUtils';
import { DashboardContext } from '../../ContextProviders/DashboardContext';
import { fetchDataFromURL } from '../DatasetDownload/DatasetFetcher';

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

  useEffect(() => {
    const { hAxis: receivedHAxis, vAxis: receivedVAxis } = selectedAxes;
    if (!(receivedHAxis && receivedVAxis)) return;

    if (!(hAxis === receivedHAxis && vAxis === receivedVAxis)) {
      setVAxis(receivedVAxis);
      setHAxis(receivedHAxis);
    }
  }, [selectedAxes]);

  const handleHAxisChange = (event) => {
    setHAxis(event.target.value);
    if (event.target.value === vAxis) {
      setVAxis('');
    }
  };

  const handleVAxisChange = (event) => {
    setVAxis(event.target.value);
    if (event.target.value === hAxis) {
      setHAxis('');
    }
  };

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
        url: newUrl,
        extension: 'json',
        needsAuthorization: true
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
                  key={option}
                  value={option}
                  disabled={option === vAxis}
                  sx={{ textTransform: 'capitalize' }}
                >
                  {option}
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
                  key={option}
                  value={option}
                  disabled={option === hAxis}
                  sx={{ textTransform: 'capitalize' }}
                >
                  {option}
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
          disabled={!(vAxis && hAxis)}
        >
          {renderApplyButtonLabel()}
        </Button>
      </Grid>
    </Grid>
  );
};

export default AxesPicker;
