import { Grid, Typography, Container, Stack, Skeleton } from '@mui/material';
import { useContext, useEffect } from 'react';
import { MetadataContext } from '../../ContextProviders/MetadataContext';
import { fetchDataFromURL } from '../../API/ApiFetch';
import { GeneralAPIendpoints } from '../../API/Utils';
import { isValidArray } from '../../Utils/UtilFunctions';
import { getApiUrl } from '../../API/ApiUrls';

import GroupsIcon from '@mui/icons-material/Groups';
import TimelineIcon from '@mui/icons-material/Timeline';
import SensorsIcon from '@mui/icons-material/Sensors';
import SchoolIcon from '@mui/icons-material/School';

const IconLoader = ({ iconString }) => {
  switch (iconString) {
    case 'GroupsIcon':
      return <GroupsIcon color="primary" fontSize='large' />;
    case 'TimelineIcon':
      return <TimelineIcon color="primary" fontSize='large' />;
    case 'SensorsIcon':
      return <SensorsIcon color="primary" fontSize='large' />;
    case 'SchoolIcon':
      return <SchoolIcon color="primary" fontSize='large' />;
    default:
      return null;
  }
}

const ByTheNumber = (props) => {
  const { iconString, value, text } = props;

  return (
    <Stack direction="column" alignItems="center">
      {
        iconString
          ? <IconLoader iconString={iconString} />
          : <Skeleton variant="circular" width={40} height={40} />
      }

      {
        value !== null && value !== undefined
          ? (
            <Typography color="text.primary" variant="h4" fontWeight="500">
              {value}
            </Typography>
          )
          : <Skeleton variant="text" sx={{ width: "50%", fontSize: '3rem' }} />
      }

      {
        text
          ? (
            <Typography color="text.secondary" variant="h6" fontWeight="400" textTransform="uppercase">
              {text}
            </Typography>
          )
          : <Skeleton variant="text" sx={{ width: "80%", fontSize: '2rem' }} />
      }
    </Stack>
  );
}

const AtAGlance = () => {
  const { stats, setStats } = useContext(MetadataContext);

  useEffect(() => {
    if (!stats) {
      fetchDataFromURL({
        url: getApiUrl({ endpoint: GeneralAPIendpoints.stats })
      })
        .then((data) => {
          setStats(data);
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }, [stats, setStats]);

  // Create an array of size 4 for loading skeletons
  const skeletonArray = Array(4).fill(null);

  return (
    <Container>
      <Grid
        container
        justifyContent="center"
        textAlign="center"
        spacing={1}
        m={0}
      >
        {(isValidArray(stats) ? stats : skeletonArray).map((stat, index) => (
          <Grid
            key={`by-the-number-${index}`}
            item
            justifyContent="center"
            alignItems="center"
            sm={3}
            xs={6}
          >
            <ByTheNumber
              iconString={stat?.icon}
              value={stat?.value}
              text={stat?.text}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default AtAGlance;
