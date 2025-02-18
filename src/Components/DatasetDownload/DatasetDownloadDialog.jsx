// disable eslint for this file
/* eslint-disable */
import { useState, useEffect, useContext } from 'react';
import { Box, Link, Typography, Stack, Select, FormControl, MenuItem, Grid, Button, useMediaQuery, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import DownloadIcon from '@mui/icons-material/Download';
import DataObjectIcon from '@mui/icons-material/DataObject';

import * as Tracking from '../../Utils/Tracking';
import { fetchDataFromURL } from '../../API/ApiFetch';
import { SupportedFetchExtensions } from "../../API/Utils";
import { getRawDatasetUrl } from '../../API/ApiUrls';
import { RawDatasetType } from "../../API/Utils";
import LoadingAnimation from '../LoadingAnimation';

import { DashboardContext } from '../../ContextProviders/DashboardContext';

import CustomDialog from '../CustomDialog/CustomDialog';
import { CITIESair } from '../../Utils/GlobalVariables';
import useLoginHandler from '../Account/useLoginHandler';

export default function DatasetDownloadDialog({ onButtonClick }) {
  const { handleRestrictedAccess } = useLoginHandler(onButtonClick);

  const { currentSchoolID, current } = useContext(DashboardContext);

  const [sensorsDatasets, updateSensorsDatasets] = useState({});

  const [previewingDataset, setPreviewingDataset] = useState("placeholder");

  // Construct the structure of sensorsDatasets based on current data
  useEffect(() => {
    if (!current) return;

    const sensorsDatasets = current
      .filter(item => item && item.sensor)  // Filter out null or undefined items and sensors
      .reduce((acc, item) => {
        // Use location_short as the key for each sensor
        const key = item.sensor.location_short;
        acc[key] = {
          location_type: item.sensor.location_type,
          location_short: item.sensor.location_short,
          location_long: item.sensor.location_long,
          last_seen: item.sensor.last_seen.split('T')[0],
          rawDatasets: Object.keys(RawDatasetType).reduce((datasetAcc, datasetKey) => {
            datasetAcc[RawDatasetType[datasetKey]] = {
              sample: null,
              full: null
            };
            return datasetAcc;
          }, {})
        };
        return acc;
      }, {});

    updateSensorsDatasets(sensorsDatasets);
  }, [current]);

  return (
    <CustomDialog
      buttonIcon={<DataObjectIcon sx={{ fontSize: '1rem' }} />}
      buttonLabel="Dataset"
      trackingEvent={Tracking.Events.rawDatasetButtonClicked}
      dialogTitle="Preview and download raw dataset(s)"
      dialogOpenHandler={((action) => {
        setPreviewingDataset(null);
        handleRestrictedAccess(action);
      })}
    >
      <DatasetSelectorAndPreviewer
        sensorsDatasets={sensorsDatasets}
        updateSensorsDatasets={updateSensorsDatasets}
        previewingDataset={previewingDataset}
        setPreviewingDataset={setPreviewingDataset}
        schoolID={currentSchoolID}
      />
      {
        sensorsDatasets &&
        <Typography variant="caption" sx={{ my: 2, fontStyle: 'italic', display: "block" }} >
          These datasets are provided by {CITIESair} from sensors operated by {CITIESair}. Should you intend to utilize them for your project, research, or publication, we kindly request that you notify us at <Link href='mailto:nyuad.cities@nyu.edu'>nyuad.cities@nyu.edu</Link> to discuss citation requirements.
        </Typography>
      }
    </CustomDialog>
  );
}

const DatasetSelectorAndPreviewer = (props) => {
  const { sensorsDatasets, updateSensorsDatasets, previewingDataset, setPreviewingDataset, schoolID } = props;

  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Preview the hourly type of the first sensor initially
  useEffect(() => {
    if (Object.keys(sensorsDatasets).length > 0 && !previewingDataset) {
      const firstSensor = Object.keys(sensorsDatasets)[0];
      const initialDatasetType = RawDatasetType.hourly;

      setPreviewingDataset({
        sensor: firstSensor,
        datasetType: initialDatasetType
      });

      // If this dataset has been fetched before, early return
      if (sensorsDatasets[firstSensor].rawDatasets[initialDatasetType].sample) return;

      const url = getRawDatasetUrl({
        school_id: schoolID,
        sensor_location_short: firstSensor,
        datasetType: initialDatasetType,
        isSample: true
      });

      fetchDataFromURL({ url, extension: SupportedFetchExtensions.csv, needsAuthorization: true })
        .then((data) => {
          const tmp = { ...sensorsDatasets };
          tmp[firstSensor].rawDatasets[initialDatasetType].sample = data;
          updateSensorsDatasets(tmp);
        })
        .catch((error) => console.log(error));
    }
  }, [sensorsDatasets, previewingDataset]);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="start"
      spacing={smallScreen ? 1 : 2}
      sx={{ mt: 0, overflowY: 'scroll', overflowX: 'hidden' }}
    >
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
        tableLayout: 'fixed'
      }}
    >
      <TableHead>
        <TableRow>
          <TableCell sx={{ pl: 1 }}>
            Sensor Location
          </TableCell>
          <TableCell sx={{ width: smallScreen ? '9.5rem' : '11rem' }}>
            Average Period
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sensorsDatasets && Object.keys(sensorsDatasets).map((location_short) => (
          <Dataset
            key={location_short}
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

  useEffect(() => {
    if (selectedDatasetType !== RawDatasetType.hourly) setSelectedDatasetType(RawDatasetType.hourly);
  }, [schoolID])

  const handleDatasetTypeChange = (event) => {
    const selectedVal = event.target.value;
    setSelectedDatasetType(selectedVal);
    setPreviewingDataset({ datasetType: selectedVal, sensor });
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

      fetchDataFromURL({ url, extension: SupportedFetchExtensions.csv, needsAuthorization: true })
        .then((data) => {
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
              {Object.keys(sensorsDatasets[sensor].rawDatasets).reverse().map((datasetType, index) => (
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
  const theme = useTheme();

  const [previewingDatasetName, setPreviewingDatasetName] = useState("Not previewing any dataset");
  const [csvFileName, setCsvFileName] = useState("No dataset");
  const [isDatasetLoading, setIsDatasetLoading] = useState(false);

  const downloadPreviewingDataset = () => {
    if (!previewingDataset) return;

    const fetchedDataset = sensorsDatasets[previewingDataset.sensor].rawDatasets[previewingDataset.datasetType].full;

    // Fetch the full dataset if it has not been fetched before
    if (!fetchedDataset) {
      const url = getRawDatasetUrl({
        school_id: schoolID,
        sensor_location_short: previewingDataset.sensor,
        datasetType: previewingDataset.datasetType,
        isSample: false
      });

      fetchDataFromURL({ url, extension: SupportedFetchExtensions.csv, needsAuthorization: true }).then((data) => {
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
    downloadLink.download = csvFileName;
    document.body.appendChild(downloadLink);
    downloadLink.click(); // simulate a click on the download link
    URL.revokeObjectURL(url); // clean up by revoking the object URL
    document.body.removeChild(downloadLink);
  }

  const [formattedData, setFormattedData] = useState('');
  const [rowNumber, setRowNumber] = useState('');

  useEffect(() => {
    // If no dataset is chosen to be previewed, early return
    if (!previewingDataset) return;

    // Update previewing dataset name regardless if the dataset preview has finished loading
    setPreviewingDatasetName(`Previewing: ${previewingDataset.sensor} (${previewingDataset.datasetType})`);

    // Get the raw dataset
    const csvData = sensorsDatasets[previewingDataset.sensor]?.rawDatasets[previewingDataset.datasetType]?.sample;

    // If it is empty, then it hasn't been loaded yet
    if (!csvData) {
      setRowNumber(null);
      setFormattedData(null);
      setCsvFileName("Loading...");
      setIsDatasetLoading(true);
      return;
    };

    if (isDatasetLoading) setIsDatasetLoading(false);

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

    // Get the second column of the last row and extract the date part to set the csv's file name
    let dateString;
    if (rows.length > 0) {
      const lastRow = rows[rows.length - 1];
      const columns = lastRow.split(',');
      if (columns.length >= 2) {
        const dateTimeString = columns[1]; // Get the second column
        dateString = dateTimeString.split('T')[0]; // Extract the date part
      }
    }

    const csvFileName = `${schoolID}-${previewingDataset.sensor}-${previewingDataset.datasetType}-${dateString}.csv`;
    setCsvFileName(csvFileName);
  }, [previewingDataset, sensorsDatasets]);

  return (
    <Stack spacing={1}>
      <Box sx={{ '& *': { fontFamily: "monospace !important" } }}>
        <Stack direction="row">
          <Typography variant='body2' gutterBottom fontWeight={500}>
            {previewingDatasetName}
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
            borderRadius: 1,
            height: smallScreen ? '11.8rem' : '14rem',
            width: smallScreen ? '100%' : 'unset',
            marginTop: 0
          }}
        >
          <Stack
            direction="row"
            sx={{ fontSize: '0.75rem' }}
          >
            {
              formattedData ?
                <>
                  <Box sx={{ mr: 2, userSelect: 'none' }}>
                    {rowNumber}
                  </Box>
                  <Box>
                    {formattedData}
                  </Box>
                </>
                :
                <LoadingAnimation optionalText="Loading" />
            }
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
          disabled={isDatasetLoading}
        >
          <DownloadIcon sx={{ fontSize: '1.25rem', mr: 0.5 }} />
          {csvFileName}
        </Button>
      </Box>
    </Stack >
  )
}