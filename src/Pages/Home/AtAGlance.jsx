import { Grid, Typography, Container, Stack } from '@mui/material';

import BarChartIcon from '@mui/icons-material/BarChart';
import GroupsIcon from '@mui/icons-material/Groups';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import homeJsonData from '../../section_data.json';

function ByTheNumber(props) {
  const { icon: Icon, number, text } = props;

  return (
    <Grid justifyContent="center" alignItems="center" item sm={3} xs={6}>
      <Stack direction="column" alignItems="center">
        <Icon fontSize="large" color="primary" />
        <Typography color="text.primary" variant="h4" fontWeight="500">
          {number}
        </Typography>
        <Typography color="text.secondary" variant="h6" fontWeight="400" textTransform="uppercase">
          {text}
        </Typography>
      </Stack>
    </Grid>
  );
}

function AtAGlance(props) {
  const { numberOfActiveDataset } = props;

  return (
    <Container>
      <Grid container direction="row" justifyContent="center" textAlign="center" m={0}>
        <ByTheNumber
          icon={BarChartIcon}
          number={numberOfActiveDataset}
          text="active datasets"
        />
        <ByTheNumber
          icon={GroupsIcon}
          number={homeJsonData.statistics.partners}
          text="partners"
        />
        <ByTheNumber
          icon={ScatterPlotIcon}
          number={homeJsonData.statistics.datapoints}
          text="datapoints"
        />
      </Grid>
    </Container>
  );
}

export default AtAGlance;
