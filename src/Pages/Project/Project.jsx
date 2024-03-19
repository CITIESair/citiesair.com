// disable eslint for this file
/* eslint-disable */
import { useState, useEffect, useContext } from 'react';
import { LinkContext } from '../../ContextProviders/LinkContext';
import parse from 'html-react-parser';
import ChartControl from '../../Graphs/ChartControl';
import UppercaseTitle from '../../Components/UppercaseTitle';
import CommentSection, { PAGE_NAME } from '../../Components/CommentSection';
import { Box, Typography, Container, Divider, Chip, Grid, Tooltip, Stack, Skeleton } from '@mui/material';

import { useTheme } from '@mui/material/styles';

import ThemePreferences from '../../Themes/ThemePreferences';

import AirQualityIndexLegendQuickGlance from '../../Components/AirQualityHelper';

import jsonData from '../../section_data.json';

import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import BarChartIcon from '@mui/icons-material/BarChart';
import CommentIcon from '@mui/icons-material/Comment';

import { replacePlainHTMLWithMuiComponents } from '../../Utils/Utils';
import DatasetDownloadDialog from '../../Components/DatasetDownload/DatasetDownloadDialog';
import ScreenDialog from '../../Components/ScreenDialog';

import { scrollToSection } from '../../Components/Header/MenuItemAsNavLink';
import FullWidthBox from '../../Components/FullWidthBox';

import * as Tracking from '../../Utils/Tracking';

import CurrentAQIGrid from '../../Components/CurrentAQIGrid';
import { SchoolSelector } from "../Dashboard/SchoolSelector";

import AirQualityIndexTable from '../../Graphs/ChartSubstituteComponents/AirQualityIndexTable';
import ExpandableSection from './ExpandableSection';
import AirQualityExplanation from '../../Utils/AirQualityExplanation';
import { UserContext } from '../../ContextProviders/UserContext';
import LoadingAnimation from '../../Components/LoadingAnimation';

import { CommentCountsContext } from '../../ContextProviders/CommentCountsContext';

import AQImap, { LocationTitle, TileOptions } from '../../Components/AQImap';
import { RawDatasetType } from '../../Utils/ApiUtils';
import NYUADbanner from '../Embeds/NYUADbanner';

// Custom Chip component to display metadata
export const CustomChip = (props) => {
  const { tooltipTitle, label, ...otherProps } = props;
  return (
    <Tooltip title={tooltipTitle} enterDelay={0} leaveDelay={200}>
      <Chip
        size="small"
        label={label || <Skeleton variant="text" sx={{ minWidth: '5rem' }} />}
        {...otherProps}
      />
    </Tooltip>
  );
}



const Project = ({ themePreference, schoolMetadata, currentData, dashboardData, fetchDataForDashboard, temperatureUnitPreference }) => {
  const [_, __, ___, setChartsTitlesList] = useContext(LinkContext);

  let lastUpdate;

  const { user } = useContext(UserContext);

  const [commentCounts, fetchCommentCounts, setCommentCounts] = useContext(CommentCountsContext);

  const [displayCommentSection, setDisplayCommentSection] = useState(false);
  const [displayMapOfSensors, setDisplayMapOfSensors] = useState(false);

  const [listOfSensors, setListOfSensors] = useState({});

  useEffect(() => {
    if (schoolMetadata?.school_id === 'nyuad') {
      setDisplayCommentSection(true);
      setDisplayMapOfSensors(true);
      return;
    }
    setDisplayCommentSection(false);
    setDisplayMapOfSensors(false);
  }, [schoolMetadata])

  useEffect(() => {
    if (!displayCommentSection) return;

    if (commentCounts !== null) return;

    // Fetch comment count for page if it is nyuad
    fetchCommentCounts().then((data) => {
      setCommentCounts(data);
    });
  }, [displayCommentSection]);

  // Update the chart title list for quick navigation
  useEffect(() => {
    if (!dashboardData?.charts) return;

    const chartsTitles = dashboardData?.charts.map((element, index) => ({ chartTitle: element.title, chartID: `chart-${index + 1}` }));
    setChartsTitlesList(chartsTitles);
  }, [dashboardData]);

  // Update the list of sensor locations of this school for dataset download button
  useEffect(() => {
    if (!currentData) return;

    const sensors = currentData
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

    setListOfSensors(sensors);

  }, [currentData]);

  const theme = useTheme();

  const getDashboardTitle = () => {
    if (schoolMetadata?.school_id) return `Air Quality | ${schoolMetadata?.school_id}`
  }

  const GridOfMetadataChips = () => {
    return (
      <Grid container spacing={1} sx={{ mt: -3, pb: 3 }}>
        <Grid item>
          <SchoolSelector
            currentSchoolID={schoolMetadata?.school_id}
            currentSchoolName={schoolMetadata?.name}
            allowedSchools={user.allowedSchools}
            fetchDataForDashboard={fetchDataForDashboard}
          />
        </Grid>

        <Grid item>
          <CustomChip
            icon={<PersonIcon />}
            label={schoolMetadata?.contactPerson}
            tooltipTitle="Contact Person"
          />
        </Grid>

        <Grid item>
          <CustomChip
            icon={<EmailIcon />}
            label={schoolMetadata?.contactEmail}
            tooltipTitle="Contact Email"
            component="a"
            href={`mailto:${schoolMetadata?.contactEmail}`}
            clickable
          />
        </Grid>

        <Grid item>
          <CustomChip
            icon={<BarChartIcon />}
            label={`${dashboardData?.charts?.length || "..."} Chart${dashboardData?.charts?.length !== 1 ? 's' : ''}`}
            tooltipTitle="Number of Charts"
            onClick={() => {
              scrollToSection(jsonData.charts.id);
              Tracking.sendEventAnalytics(Tracking.Events.internalNavigation,
                {
                  destination_id: jsonData.charts.id,
                  destination_label: jsonData.dashboardData?.toString(),
                  origin_id: 'chip'
                });
            }}
          />
        </Grid>

        {
          lastUpdate &&
          <Grid item>
            <CustomChip
              icon={<PublishedWithChangesIcon />}
              label={`Last update: ${lastUpdate}`}
              tooltipTitle="Last Update" />
          </Grid>
        }

        {(displayCommentSection === true && commentCounts !== null) &&
          <Grid item>
            <CustomChip
              icon={<CommentIcon />}
              label={`${commentCounts[PAGE_NAME]} Comment${commentCounts[PAGE_NAME] > 1 ? "s" : ""}`}
              tooltipTitle="Number of Comments"
              onClick={() => {
                scrollToSection(jsonData.commentSection.id);
                Tracking.sendEventAnalytics(Tracking.Events.internalNavigation,
                  {
                    destination_id: jsonData.commentSection.id,
                    destination_label: jsonData.commentSection.toString(),
                    origin_id: 'chip'
                  })
              }}
            />
          </Grid>}
      </Grid>
    )
  }

  return (
    <Box width="100%">
      <AirQualityIndexLegendQuickGlance themePreference={themePreference} />

      <FullWidthBox backgroundColor='customAlternateBackground'>
        <Container sx={{ pt: 5 }}>
          <UppercaseTitle text={getDashboardTitle()} />
          <GridOfMetadataChips />
        </Container>
      </FullWidthBox>
      {displayMapOfSensors === true &&
        (
          <NYUADbanner
            initialNyuadCurrentData={currentData}
            isOnBannerPage={false}
            themePreference={themePreference}
            minMapHeight={"250px"}
          />
        )
      }
      <FullWidthBox backgroundColor='customAlternateBackground'>
        <Container sx={{ pt: 3, pb: 3 }}>
          {displayMapOfSensors === false &&
            (<Box textAlign="center" sx={{ mb: 2 }}>
              <CurrentAQIGrid
                currentSensorsData={currentData}
                isScreen={false}
                temperatureUnitPreference={temperatureUnitPreference}
              />
            </Box>)
          }

          <Typography
            component="div"
            variant="body1"
            color="text.secondary"
            sx={{
              textAlign: 'justify', pb: 2, mb: 0, "& table *": {
                color: `${theme.palette.text.secondary}`
              }
            }}
            gutterBottom
          >
            {
              dashboardData?.description ?
                parse(dashboardData?.description || '', {
                  replace: replacePlainHTMLWithMuiComponents,
                })
                :
                Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} variant='text' />
                ))
            }
          </Typography>

          <Stack direction="row" spacing={2}>
            <ScreenDialog
              schoolID={schoolMetadata?.school_id}
              screens={schoolMetadata?.screens}
            />
            <DatasetDownloadDialog
              schoolID={schoolMetadata?.school_id}
              initialSensorList={listOfSensors}
            />
          </Stack>

          <ExpandableSection
            title={AirQualityExplanation.title}
            content={(
              <>
                <AirQualityIndexTable themePreference={themePreference} />
                <Typography
                  component="div"
                  variant="body1"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  {parse(AirQualityExplanation.subtitle, {
                    replace: replacePlainHTMLWithMuiComponents,
                  })}
                </Typography>
                <ExpandableSection
                  title={"Reference"}
                  content={(
                    <Typography variant="caption" color="text.secondary">
                      {parse(AirQualityExplanation.reference, {
                        replace: replacePlainHTMLWithMuiComponents,
                      })}
                    </Typography>
                  )}
                />
              </>
            )}
          />
        </Container>
      </FullWidthBox>

      <Box id={jsonData.charts.id}>
        {
          dashboardData?.charts ?
            dashboardData?.charts?.map((element, index) => (
              <FullWidthBox
                key={index}
                backgroundColor={
                  index % 2 != 0 && 'customAlternateBackground'
                }
              >
                <Container
                  sx={{ pt: 4, pb: 4 }}
                  height="auto"
                  className={themePreference === ThemePreferences.dark ? 'dark' : ''}
                  id={`chart-${index + 1}`}
                >
                  <Typography variant="h6" color="text.primary">
                    {index + 1}. {element.title}
                  </Typography>

                  <ChartControl
                    generalChartSubtitle={element.subtitle}
                    generalChartReference={element.reference}
                    chartData={{
                      chartIndex: index,
                      ...element,
                    }}
                  />
                </Container>
              </FullWidthBox>
            ))
            :
            <LoadingAnimation optionalText="Loading Dashboard" />
        }

      </Box>
      <Divider />

      {displayCommentSection === true &&
        <FullWidthBox id={jsonData.commentSection.id} sx={{ pt: 3, pb: 4 }}>
          <CommentSection pageID={PAGE_NAME} />
        </FullWidthBox>
      }
    </Box >
  );
};

export default Project;
