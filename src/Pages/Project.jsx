// disable eslint for this file
/* eslint-disable */
import { useState, useEffect, useContext } from 'react';
import { LinkContext } from '../ContextProviders/LinkContext';
import parse from 'html-react-parser';
import ChartComponentWrapper from '../Graphs/ChartComponentWrapper';
import UppercaseTitle from '../Components/UppercaseTitle';
import CommentSection, { PAGE_NAME } from '../Components/CommentSection';
import { Box, Typography, Container, Divider, Chip, Grid, Tooltip, Stack, Skeleton } from '@mui/material';

import { useTheme } from '@mui/material/styles';

import ThemePreferences from '../Themes/ThemePreferences';

import AirQualityIndexLegendQuickGlance from '../Components/AirQuality/AirQualityIndexLegendQuickGlance';

import jsonData from '../section_data.json';

import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import BarChartIcon from '@mui/icons-material/BarChart';
import CommentIcon from '@mui/icons-material/Comment';

import { replacePlainHTMLWithMuiComponents } from '../Utils/Utils';
import DatasetDownloadDialog from '../Components/DatasetDownload/DatasetDownloadDialog';
import ScreenDialog from '../Components/AirQuality/AirQualityScreen/ScreenDialog';

import { scrollToSection } from '../Components/Header/MenuItemAsNavLink';
import FullWidthBox from '../Components/FullWidthBox';

import * as Tracking from '../Utils/Tracking';

import CurrentAQIGrid from '../Components/AirQuality/CurrentAQIGrid';
import SchoolSelector from '../Components/SchoolSelector';

import LoadingAnimation from '../Components/LoadingAnimation';

import { CommentCountsContext } from '../ContextProviders/CommentCountsContext';

import NYUADbanner from './Embeds/NYUADbanner';

import { DashboardContext } from '../ContextProviders/DashboardContext';
import { PreferenceContext } from '../ContextProviders/PreferenceContext';
import LoadMoreChartsButton from '../Components/LoadMoreChartsButton';
import AQIexplanation from '../Components/AirQuality/AQIexplanation';

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

  const { setChartsTitlesList } = useContext(LinkContext);
  const { commentCounts, fetchCommentCounts, setCommentCounts } = useContext(CommentCountsContext);
  const { schoolMetadata, current, allChartsData, loadMoreCharts } = useContext(DashboardContext);
  const { themePreference, temperatureUnitPreference } = useContext(PreferenceContext);

  const [displayCommentSection, setDisplayCommentSection] = useState(false);
  const [displayMapOfSensors, setDisplayMapOfSensors] = useState(false);

  // If NYUAD, display comment section and map of sensors
  useEffect(() => {
    if (!schoolMetadata) return;

    const isNYUAD = schoolMetadata.school_id === 'nyuad';
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
    if (!allChartsData?.charts) return;

    const chartsTitles = allChartsData?.charts.map((element, index) => ({ chartTitle: element.title, chartID: `chart-${index + 1}` }));
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
                {
                  allChartsData[chartID].title ?
                    <Typography variant="h6" color="text.primary">
                      {index + 1}. {allChartsData[chartID].title}
                    </Typography>
                    : <Skeleton variant='text' sx={{ width: '100%', fontSize: '2rem' }} />

                }

                {
                  allChartsData[chartID].title ?
                    <ChartComponentWrapper
                      generalChartSubtitle={allChartsData[chartID].subtitle}
                      generalChartReference={allChartsData[chartID].reference}
                      chartData={{
                        chartIndex: index,
                        ...allChartsData[chartID],
                      }}
                    />
                    : <Skeleton variant='rounded' width="100%" height={300} />
                }

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
      return <LoadMoreChartsButton />;
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
      <AirQualityIndexLegendQuickGlance />

      <FullWidthBox backgroundColor='customAlternateBackground'>
        <Container sx={{ pt: 5 }}>
          <UppercaseTitle text={getDashboardTitle()} />
          <GridOfMetadataChips />
        </Container>
      </FullWidthBox>
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
      <FullWidthBox backgroundColor='customAlternateBackground'>
        <Container sx={{ pt: 3, pb: 3 }}>
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

          <Stack direction="row" spacing={2}>
            <ScreenDialog />
            <DatasetDownloadDialog />
          </Stack>

          <AQIexplanation />

        </Container>
      </FullWidthBox>

      <Box id={jsonData.charts.id}>
        {displayCharts(allChartsData)}
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
