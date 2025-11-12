import { useState, useEffect, useContext } from 'react';
import { Box, Link, Typography, Stack, Select, FormControl, MenuItem, Grid, Button, useMediaQuery, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/Download';
import DataObjectIcon from '@mui/icons-material/DataObject';
import * as Tracking from '../../Utils/Tracking';
import LoadingAnimation from '../LoadingAnimation';
import { DashboardContext } from '../../ContextProviders/DashboardContext';
import CustomDialog from '../CustomDialog/CustomDialog';
import { CITIESair } from '../../Utils/GlobalVariables';
import useLoginHandler from '../Account/useLoginHandler';
import AggregationType from '../DateRangePicker/AggregationType';
import useCurrentSensorsData from '../../hooks/useCurrentSensorsData';
import useDatasetDownload from '../../hooks/useDatasetDownload';
import { enqueueSnackbar } from 'notistack';
import { SnackbarMetadata } from '../../Utils/SnackbarMetadata';

export default function DatasetDownloadDialog({ onButtonClick }) {
  const { handleRestrictedAccess } = useLoginHandler(onButtonClick);

  const { data: currentSensorsData } = useCurrentSensorsData();

  const [sensorsList, setSensorsList] = useState({});
  const [previewingDataset, setPreviewingDataset] = useState();

  // Construct the structure of sensorsList based on current data
  useEffect(() => {
    if (!currentSensorsData) return;

    const sensorsList = currentSensorsData
      .filter(item => item && item.sensor)  // Filter out null or undefined items and sensors
      .reduce((acc, item) => {
        acc[item.sensor.location_short] = {
          location_short: item.sensor.location_short,
          location_long: item.sensor.location_long
        };
        return acc;
      }, {});

    setSensorsList(sensorsList);

    // Preview the hourly type of the first sensor initially
    if (Object.keys(sensorsList).length > 0 && !previewingDataset) {
      setPreviewingDataset({
        sensor: Object.keys(sensorsList)[0],
        aggregationType: AggregationType.hour
      });
    }
  }, [currentSensorsData, previewingDataset]);

  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
      <Grid
        container
        justifyContent="center"
        alignItems="start"
        spacing={smallScreen ? 1 : 2}
        sx={{ mt: 0, overflowY: 'scroll', overflowX: 'hidden' }}
      >
        {/* Dataset selection table */}
        <Grid item sm={12} md={6}>
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
              {sensorsList && Object.keys(sensorsList).map((location_short) => (
                <Dataset
                  key={location_short}
                  sensor={location_short}
                  sensorsList={sensorsList}
                  previewingDataset={previewingDataset}
                  setPreviewingDataset={setPreviewingDataset}
                  isPreviewing={location_short === previewingDataset?.sensor}
                  setSensorsList={setSensorsList}
                />
              ))}
            </TableBody>
          </Table>
        </Grid>

        {/* Dataset previewing panel */}
        <Grid item sm={12} md={6} maxWidth={smallScreen ? '100%' : 'unset'} sx={{ mt: 1 }}>
          <PreviewDataset
            sensorsList={sensorsList}
            setSensorsList={setSensorsList}
            previewingDataset={previewingDataset}
          />
        </Grid>
      </Grid>

      {/* Ack */}
      <Typography variant="caption" sx={{ my: 2, fontStyle: 'italic', display: "block" }} >
        Raw datasets are provided by {CITIESair} from sensors operated by {CITIESair}. Should you intend to utilize them for your project, research, or publication, we kindly request that you notify us at <Link href='mailto:nyuad.cities@nyu.edu'>nyuad.cities@nyu.edu</Link> to discuss citation requirements.
      </Typography>
    </CustomDialog>
  );
}

const Dataset = (props) => {
  const { sensorsList, sensor, previewingDataset, setPreviewingDataset, isPreviewing } = props;
  const [aggregationType, setAggregationType] = useState(AggregationType.hour);
  const { currentSchoolID } = useContext(DashboardContext);
  const theme = useTheme();

  useEffect(() => {
    if (aggregationType !== AggregationType.hour) setAggregationType(AggregationType.hour);
  }, [currentSchoolID]);

  const handleDatasetTypeChange = (event) => {
    const selectedVal = event.target.value;
    setAggregationType(selectedVal);
    setPreviewingDataset({ aggregationType: selectedVal, sensor });
  };

  const setThisSensorToPreview = () => {
    if (previewingDataset?.sensor !== sensor) {
      setPreviewingDataset({
        aggregationType: aggregationType,
        sensor
      });
    }
  }

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
          {sensorsList[sensor].location_long}
        </TableCell>

        <TableCell
          sx={{
            position: 'relative',
            background: isPreviewing && theme.palette.background.NYUpurpleLight
          }}>
          <FormControl size="small">
            <Select
              value={aggregationType}
              onChange={handleDatasetTypeChange}
              variant="standard"
              MenuProps={{ disablePortal: true }}
            >
              {Object.keys(AggregationType).map((aggregationType, index) => (
                <MenuItem
                  key={index}
                  value={aggregationType}
                >
                  <Stack direction="row" alignItems="center">
                    {aggregationType.charAt(0).toUpperCase() + aggregationType.slice(1).toLowerCase()}
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

const PreviewDataset = ({ previewingDataset }) => {
  const { data: previewData, isLoading: isPreviewDataLoading } = useDatasetDownload({
    sensor: previewingDataset?.sensor,
    aggregationType: previewingDataset?.aggregationType,
    isSample: true
  });

  const { refetch: refetchFullData } = useDatasetDownload({
    sensor: previewingDataset?.sensor,
    aggregationType: previewingDataset?.aggregationType,
    isSample: false,
    enabled: false,
  });

  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [previewingDatasetName, setPreviewingDatasetName] = useState("Not previewing any dataset");
  const [csvFileName, setCsvFileName] = useState("No dataset");

  const [formattedData, setFormattedData] = useState('');
  const [rowNumber, setRowNumber] = useState('');

  useEffect(() => {
    // If no dataset is chosen to be previewed, early return
    if (!previewData || !previewingDataset) return;

    // Update previewing dataset name regardless if the dataset preview has finished loading
    setPreviewingDatasetName(`Previewing: ${previewingDataset.sensor} (${previewingDataset.aggregationType})`);

    // If no previewData, then it hasn't been loaded yet
    if (!previewData || isPreviewDataLoading) {
      setRowNumber(null);
      setFormattedData(null);
      setCsvFileName("Loading...");
      return;
    };

    const lines = previewData.split('\n');
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

    const csvFileName = `${previewingDataset.sensor}-${previewingDataset.aggregationType}-${dateString}.csv`;
    setCsvFileName(csvFileName);
  }, [previewData]);

  const handleDownload = async () => {
    try {
      const { data } = await refetchFullData(); // runs queryFn manually

      const blob = new Blob([data], { type: 'application/octet-stream' }); // create a Blob with the raw data
      const url = URL.createObjectURL(blob); // create a download link for the Blob
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = csvFileName;
      document.body.appendChild(downloadLink);
      downloadLink.click(); // simulate a click on the download link
      URL.revokeObjectURL(url); // clean up by revoking the object URL
      document.body.removeChild(downloadLink);

      Tracking.sendEventAnalytics(Tracking.Events.rawDatasetDownloaded, {
        dataset_type: previewingDataset?.aggregationType,
        sensor: previewingDataset?.sensor
      });
    } catch (err) {
      enqueueSnackbar("Error fetching the full dataset", SnackbarMetadata.error);
    }
  };

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
          onClick={handleDownload}
          disabled={isPreviewDataLoading}
        >
          <DownloadIcon sx={{ fontSize: '1.25rem', mr: 0.5 }} />
          {csvFileName}
        </Button>
      </Box>
    </Stack >
  )
}