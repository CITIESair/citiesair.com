// disable eslint for this file
/* eslint-disable */
import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
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

import locations from '../../temp_locations.json';

import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import BarChartIcon from '@mui/icons-material/BarChart';
import PlaceIcon from '@mui/icons-material/Place';

import { replacePlainHTMLWithMuiComponents } from '../../Utils/Utils';
import DatasetDownloadDialog from '../../Components/DatasetDownload/DatasetDownloadDialog';
import ScreenDialog from '../../Components/ScreenDialog';

import { scrollToSection } from '../../Components/Header/MenuItemAsNavLink';
import FullWidthBox from '../../Components/FullWidthBox';

import * as Tracking from '../../Utils/Tracking';

import ChartSubstituteComponentLoader from '../../Graphs/ChartSubstituteComponents/ChartSubstituteComponentLoader';

// Custom Chip component to display metadata
const CustomChip = (props) => {
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

const Project = ({ themePreference }) => {
  const [_, setCurrentPage, chartsTitlesList, setChartsTitlesList] = useContext(LinkContext);

  let { id } = useParams();
  const [locationData, setLocationData] = useState();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useContext(TabContext);

  let lastUpdate;

  // Update the page's title
  useEffect(() => { if (locationData) document.title = `${locationData.name} | ${project.title}`, [locationData] });

  // Update the currentPage with the location's ID
  setCurrentPage(id);

  // Update the chartsTitle with all the charts' titles of the project and tab information
  useEffect(() => {
    setLocationData(locations[id]);
    let chartsTitles = [];
    chartsTitles = project.charts.map((element, index) => ({ chartTitle: element.title, chartID: `chart-${index + 1}` }));
    setChartsTitlesList(chartsTitles);

    let temp = {};
    for (let i = 0; i < project.charts.length; i++) {
      temp[i] = 0;
    }
    setTab(temp);
    setLoading(true);

  }, [id, setCurrentPage, setChartsTitlesList]);

  const theme = useTheme();

  return (
    <>
      {loading && (
        <Box width="100%">
          <AirQualityIndexLegendQuickGlance />

          <FullWidthBox backgroundColor='customAlternateBackground'>
            <Container sx={{ pt: 5, pb: 3 }}>

              <UppercaseTitle text={project.title} />

              <Grid container spacing={1} sx={{ pb: 3, mt: -3 }}>
                <Grid item>
                  <CustomChip
                    icon={<PlaceIcon />}
                    label={locationData.name}
                    tooltipTitle="Contact Person"
                  />
                </Grid>

                <Grid item>
                  <CustomChip
                    icon={<PersonIcon />}
                    label={locationData.contactPerson}
                    tooltipTitle="Contact Person"
                  />
                </Grid>

                <Grid item>
                  <CustomChip
                    icon={<EmailIcon />}
                    label={locationData.contactEmail}
                    tooltipTitle="Contact Email"
                    component="a"
                    href={`mailto:${locationData.contactEmail}`}
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

              <Typography
                component="div"
                variant="body1"
                color="text.secondary"
                sx={{
                  textAlign: 'justify', pb: 3, mb: 0, "& table *": {
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
                <ScreenDialog />

                <DatasetDownloadDialog project={project} />
              </Stack>
            </Container>
          </FullWidthBox>

          <Box id={jsonData.charts.id}>
            {project.charts.map((element, index) => (
              <FullWidthBox
                id={chartsTitlesList[index].chartID} // set the chartWrapper's ID to help Navbar in Header scroll to
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
      )}
    </>
  );
};

export default Project;
