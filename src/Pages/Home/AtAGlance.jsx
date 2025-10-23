import { Grid, Typography, Stack, Skeleton, Box } from '@mui/material';
import { fetchDataFromURL } from '../../API/ApiFetch';
import { GeneralAPIendpoints } from '../../API/Utils';
import { getApiUrl } from '../../API/ApiUrls';

import GroupsIcon from '@mui/icons-material/Groups';
import FaceIcon from '@mui/icons-material/Face';
import SensorsIcon from '@mui/icons-material/Sensors';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';

import sectionData from "../../section_data.json";
import { useQuery } from '@tanstack/react-query';


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

      {
        value !== null && value !== undefined
          ? (
            <Typography
              color="text.primary"
              sx={{ typography: { xs: "h6", sm: "h4", lg: "h3" }, }}
            >
              <Box fontWeight="500">
                {value}
              </Box>
            </Typography>
          )
          : <Skeleton variant="text" sx={{ width: "50%", fontSize: '3rem' }} />
      }

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

const AtAGlance = () => {
  const { data: stats } = useQuery({
    queryKey: [GeneralAPIendpoints.stats],
    queryFn: async () => {
      const url = getApiUrl({ endpoint: GeneralAPIendpoints.stats });
      return fetchDataFromURL({ url });
    },
    staleTime: 1000 * 60 * 60 * 24,
    refetchInterval: 1000 * 60 * 60 * 24, // actively refresh every day
    refetchOnWindowFocus: true,
    placeholderData: (prev) => prev
  });

  return (
    <Grid
      container
      justifyContent="center"
      textAlign="center"
      rowGap={1}
      m={0}
    >
      {sectionData.atAGlance.content.map((item, index) => (
        <Grid
          key={`by-the-number-${index}`}
          item
          justifyContent="center"
          alignItems="center"
          sm={3}
          xs={6}
        >
          <ByTheNumber
            iconString={item.icon}
            value={stats ? stats[item.id] : null}
            text={item.text}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default AtAGlance;
