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

const Project = ({ themePreference, currentSensorData, dashboardData, fetchDashboardData }) => {
  const [_, __, chartsTitlesList, setChartsTitlesList] = useContext(LinkContext);

  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useContext(TabContext);

  let lastUpdate;

  // Update the page's title
  // useEffect(() => { if (locationData) document.title = `${locationData.name} | ${project.title}`, [locationData] });
  useEffect(() => {
    setChartsTitlesList([]);
  }, [setChartsTitlesList]);
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

        <Divider />
      </Box>
    </>
  );
};

export default Project;
