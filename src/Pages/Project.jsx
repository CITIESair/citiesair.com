// disable eslint for this file
/* eslint-disable */
import { useState, useEffect, useContext } from 'react';
import parse from 'html-react-parser';
import ChartComponentWrapper from '../Graphs/ChartComponentWrapper';
import UppercaseTitle from '../Components/UppercaseTitle';
import CommentSection from '../Components/CommentSection';
import { HYVOR_PAGE_NAME } from '../Utils/GlobalVariables';
import { Button, Box, Typography, Container, Divider, Chip, Grid, Tooltip, Stack, Skeleton } from '@mui/material';

import { useTheme } from '@mui/material/styles';

import ThemePreferences from '../Themes/ThemePreferences';

import AirQualityIndexLegendQuickGlance from '../Components/AirQuality/AirQualityIndexLegendQuickGlance';

import jsonData from '../section_data.json';

import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import BarChartIcon from '@mui/icons-material/BarChart';
import CommentIcon from '@mui/icons-material/Comment';

import { replacePlainHTMLWithMuiComponents } from '../Utils/UtilFunctions';
import DatasetDownloadDialog from '../Components/DatasetDownload/DatasetDownloadDialog';
import ScreenDropDownMenu from '../Components/AirQuality/AirQualityScreen/ScreenDropDownMenu';

import { scrollToSection } from '../Components/Header/MenuItemAsNavLink';
import FullWidthBox from '../Components/FullWidthBox';

import * as Tracking from '../Utils/Tracking';

import CurrentAQIGrid from '../Components/AirQuality/CurrentAQIGrid';
import SchoolSelector from '../Components/SchoolSelector';

import LoadingAnimation from '../Components/LoadingAnimation';

import { MetadataContext } from '../ContextProviders/MetadataContext';

import NYUADbanner from './Embeds/NYUADbanner';

import { DashboardContext } from '../ContextProviders/DashboardContext';
import { PreferenceContext } from '../ContextProviders/PreferenceContext';

import AQIexplanation from '../Components/AirQuality/AQIexplanation';
import { DateRangePickerProvider } from '../ContextProviders/DateRangePickerContext';
import { AxesPickerProvider } from '../ContextProviders/AxesPickerContext';
import AirQualityAlerts from '../Components/AirQuality/AirQualityAlerts/AirQualityAlert';
import { NYUAD } from '../Utils/GlobalVariables';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

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

const Project = () => {
  let lastUpdate;

  const { commentCounts, fetchCommentCounts, setCommentCounts, setChartsTitlesList } = useContext(MetadataContext);

  const { schoolMetadata, current, allChartsData, loadMoreCharts, currentSchoolID, setLoadMoreCharts } = useContext(DashboardContext);
  const { themePreference, temperatureUnitPreference } = useContext(PreferenceContext);

  const [displayCommentSection, setDisplayCommentSection] = useState(false);
  const [displayMapOfSensors, setDisplayMapOfSensors] = useState(false);

  // If NYUAD, display comment section and map of sensors
  useEffect(() => {
    if (!schoolMetadata) return;

    const isNYUAD = schoolMetadata.school_id === NYUAD;
    setDisplayCommentSection(isNYUAD);
    setDisplayMapOfSensors(isNYUAD);

    // Fetch comment count for NYUAD
    if (isNYUAD && !commentCounts) {
      fetchCommentCounts().then((data) => {
        setCommentCounts(data);
      });
    }
  }, [schoolMetadata])

  // Update the chart title list for quick navigation
  useEffect(() => {
    if (!allChartsData) return;

    const chartsTitles = Object.keys(allChartsData).map((key, index) => ({ chartTitle: allChartsData[key]?.title || "", chartID: `chart-${index + 1}` }));

    setChartsTitlesList(chartsTitles);
  }, [allChartsData]);

  const theme = useTheme();

  const getDashboardTitle = () => {
    if (schoolMetadata?.school_id) return `Air Quality | ${schoolMetadata?.school_id}`
  }

  const displayProjectDescription = () => {
    if (schoolMetadata) return (
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
          parse(schoolMetadata.description || '', {
            replace: replacePlainHTMLWithMuiComponents,
          })
        }
      </Typography>
    )
    else {
      return (
        Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} variant='text' />
        ))
      )
    }
  };

  const displayCharts = () => {
    // Display if there are at least one chart
    if (Object.keys(allChartsData).length > 0) {
      return (
        <>
          {Object.keys(allChartsData).map((chartID, index) => (
            <FullWidthBox
              key={chartID}
              backgroundColor={index % 2 !== 0 ? 'customAlternateBackground' : ''}
            >
              <Container
                sx={{ pt: 4, pb: 4 }}
                height="auto"
                className={themePreference === ThemePreferences.dark ? 'dark' : ''}
                id={`chart-${index + 1}`}
              >

                <AxesPickerProvider>
                  <DateRangePickerProvider>
                    <ChartComponentWrapper
                      chartTitle={allChartsData[chartID].title}
                      generalChartSubtitle={allChartsData[chartID].subtitle}
                      generalChartReference={allChartsData[chartID].reference}
                      chartData={{
                        chartIndex: index,
                        ...allChartsData[chartID],
                      }}
                      chartID={chartID}
                      chartIndex={index}
                    />
                  </DateRangePickerProvider>
                </AxesPickerProvider>
                {
                  // Optionally display the button to load more charts at the bottom of the last chart
                  // (if not already fetched every chart)
                  displayLoadMoreButton(index === Object.keys(allChartsData).length - 1)
                }
              </Container>
            </FullWidthBox>
          ))}

        </>
      );
    } else {
      // Else display loading animation
      return <LoadingAnimation optionalText="Loading Visualizations" />;
    }
  };

  const displayLoadMoreButton = (isLastChartInList) => {
    if (isLastChartInList === true && loadMoreCharts === false) {
      return (
        <Stack sx={{ mt: 6, mx: 'auto', maxWidth: 'sm' }}>
          <Button
            variant="contained"
            onClick={() => {
              setLoadMoreCharts(true);
            }}
          >
            <KeyboardArrowDownIcon sx={{ fontSize: '1rem' }} />&nbsp;Load More Charts
          </Button>
        </Stack>
      )
    }
    else {
      return null;
    }
  }

  const GridOfMetadataChips = () => {
    return (
      <Grid container spacing={1} sx={{ mt: -3, pb: 3 }}>
        <Grid item>
          <SchoolSelector />
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
            label={`${Object.keys(allChartsData).length || "..."} Chart${Object.keys(allChartsData).length !== 1 ? 's' : ''}`}
            tooltipTitle="Number of Charts"
            onClick={() => {
              scrollToSection(jsonData.charts.id);
              Tracking.sendEventAnalytics(Tracking.Events.internalNavigation,
                {
                  destination_id: jsonData.charts.id,
                  destination_label: jsonData.chartData?.toString(),
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

        {(displayCommentSection === true && commentCounts !== null) ?
          (
            <Grid item>
              <CustomChip
                icon={<CommentIcon />}
                label={`${commentCounts[HYVOR_PAGE_NAME]} Comment${commentCounts[HYVOR_PAGE_NAME] > 1 ? "s" : ""}`}
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
            </Grid>
          ) : null}
      </Grid>
    )
  }

  return (
    <Box width="100%">
      <AirQualityIndexLegendQuickGlance />

      <FullWidthBox backgroundColor='customAlternateBackground'>
        <Container sx={{ pt: 2, pb: 2 }}>
          <UppercaseTitle text={getDashboardTitle()} />
          <GridOfMetadataChips />

          {displayMapOfSensors === true &&
            (
              <NYUADbanner
                initialNyuadCurrentData={current}
                isOnBannerPage={false}
                themePreference={themePreference}
                minMapHeight={"250px"}
              />
            )
          }

          {displayMapOfSensors === false &&
            (<Box textAlign="center" sx={{ mb: 2 }}>
              <CurrentAQIGrid
                currentSensorsData={current}
                isScreen={false}
                temperatureUnitPreference={temperatureUnitPreference}
              />
            </Box>)
          }

          {displayProjectDescription()}

          <Grid container spacing={1}>
            <Grid item>
              <ScreenDropDownMenu />
            </Grid>
            <Grid item>
              <DatasetDownloadDialog />
            </Grid>
            {
              // only show Air Quality Alerts for schools other than nyuad at the moment
              (currentSchoolID && currentSchoolID !== NYUAD) ? <Grid item>
                <AirQualityAlerts />
              </Grid> : null
            }

          </Grid>

          <AQIexplanation />

        </Container>
      </FullWidthBox>

      <Box id={jsonData.charts.id}>
        {displayCharts(allChartsData)}
      </Box>
      <Divider />

      {displayCommentSection === true &&
        <FullWidthBox id={jsonData.commentSection.id} sx={{ pt: 3, pb: 4 }}>
          <CommentSection pageID={HYVOR_PAGE_NAME} />
        </FullWidthBox>
      }
    </Box >
  );
};

export default Project;
