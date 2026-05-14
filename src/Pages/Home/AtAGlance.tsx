import { Grid, Typography, Stack, Box, Skeleton } from '@mui/material';
import { fetchDataFromURL } from '../../API/ApiFetch';
import { getApiUrl } from '../../API/APIUtils';

import GroupsIcon from '@mui/icons-material/Groups';
import FaceIcon from '@mui/icons-material/Face';
import SensorsIcon from '@mui/icons-material/Sensors';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';

import sectionData from "../../SectionData/sectionData";
import { useQuery } from '@tanstack/react-query';
import { useNetworkStatus } from '../../ContextProviders/NetworkStatusContext';
import { getTranslation } from '../../Utils/UtilFunctions';
import useSchoolMetadata from '../../hooks/useSchoolMetadata';
import { usePreferences } from '../../ContextProviders/PreferenceContext';
import { useDashboard } from '../../ContextProviders/DashboardContext';
import type { paths, components } from '../../types/backend-api.types';

// OpenAPI type for stats endpoint response
type GetStatsResponse =
  paths["/stats"]["get"]["responses"][200]["content"]["application/json"];

export type StatsResponse = components["schemas"]["StatsResponse"];

type IconString = 'GroupsIcon' | 'FaceIcon' | 'SensorsIcon' | 'AssuredWorkloadIcon';

interface IconLoaderProps {
  iconString: IconString;
}

const IconLoader = ({ iconString }: IconLoaderProps): JSX.Element | null => {
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

interface ByTheNumberProps {
  iconString: IconString;
  value: string | number | null;
  text: string;
}

const ByTheNumber = ({ iconString, value, text }: ByTheNumberProps) => {
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

const placeholderStats: StatsResponse = {
  schools: "",
  sensorsCount: "",
  students: null,
  communityMembers: null
};

interface AtAGlanceProps {
  statsForIndividualSchool?: boolean;
}

const AtAGlance = ({ statsForIndividualSchool = false }: AtAGlanceProps) => {
  const { language } = usePreferences();
  const { isServerDown } = useNetworkStatus();
  const { currentSchoolID } = useDashboard();

  const { data: schoolStats } = useSchoolMetadata();

  const globalStatsUrl = getApiUrl({ endpoint: "stats" });
  const { data: globalStats } = useQuery<GetStatsResponse>({
    queryKey: [globalStatsUrl],
    queryFn: async () => {
      return fetchDataFromURL({ url: globalStatsUrl }) as Promise<GetStatsResponse>;
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
            const config = sectionData.atAGlance.content[key as keyof typeof sectionData.atAGlance.content];
            if (!config) return null;

            // Only render if value is a valid stat type (string, number, or null)
            const isValidStatValue =
              typeof value === 'string' ||
              typeof value === 'number' ||
              value === null;

            if (!isValidStatValue) return null;

            // Type assertion after validation
            const statValue = value as string | number | null;

            return (
              <Grid key={key} order={config.order} item sm={3} xs={6}>
                <ByTheNumber
                  iconString={config.icon as IconString}
                  value={statValue}
                  text={getTranslation(config.text || key, language) as string}
                />
              </Grid>
            );
          })}
    </Grid >
  );
}

export default AtAGlance;
