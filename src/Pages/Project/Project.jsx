// disable eslint for this file
/* eslint-disable */
import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { LinkContext } from '../../ContextProviders/LinkContext';
import { TabContext } from '../../ContextProviders/TabContext';
import parse from 'html-react-parser';
import ChartComponent from '../../Graphs/ChartComponent';
import UppercaseTitle from '../../Components/UppercaseTitle';
import CommentSection from '../../Components/CommentSection';
import { Box, Typography, Container, Divider, Chip, Grid, Tooltip } from '@mui/material';

import { useTheme } from '@mui/material/styles';

import ThemePreferences from '../../Themes/ThemePreferences';

import AirQualityIndexLegendQuickGlance from '../../Components/AirQualityHelper';

import data from '../../temp_database.json';
import jsonData from '../../section_data.json';

import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import BarChartIcon from '@mui/icons-material/BarChart';
import CommentIcon from '@mui/icons-material/Comment';

import { replacePlainHTMLWithMuiComponents } from '../../Utils/Utils';
import DatasetDownloadDialog from '../../Components/DatasetDownload/DatasetDownloadDialog';

import { scrollToSection } from '../../Components/Header/MenuItemAsNavLink';
import FullWidthBox from '../../Components/FullWidthBox';

import * as Tracking from '../../Utils/Tracking';

import { CommentCountsContext } from '../../ContextProviders/CommentCountsContext';

import { SheetsDataContext } from '../../ContextProviders/SheetsDataContext';

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
  const [project, setProject] = useState({});
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useContext(TabContext);

  const [commentCounts] = useContext(CommentCountsContext);
  const commentCount = commentCounts[project.id];

  const [sheetsData] = useContext(SheetsDataContext);
  const lastUpdate = sheetsData[project.id];

  // Update the page's title
  useEffect(() => { if (project.title) document.title = `${project.title} | CITIES Dashboard`, [project] });

  // Update the currentPage with the project's ID
  // and the chartsTitle with all the charts' titles of the project
  useEffect(() => {
    // loop through all projects and find the one with the matching id
    let chartsTitles = [];

    data.map((project) => {
      if (project.id === id) {
        setProject({ ...project });
        let temp = {};
        for (let i = 0; i < project.charts.length; i++) {
          temp[i] = 0;
        }
        setTab(temp);
        setLoading(true);
        // Populate the array with all the charts' titles of the project
        chartsTitles = project.charts.map((element, index) => ({ chartTitle: element.title, chartID: `chart-${index + 1}` }));
      }
    });

    setCurrentPage("project");
    setChartsTitlesList(chartsTitles);

  }, [id, setCurrentPage, setChartsTitlesList]);

  const theme = useTheme();

  return (
    <>
      {loading && (
        <Box width="100%">
          {
            project.id === 'air-quality' && <AirQualityIndexLegendQuickGlance />
          }

          <FullWidthBox backgroundColor='customAlternateBackground'>
            <Container sx={{ pt: 5, pb: 3 }}>

              <UppercaseTitle text={project.title} />

              <Grid container spacing={1} sx={{ pb: 3, mt: -3 }}>
                {
                  project.owners.map((owner, index) => (
                    <Grid item>
                      <CustomChip
                        key={index}
                        icon={<PersonIcon />}
                        label={owner}
                        tooltipTitle="Dataset Owner"
                      />
                    </Grid>
                  ))
                }

                <Grid item>
                  <CustomChip
                    icon={<EmailIcon />}
                    label={project.contact}
                    tooltipTitle="Contact"
                    component="a"
                    href={`mailto:${project.contact}`}
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

                {commentCount != null &&
                  <Grid item>
                    <CustomChip
                      icon={<CommentIcon />}
                      label={`${commentCount} Comment${commentCounts[project.id] > 1 ? "s" : ""}`}
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

              <DatasetDownloadDialog project={project} />
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

          <FullWidthBox id={jsonData.commentSection.id} sx={{ pt: 3, pb: 4 }}>
            <CommentSection pageID={project.id} />
          </FullWidthBox>
        </Box>
      )}
    </>
  );
};

export default Project;
