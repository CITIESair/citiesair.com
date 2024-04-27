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

import AirQualityIndexTable from '../Components/AirQuality/AirQualityIndexTable';
import ExpandableSection from '../Components/ExpandableSection';
import AirQualityExplanation from '../Utils/AirQuality/AirQualityExplanation';
import LoadingAnimation from '../Components/LoadingAnimation';

import { CommentCountsContext } from '../ContextProviders/CommentCountsContext';

import NYUADbanner from './Embeds/NYUADbanner';

import { DashboardContext } from '../ContextProviders/DashboardContext';
import { PreferenceContext } from '../ContextProviders/PreferenceContext';
import LoadMoreChartsButton from '../Components/LoadMoreChartsButton';

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
  const { schoolMetadata, current, chartData } = useContext(DashboardContext);
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
    if (!chartData?.charts) return;

    const chartsTitles = chartData?.charts.map((element, index) => ({ chartTitle: element.title, chartID: `chart-${index + 1}` }));
    setChartsTitlesList(chartsTitles);
  }, [chartData]);

  const theme = useTheme();

  const getDashboardTitle = () => {
    if (schoolMetadata?.school_id) return `Air Quality | ${schoolMetadata?.school_id}`
  }

  const displayProjectDescription = () => {
    const description = schoolMetadata?.description;

    if (description) return (
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
          parse(description || '', {
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
    if (chartData) {
      return (
        chartData?.charts?.map((element, index) => (
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

              <ChartComponentWrapper
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
      )
    } else {
      return (
        <LoadingAnimation optionalText="Loading Dashboard" />
      )
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
            label={`${chartData?.charts?.length || "..."} Chart${chartData?.charts?.length !== 1 ? 's' : ''}`}
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

          {chartData && displayProjectDescription()}

          <Stack direction="row" spacing={2}>
            <ScreenDialog />
            <DatasetDownloadDialog />
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
        {displayCharts(chartData)}
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
