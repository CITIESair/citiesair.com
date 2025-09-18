import { Typography, Paper } from '@mui/material';

import parse from 'html-react-parser';
import UppercaseTitle from '../../Components/UppercaseTitle';

import sectionData from '../../section_data.json';
import { replacePlainHTMLWithMuiComponents, capitalizePhrase } from '../../Utils/UtilFunctions';

function GetInTouch() {
  return (
    <>
      <UppercaseTitle text={capitalizePhrase(sectionData.getInTouch.id)} />
      <Paper elevation={2} sx={{ p: 3, pb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {parse(sectionData.getInTouch.content, {
            replace: replacePlainHTMLWithMuiComponents,
          })}
        </Typography>
      </Paper>
    </>
  );
}

export default GetInTouch;
