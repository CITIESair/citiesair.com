// disable eslint for this file
/* eslint-disable */
import { useState, useEffect, useContext } from 'react';
import ChartComponentWrapper from '../../Graphs/ChartComponentWrapper';
import UppercaseTitle from '../../Components/UppercaseTitle';
import CommentSection from '../../Components/CommentSection';
import { HYVOR_PAGE_NAME } from '../../Utils/GlobalVariables';
import { Box, Container, Divider, Grid, Stack } from '@mui/material';

import { useTheme } from '@mui/material/styles';

import ThemePreferences from '../../Themes/ThemePreferences';

import AirQualityIndexLegendQuickGlance from '../../Components/AirQuality/AirQualityIndexLegendQuickGlance';

import jsonData from '../../section_data.json';

import FullWidthBox from '../../Components/FullWidthBox';

import CurrentAQIGrid from '../../Components/AirQuality/CurrentAQIGrid';

import LoadingAnimation from '../../Components/LoadingAnimation';

import { MetadataContext } from '../../ContextProviders/MetadataContext';

import NYUADbanner from '../Embeds/NYUADbanner';

import { DashboardContext } from '../../ContextProviders/DashboardContext';
import { PreferenceContext } from '../../ContextProviders/PreferenceContext';

import AQIexplanation from '../../Components/AirQuality/AQIexplanation';
import { DateRangePickerProvider } from '../../ContextProviders/DateRangePickerContext';
import { AxesPickerProvider } from '../../ContextProviders/AxesPickerContext';
import { NYUAD } from '../../Utils/GlobalVariables';

import ProjectReservedArea from './ProjectReservedArea';
import GridOfMetadataChips from './GridOfMetadataChips';
import ProjectDescription from './ProjectDescription';
import LoadMoreButton from './LoadMoreButton';

const Project = () => {
  const { setChartsTitlesList } = useContext(MetadataContext);

  const { schoolMetadata, current, allChartsData } = useContext(DashboardContext);
  const { themePreference, temperatureUnitPreference } = useContext(PreferenceContext);

  const [displayCommentSection, setDisplayCommentSection] = useState(false);
  const [displayMapOfSensors, setDisplayMapOfSensors] = useState(false);

  // If NYUAD, display comment section and map of sensors
  useEffect(() => {
    if (!schoolMetadata) return;

    const isNYUAD = schoolMetadata.school_id === NYUAD;
    setDisplayCommentSection(isNYUAD);
    setDisplayMapOfSensors(isNYUAD);
  }, [schoolMetadata]);

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
                  (index === Object.keys(allChartsData).length - 1) ?
                    <LoadMoreButton /> : null
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

  return (
    <Box width="100%">
      <AirQualityIndexLegendQuickGlance />

      <FullWidthBox backgroundColor='customAlternateBackground'>
        <Container sx={{ pt: 2, pb: 2 }}>
          <Grid container spacing={1.5} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <UppercaseTitle
                text={getDashboardTitle()}
                textAlign="center"
                sx={{ pb: 0 }}
              />
            </Grid>
            <Grid item xs={12}>
              <GridOfMetadataChips
                displayCommentSection={displayCommentSection}
              />
            </Grid>
            <Grid item xs={12}>
              {/* Reserved area that requires an account, even for public schools */}
              <ProjectReservedArea />
            </Grid>
          </Grid>

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

          <ProjectDescription />

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

