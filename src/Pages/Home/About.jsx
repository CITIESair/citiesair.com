import { Stack, Typography, Paper } from '@mui/material';

import parse from 'html-react-parser';
import UppercaseTitle from '../../Components/UppercaseTitle';

import jsonData from '../../section_data.json';
import { replacePlainHTMLWithMuiComponents, capitalizePhrase } from '../../Utils/Utils';

function About() {
  return (
    <>
      <UppercaseTitle text={capitalizePhrase(jsonData.about.id)} />
      <Stack spacing={3}>
        {jsonData.about.content.map((element, index) => (
          <Paper key={index} elevation={2} sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {parse(element, {
                replace: replacePlainHTMLWithMuiComponents,
              })}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </>
  );
}

export default About;
