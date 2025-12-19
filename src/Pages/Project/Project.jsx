import { useContext } from 'react';
import ChartComponentWrapper from '../../Graphs/ChartComponentWrapper';
import UppercaseTitle from '../../Components/UppercaseTitle';

import { Box, Container, Divider, Grid, useTheme } from '@mui/material';

import ThemePreferences from '../../Themes/ThemePreferences';

import AirQualityIndexLegendQuickGlance from '../../Components/AirQuality/AirQualityIndexLegendQuickGlance';

import sectionData from '../../section_data.json';

import FullWidthBox from '../../Components/FullWidthBox';

import CurrentAQIGrid from '../../Components/AirQuality/CurrentAQI/CurrentAQIGrid';

import { DashboardContext } from '../../ContextProviders/DashboardContext';
import { PreferenceContext } from '../../ContextProviders/PreferenceContext';

import AQIexplanation from '../../Components/AirQuality/AQIexplanation';
import { AxesPickerProvider } from '../../ContextProviders/AxesPickerContext';
import { NUMBER_OF_CHARTS_TO_LOAD_INITIALLY } from '../../Utils/GlobalVariables';

import ProjectReservedArea from './ProjectReservedArea';
import GridOfMetadataChips from './GridOfMetadataChips';
import ProjectDescription from './ProjectDescription';
import LoadMoreButton from './LoadMoreButton';
import CurrentAQIMapWithGrid from '../../Components/AirQuality/CurrentAQI/CurrentAQIMapWithGrid';
import { ChartAPIEndpointsOrder } from '../../API/APIUtils';
import useCurrentSensorsData from '../../hooks/useCurrentSensorsData';
import useSchoolMetadata from '../../hooks/useSchoolMetadata';

// Temporarily not using HyvorTalk comment anymore
// import CommentSection from '../../Components/CommentSection';
// import { HYVOR_PAGE_NAME } from '../../Utils/GlobalVariables';

const Project = () => {
  const theme = useTheme();
  const { currentSchoolID, loadMoreCharts } = useContext(DashboardContext);
  const { data: currentSensorsData } = useCurrentSensorsData();
  const { data: schoolMetadata } = useSchoolMetadata();

  const chartsToRender = loadMoreCharts
    ? ChartAPIEndpointsOrder.length
    : NUMBER_OF_CHARTS_TO_LOAD_INITIALLY;

  const { themePreference } = useContext(PreferenceContext);

  // Temporarily not using HyvorTalk comment anymore
  // const [displayCommentSection, setDisplayCommentSection] = useState(false);

  const getDashboardTitle = () => {
    if (schoolMetadata?.school_id) return `Air Quality | ${schoolMetadata?.school_id}`
  }

  return (
    <Box width="100%">
      <AirQualityIndexLegendQuickGlance />

      <FullWidthBox backgroundColor='customAlternateBackground'>
        <Container sx={{ pt: 2 }}>
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
              // Temporarily not using HyvorTalk comment anymore
              // displayCommentSection={displayCommentSection}
              />
            </Grid>
            <Grid item xs={12}>
              {/* Reserved area that requires an account, even for public schools */}
              <ProjectReservedArea />
            </Grid>
          </Grid>
        </Container>

        <Container sx={{
          mb: 1,
          [theme.breakpoints.down('sm')]: {
            px: 0
          }
        }}>
          {schoolMetadata?.has_map === true ?
            (
              <CurrentAQIMapWithGrid
                currentSensorsData={currentSensorsData}
                schoolID={currentSchoolID}
                isOnBannerPage={false}
                minMapHeight={"250px"}
              />
            ) : (
              <CurrentAQIGrid
                currentSensorsData={currentSensorsData}
                isScreen={false}
              />
            )
          }
        </Container>

        <Container sx={{ py: 2 }}>
          <ProjectDescription />
          <AQIexplanation />
        </Container>
      </FullWidthBox>

      <Box id={sectionData.charts.id}>
        {ChartAPIEndpointsOrder.slice(0, chartsToRender).map((_, index) => (
          <FullWidthBox
            key={index}
            backgroundColor={index % 2 !== 0 ? 'customAlternateBackground' : ''}
          >
            <Container
              sx={{ py: 3, px: 0 }}
              height="auto"
              className={themePreference === ThemePreferences.dark ? 'dark' : ''}
              id={`chart-${index + 1}`}
            >

              <AxesPickerProvider>
                <ChartComponentWrapper chartID={index} />
              </AxesPickerProvider>

              {
                // Optionally display the button to load more charts at the bottom of the last chart
                // (if not already fetched every chart)
                index === chartsToRender - 1 && !loadMoreCharts && <LoadMoreButton />
              }
            </Container>
          </FullWidthBox>
        ))}
      </Box>
      <Divider />

      {/* Temporarily not using HyvorTalk comment anymore
      {displayCommentSection === true &&
        <FullWidthBox id={sectionData.commentSection.id} sx={{ pt: 3, pb: 4 }}>
          <CommentSection pageID={HYVOR_PAGE_NAME} />
        </FullWidthBox>
      } */}
    </Box >
  );
};

export default Project;

