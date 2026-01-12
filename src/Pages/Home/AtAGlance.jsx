import { Grid, Typography, Stack, Box, Skeleton } from '@mui/material';
import { fetchDataFromURL } from '../../API/ApiFetch';
import { getApiUrl } from '../../API/APIUtils';

import GroupsIcon from '@mui/icons-material/Groups';
import FaceIcon from '@mui/icons-material/Face';
import SensorsIcon from '@mui/icons-material/Sensors';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';

import sectionData from "../../section_data.json";
import { useQuery } from '@tanstack/react-query';
import { useNetworkStatusContext } from '../../ContextProviders/NetworkStatusContext';
import { useContext } from 'react';
import { DashboardContext } from '../../ContextProviders/DashboardContext';
import { PreferenceContext } from '../../ContextProviders/PreferenceContext';
import { getTranslation } from '../../Utils/UtilFunctions';
import useSchoolMetadata from '../../hooks/useSchoolMetadata';


const IconLoader = ({ iconString }) => {
  switch (iconString) {
    case 'GroupsIcon':
      return <GroupsIcon color="primary" fontSize='large' />;
    case 'FaceIcon':
      return <FaceIcon color="primary" fontSize='large' />;
    case 'SensorsIcon':
      return <SensorsIcon color="primary" fontSize='large' />;
    case 'AssuredWorkloadIcon':
      return <AssuredWorkloadIcon color="primary" fontSize='large' />;
    default:
      return null;
  }
}

const ByTheNumber = (props) => {
  const { iconString, value, text } = props;

  return (
    <Stack direction="column" alignItems="center">
      <IconLoader iconString={iconString} />
      <Typography
        color="text.primary"
        sx={{ typography: { xs: "h6", sm: "h4", lg: "h3" }, }}
      >
        <Box fontWeight="500">
          {value ? value : <Skeleton sx={{ width: "3rem" }} />}
        </Box>
      </Typography>
      <Typography
        color="text.secondary"
        sx={{ typography: { xs: "body1", sm: "h6" } }}
        textTransform="uppercase"
      >
        <Box fontWeight="400">
          {text}
        </Box>
      </Typography>
    </Stack>
  );
}

const placeholderStats = {
  "schools": null,
  "sensorsCount": null,
  "students": null,
  "communityMembers": null
};

const AtAGlance = ({ statsForIndividualSchool = false }) => {
  const { language } = useContext(PreferenceContext);
  const { isServerDown } = useNetworkStatusContext();
  const { currentSchoolID } = useContext(DashboardContext);

  const { data: schoolStats } = useSchoolMetadata();

  const globalStatsUrl = getApiUrl({ endpoint: "stats" });
  const { data: globalStats } = useQuery({
    queryKey: [globalStatsUrl],
    queryFn: async () => {
      return fetchDataFromURL({ url: globalStatsUrl });
    },
    enabled: statsForIndividualSchool === false ? !!currentSchoolID : true,
    staleTime: 1000 * 60 * 60 * 24,
    refetchInterval: 1000 * 60 * 60 * 24, // actively refresh every day
    refetchOnWindowFocus: true,
    placeholderData: (prev) => prev
  });

  const stats = statsForIndividualSchool ? schoolStats : globalStats;

  // If server is down, don't render anything
  if (isServerDown) return null;

  return (
    <Grid
      container
      justifyContent="center"
      textAlign="center"
      rowGap={1}
      m={0}
      minHeight="100px"
    >
      {
        Object.entries(stats || placeholderStats)
          .map(([key, value]) => {
            const config = sectionData.atAGlance.content[key];
            if (!config) return;

            return (
              <Grid key={key} order={config.order} item sm={3} xs={6}>
                <ByTheNumber
                  iconString={config.icon}
                  value={value}
                  text={getTranslation(config.text || key, language)}
                />
              </Grid>
            );
          })}
    </Grid >
  );
}

export default AtAGlance;
