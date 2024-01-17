// disable eslint for this file
/* eslint-disable */
import { useState, useEffect } from 'react';
import { Box, Link, Typography, Stack, Select, FormControl, MenuItem, Grid, Chip, Dialog, Button, DialogActions, DialogContent, useMediaQuery, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import DownloadIcon from '@mui/icons-material/Download';
import DataObjectIcon from '@mui/icons-material/DataObject';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import * as Tracking from '../../Utils/Tracking';
import { fetchDataFromURL } from './DatasetFetcher';
import { RawDatasetType, getRawDatasetUrl } from '../../Utils/ApiUtils';

export default function DatasetDownloadDialog(props) {
  const { schoolID, initialSensorList } = props;

  const [sensorsDatasets, updateSensorsDatasets] = useState(initialSensorList);

  // Update initialSensorList once if sensorsDatasets is an empty object
  useEffect(() => {
    updateSensorsDatasets(initialSensorList);
  }, [initialSensorList]);

  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        onClick={() => {
          handleOpen();
          Tracking.sendEventAnalytics(Tracking.Events.rawDatasetButtonClicked);
        }}
        variant="contained"
      >
        <DataObjectIcon sx={{ fontSize: '1rem' }} />&nbsp;Raw Dataset
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        fullScreen={smallScreen}
        keepMounted
      >
        {(
          smallScreen &&
          <DialogActions justifyContent="flex-start">
            <Button autoFocus onClick={handleClose}>
              <ChevronLeftIcon sx={{ fontSize: '1rem' }} />Back
            </Button>
          </DialogActions>
        )}

        <DialogContent sx={{
          px: smallScreen ? 2 : 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'start',
          height: '100%'
        }}>
          <Chip label={schoolID ? `School: ${schoolID.toUpperCase()}` : "No School"} size="small" sx={{ mb: 1 }} />
          <Typography variant="h6" >
            Preview and download raw dataset(s)
          </Typography>

          <DatasetSelectorAndPreviewer
            sensorsDatasets={sensorsDatasets}
            updateSensorsDatasets={updateSensorsDatasets}
            smallScreen={smallScreen}
            schoolID={schoolID}
          />
          {
            sensorsDatasets &&
            <Typography variant="caption" sx={{ my: 3, fontStyle: 'italic' }} >
              These datasets are provided by CITIESair from sensors operated by CITIESair. Should you intend to utilize them for your project, research, or publication, we kindly request that you notify us at <Link href='mailto:nyuad.cities@nyu.edu'>nyuad.cities@nyu.edu</Link> to discuss citation requirements.
            </Typography>
          }
        </DialogContent>
      </Dialog>
    </>
  );
}

const DatasetSelectorAndPreviewer = (props) => {
  const { sensorsDatasets, updateSensorsDatasets, smallScreen, schoolID } = props;
  const [previewingDataset, setPreviewingDataset] = useState();

  // Preview the hourly type of the first sensor initially
  useEffect(() => {
    if (Object.keys(sensorsDatasets).length > 0 && !previewingDataset) {
      const firstSensor = Object.keys(sensorsDatasets)[0];
      const initialDatasetType = RawDatasetType.hourly;

      setPreviewingDataset({
        sensor: firstSensor,
        datasetType: initialDatasetType
      });

      const url = getRawDatasetUrl({
        school_id: schoolID,
        sensor_location_short: firstSensor,
        datasetType: initialDatasetType,
        isSample: true
      });

      fetchDataFromURL(url, 'csv')
        .then((data) => {
          const tmp = { ...sensorsDatasets };
          tmp[firstSensor].rawDatasets[initialDatasetType].sample = data;
          updateSensorsDatasets(tmp);
        })
        .catch((error) => console.log(error));
    }
  }, [sensorsDatasets]);

  return (
    <Grid container justifyContent="center" alignItems="start" spacing={3}>
      <Grid item sm={12} md={6}>
        <DatasetsTable
          schoolID={schoolID}
          sensorsDatasets={sensorsDatasets}
          updateSensorsDatasets={updateSensorsDatasets}
          smallScreen={smallScreen}
          previewingDataset={previewingDataset}
          setPreviewingDataset={setPreviewingDataset}
        />
      </Grid>
      <Grid item sm={12} md={6} maxWidth={smallScreen ? '100%' : 'unset'} sx={{ mt: 1 }}>
        <PreviewDataset
          sensorsDatasets={sensorsDatasets}
          updateSensorsDatasets={updateSensorsDatasets}
          previewingDataset={previewingDataset}
          schoolID={schoolID}
          smallScreen={smallScreen}
        />
      </Grid>
    </Grid>
  )
};

const DatasetsTable = (props) => {
  const { schoolID, sensorsDatasets, smallScreen, previewingDataset, setPreviewingDataset, updateSensorsDatasets } = props;
  return (
    <Table
      size="small"
      sx={{
        tableLayout: 'fixed',
        '& td, div, .MuiMenuItem-root': {
          fontSize: smallScreen ? '0.625rem' : '0.8rem'
        }
      }}
    >
      <TableHead>
        <TableRow>
          <TableCell sx={{ pl: 1 }}>
            Sensor Location
          </TableCell>
          <TableCell sx={{ width: smallScreen ? '9.5rem' : '11rem' }}>
            Dataset Type
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.keys(sensorsDatasets).map((location_short) => (
          <Dataset
            schoolID={schoolID}
            smallScreen={smallScreen}
            sensor={location_short}
            sensorsDatasets={sensorsDatasets}
            previewingDataset={previewingDataset}
            setPreviewingDataset={setPreviewingDataset}
            isPreviewing={location_short === previewingDataset?.sensor}
            updateSensorsDatasets={updateSensorsDatasets}
          />
        ))}
      </TableBody>
    </Table>
  )
}

const Dataset = (props) => {
  const { schoolID, sensorsDatasets, sensor, previewingDataset, setPreviewingDataset, isPreviewing, updateSensorsDatasets } = props;

  const [selectedDatasetType, setSelectedDatasetType] = useState(RawDatasetType.hourly);

  const handleDatasetTypeChange = (event) => {
    const selectedVal = event.target.value;

    setSelectedDatasetType(selectedVal);
    setPreviewingDataset({
      datasetType: selectedVal,
      sensor: sensor
    });

    fetchThisDataset(selectedVal);
  };

  const fetchThisDataset = (datasetType) => {
    // If this dataset version hasn't been fetched yet,
    // fetch it and append it into the object fetchedDatasets
    if (!sensorsDatasets[sensor].rawDatasets[datasetType].sample) {
      const url = getRawDatasetUrl({
        school_id: schoolID,
        sensor_location_short: sensorsDatasets[sensor].location_short,
        datasetType: datasetType,
        isSample: true
      });

      fetchDataFromURL(url, 'csv').then((data) => {
        const tmp = { ...sensorsDatasets };
        tmp[sensor].rawDatasets[datasetType].sample = data;
        updateSensorsDatasets(tmp);
      });
    }
  }

  const setThisSensorToPreview = () => {
    if (previewingDataset?.sensor !== sensor) {
      setPreviewingDataset({
        datasetType: selectedDatasetType,
        sensor: sensor
      });
      fetchThisDataset(selectedDatasetType);
    }
  }

  const theme = useTheme();

  return (
    <>
      <TableRow key={sensor}>
        <TableCell
          sx={{
            pl: 1,
            cursor: 'pointer',
            background: isPreviewing && theme.palette.background.NYUpurpleLight
          }}
          onClick={setThisSensorToPreview}>
          {sensorsDatasets[sensor].location_long}
        </TableCell>

        <TableCell
          sx={{
            position: 'relative',
            background: isPreviewing && theme.palette.background.NYUpurpleLight
          }}>
          <FormControl size="small">
            <Select
              value={selectedDatasetType}
              onChange={handleDatasetTypeChange}
              variant="standard"
              MenuProps={{ disablePortal: true }}
            >
              {Object.keys(sensorsDatasets[sensor].rawDatasets).map((datasetType, index) => (
                <MenuItem
                  key={index}
                  value={datasetType}
                >
                  <Stack direction="row" alignItems="center">
                    {datasetType.charAt(0).toUpperCase() + datasetType.slice(1).toLowerCase()}
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </TableCell>
      </TableRow >
    </>
  )
}

const PreviewDataset = (props) => {
  const { sensorsDatasets, updateSensorsDatasets, previewingDataset, schoolID, smallScreen } = props;
  const downloadDatasetName = `${schoolID}-${previewingDataset?.sensor}-${previewingDataset?.datasetType}.csv`;

  const theme = useTheme();

  const downloadPreviewingDataset = () => {
    if (!previewingDataset) return;

    const fetchedDataset = sensorsDatasets[previewingDataset.sensor].rawDatasets[RawDatasetType.hourly].full;

    // Fetch the full dataset if it has not been fetched before
    if (!fetchedDataset) {
      const url = getRawDatasetUrl({
        school_id: schoolID,
        sensor_location_short: previewingDataset.sensor,
        datasetType: previewingDataset.datasetType,
        isSample: false
      });

      fetchDataFromURL(url, 'csv').then((data) => {
        const tmp = { ...sensorsDatasets };
        tmp[previewingDataset.sensor].rawDatasets[previewingDataset.datasetType].full = data;
        updateSensorsDatasets(tmp);

        convertCSVforDownload(data);
      });
    }
    else {
      convertCSVforDownload(fetchedDataset);
    }

  };

  const convertCSVforDownload = (dataset) => {
    const blob = new Blob([dataset], { type: 'application/octet-stream' }); // create a Blob with the raw data
    const url = URL.createObjectURL(blob); // create a download link for the Blob
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = downloadDatasetName;
    document.body.appendChild(downloadLink);
    downloadLink.click(); // simulate a click on the download link
    URL.revokeObjectURL(url); // clean up by revoking the object URL
    document.body.removeChild(downloadLink);
  }

  const [formattedData, setFormattedData] = useState('');
  const [rowNumber, setRowNumber] = useState('');

  useEffect(() => {
    if (!previewingDataset) return;

    const csvData = sensorsDatasets[previewingDataset.sensor].rawDatasets[RawDatasetType.hourly].sample;
    if (!csvData) return;

    const lines = csvData.split('\n');

    const headers = lines[0].split(',');
    const rows = lines.slice(1);

    setRowNumber([
      "",
      ...rows.map(row => row.split(',')[0])
    ].join('\n'));

    setFormattedData([
      headers.slice(1).join(','), // Keep the headers for the rest of the columns
      ...rows.map(row => row.split(',').slice(1).join(',')) // Remove the first column from each row
    ].join('\n'));

  }, [previewingDataset, sensorsDatasets]);

  return (
    <Stack spacing={1}>
      <Box sx={{ '& *': { fontFamily: "monospace !important" } }}>
        <Stack direction="row">
          <Typography variant='body2' gutterBottom fontWeight={500}>
            {previewingDataset ?
              `Previewing: ${previewingDataset?.sensor} (${previewingDataset?.datasetType})`
              : 'Not previewing any dataset'}
          </Typography>
        </Stack>

        <Box
          component="pre"
          sx={{
            overflowX: 'auto',
            color: theme.palette.text.secondary,
            backgroundColor: theme.palette.customBackground,
            p: 2,
            pt: 1.5,
            borderRadius: theme.spacing(1),
            borderTopLeftRadius: 0,
            minHeight: "5rem",
            width: smallScreen ? '100%' : 'unset',
            marginTop: 0
          }}
        >
          <Stack direction="row" sx={{ fontSize: smallScreen ? '0.625rem !important' : '0.8rem !important' }}>
            <Box sx={{ mr: 2, userSelect: 'none' }}>
              {rowNumber}
            </Box>
            <Box>
              {formattedData}
            </Box>
          </Stack>
        </Box>
      </Box>
      <Box textAlign="center" >
        <Button
          variant="contained"
          sx={{
            textTransform: 'none',
            textAlign: 'left',
            lineHeight: 1.1,
            px: 1.5,
            py: 1
          }}
          onClick={() => {
            downloadPreviewingDataset();
            Tracking.sendEventAnalytics(Tracking.Events.rawDatasetDownloaded, {
              dataset_type: previewingDataset?.datasetType,
              sensor: previewingDataset?.sensor
            });
          }}
          disabled={!previewingDataset}
        >
          <DownloadIcon sx={{ fontSize: '1.25rem', mr: 0.5 }} />
          {previewingDataset ? downloadDatasetName : "No dataset available to download"}
        </Button>
      </Box>
    </Stack >
  )
}