// disable eslint for this file
/* eslint-disable */
import { useState, useEffect, useContext } from 'react';
import { LinkContext } from '../../ContextProviders/LinkContext';
import { TabContext } from '../../ContextProviders/TabContext';
import parse from 'html-react-parser';
import ChartComponent from '../../Graphs/ChartComponent';
import UppercaseTitle from '../../Components/UppercaseTitle';
import { Box, Typography, Container, Divider, Chip, Grid, Tooltip, Stack } from '@mui/material';

import { useTheme } from '@mui/material/styles';

import ThemePreferences from '../../Themes/ThemePreferences';

import AirQualityIndexLegendQuickGlance from '../../Components/AirQualityHelper';

import project from '../../temp_database.json';
import jsonData from '../../section_data.json';

import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import BarChartIcon from '@mui/icons-material/BarChart';

import { replacePlainHTMLWithMuiComponents } from '../../Utils/Utils';
import DatasetDownloadDialog from '../../Components/DatasetDownload/DatasetDownloadDialog';
import ScreenDialog from '../../Components/ScreenDialog';

import { scrollToSection } from '../../Components/Header/MenuItemAsNavLink';
import FullWidthBox from '../../Components/FullWidthBox';

import * as Tracking from '../../Utils/Tracking';

import ChartSubstituteComponentLoader from '../../Graphs/ChartSubstituteComponents/ChartSubstituteComponentLoader';

import CurrentAQIGrid from '../../Components/CurrentAQIGrid';
import { SchoolSelector } from "../Dashboard/SchoolSelector";


// Custom Chip component to display metadata
export const CustomChip = (props) => {
  const { tooltipTitle, ...otherProps } = props;
  return (
    <Tooltip title={tooltipTitle} enterDelay={0} leaveDelay={200}>
      <Chip
        size="small"
        {...otherProps}
      />
    </Tooltip>
  );
}

const Project = ({ themePreference, currentSensorData, dashboardData, fetchDashboardData, temperatureUnitPreference }) => {
  const [_, __, chartsTitlesList, setChartsTitlesList] = useContext(LinkContext);

  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useContext(TabContext);

  let lastUpdate;

  useEffect(() => {
    const chartsTitles = project.charts.map((element, index) => ({ chartTitle: element.title, chartID: `chart-${index + 1}` }));
    setChartsTitlesList(chartsTitles);
  }, []);
  const theme = useTheme();

  return (
    <>
      <Box width="100%">
        <AirQualityIndexLegendQuickGlance themePreference={themePreference} />

        <FullWidthBox backgroundColor='customAlternateBackground'>
          <Container sx={{ pt: 5, pb: 3 }}>
            <UppercaseTitle text={project.title} />

            <Grid container spacing={1} sx={{ mt: -3, pb: 3 }}>
              <Grid item>
                <SchoolSelector
                  currentSchoolID={dashboardData.currentSchool?.school_id}
                  currentSchoolName={dashboardData.currentSchool?.name}
                  allowedSchools={dashboardData.allowedSchools}
                  fetchDashboardData={fetchDashboardData}
                />
              </Grid>

              <Grid item>
                <CustomChip
                  icon={<PersonIcon />}
                  label={dashboardData.currentSchool?.contactPerson}
                  tooltipTitle="Contact Person"
                />
              </Grid>

              <Grid item>
                <CustomChip
                  icon={<EmailIcon />}
                  label={dashboardData.currentSchool?.contactEmail}
                  tooltipTitle="Contact Email"
                  component="a"
                  href={`mailto:${dashboardData.currentSchool?.contactEmail}`}
                  clickable
                />
              </Grid>

              <Grid item>
                <CustomChip
                  icon={<BarChartIcon />}
                  label={`${project.charts.length} Chart${project.charts.length > 1 && "s"}`}
                  tooltipTitle="Number of Charts"
                  onClick={() => {
                    scrollToSection(jsonData.charts.id);
                    Tracking.sendEventAnalytics(Tracking.Events.internalNavigation,
                      {
                        destination_id: jsonData.charts.id,
                        destination_label: jsonData.project.toString(),
                        origin_id: 'chip'
                      })
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
            </Grid>

            <Box textAlign="center" sx={{ mb: 2 }}>
              <CurrentAQIGrid
                currentData={currentSensorData}
                isScreen={false}
                temperatureUnitPreference={temperatureUnitPreference}
              />
            </Box>
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
              {parse(project.description, {
                replace: replacePlainHTMLWithMuiComponents,
              })}
            </Typography>
            <Stack direction="row" spacing={2}>
              <ScreenDialog schoolID={dashboardData.currentSchool?.school_id} screens={dashboardData.currentSchool?.screens} />

              {/* <DatasetDownloadDialog project={project} /> */}
            </Stack>
          </Container>
        </FullWidthBox>

        <Box id={jsonData.charts.id}>
          {project.charts.map((element, index) => (
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
              >
                <Typography variant="h6" color="text.primary">
                  {index + 1}. {element.title}
                </Typography>

                {/* Either display the regular ChartComponent, or substitute with a customized component in ../../Graphs/ChartSubstituteComponents/ (if specified) */}
                {element.chartSubstituteComponentName ?
                  <ChartSubstituteComponentLoader chartSubstituteComponentName={element.chartSubstituteComponentName} />
                  : (
                    <ChartComponent
                      chartData={{
                        chartIndex: index,
                        sheetId: project.sheetId,
                        ...element,
                      }}
                      dataArray={dashboardData?.charts}
                    />
                  )}

                <Box sx={{ my: 3 }}>
                  <Typography
                    component="div"
                    variant="body1"
                    color="text.secondary"
                  >
                    {element.subtitle && parse(element.subtitle, {
                      replace: replacePlainHTMLWithMuiComponents,
                    })}
                    {Object.keys(tab)[index] == index &&
                      element.subcharts &&
                      element.subcharts[Object.values(tab)[index]]
                        .subchartSubtitle &&
                      parse(
                        element.subcharts[Object.values(tab)[index]]
                          .subchartSubtitle, {
                        replace: replacePlainHTMLWithMuiComponents,
                      }
                      )}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {element.reference && parse(element.reference, {
                      replace: replacePlainHTMLWithMuiComponents,
                    })}
                    {Object.keys(tab)[index] == index &&
                      element.subcharts &&
                      element.subcharts[Object.values(tab)[index]].reference &&
                      parse(
                        element.subcharts[Object.values(tab)[index]].reference, {
                        replace: replacePlainHTMLWithMuiComponents,
                      }
                      )}
                  </Typography>
                </Box>
              </Container>
            </FullWidthBox>
          ))}
        </Box>

        <Divider />
      </Box>
    </>
  );
};

export default Project;
