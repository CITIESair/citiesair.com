import { Grid, Typography, Stack, Skeleton, Box } from '@mui/material';
import { useContext, useEffect } from 'react';
import { MetadataContext } from '../../ContextProviders/MetadataContext';
import { fetchDataFromURL } from '../../API/ApiFetch';
import { GeneralAPIendpoints } from '../../API/Utils';
import { getApiUrl } from '../../API/ApiUrls';

import GroupsIcon from '@mui/icons-material/Groups';
import FaceIcon from '@mui/icons-material/Face';
import SensorsIcon from '@mui/icons-material/Sensors';
import SchoolIcon from '@mui/icons-material/School';

import jsonData from "../../section_data.json";

const IconLoader = ({ iconString }) => {
  switch (iconString) {
    case 'GroupsIcon':
      return <GroupsIcon color="primary" fontSize='large' />;
    case 'FaceIcon':
      return <FaceIcon color="primary" fontSize='large' />;
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
      <IconLoader iconString={iconString} />

      {
        value !== null && value !== undefined
          ? (
            <Typography
              color="text.primary"
              sx={{ typography: { xs: "h6", sm: "h4" }, }}
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
        sx={{ typography: { xs: "body2", sm: "h6" } }}
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


  return (
    <Grid
      container
      justifyContent="center"
      textAlign="center"
      gap={1}
      m={0}
    >
      {jsonData.atAGlance.content.map((item, index) => (
        <Grid
          key={`by-the-number-${index}`}
          item
          justifyContent="center"
          alignItems="center"
          sm={2.75}
          xs={5.5}
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
