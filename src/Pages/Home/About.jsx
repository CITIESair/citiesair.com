import { Stack, Typography, Paper } from '@mui/material';

import parse from 'html-react-parser';
import UppercaseTitle from '../../Components/UppercaseTitle';
import ExpandableSection from '../../Components/ExpandableSection/ExpandableSection';
import jsonData from '../../section_data.json';
import { replacePlainHTMLWithMuiComponents, capitalizePhrase } from '../../Utils/UtilFunctions';

function About() {
  return (
    <>
      <UppercaseTitle text={capitalizePhrase(jsonData.about.id)} />
      <Stack spacing={3}>
        {jsonData.about.content.map((element, index) => (
          <Paper key={index} elevation={2} sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {parse(element.mainText, {
                replace: replacePlainHTMLWithMuiComponents,
              })}
            </Typography>
            {
              element.reference && (
                <ExpandableSection
                  title={"Reference"}
                  content={(
                    <Typography variant="caption" color="text.secondary">
                      {parse(element.reference, {
                        replace: replacePlainHTMLWithMuiComponents,
                      })}
                    </Typography>
                  )}
                />
              )
            }
          </Paper>
        ))}
        <Typography variant="caption" color="text.secondary" sx={{ px: 3 }}>
          {parse(jsonData.disclaimer.content, {
            replace: replacePlainHTMLWithMuiComponents,
          })}
        </Typography>
      </Stack>
    </>
  );
}

export default About;
