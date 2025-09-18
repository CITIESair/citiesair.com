import { Box, Typography, Container, Paper } from '@mui/material';
import { Comments } from '@hyvor/hyvor-talk-react';

import { styled } from '@mui/material/styles';

import parse from 'html-react-parser';
import sectionData from '../section_data.json';
import UppercaseTitle from './UppercaseTitle';
import { replacePlainHTMLWithMuiComponents, capitalizePhrase } from '../Utils/UtilFunctions';
import { HYVOR_WEBSITE_ID } from '../Utils/GlobalVariables';

const StyledHyvorTalk = styled(Box)(({ theme }) => ({
  paddingBottom: theme.spacing(2),
  '& *': {
    color: theme.palette.text.secondary
  },
  '& hyvor-talk-comments': {
    '--ht-color-accent': theme.palette.primary.main,
    '--ht-color-accent-text': theme.palette.primary.contrastText,
    '--ht-color-box': theme.palette.customBackground,
    '--ht-color-box-text': theme.palette.text.secondary,
    '--ht-color-box-text-light': theme.palette.text.secondaryRGB,
    '--ht-button-radius': theme.spacing(1)
  }
}));

function CommentSection({ pageID }) {
  return (
    <Container>
      <UppercaseTitle text={capitalizePhrase(sectionData.commentSection.id)} />
      <Box maxWidth="lg" margin="auto">
        <Paper elevation={2} sx={{ p: 3, pb: 0 }}>
          <Typography variant="body2" color="text.secondary" sx={{ pb: 1 }}>
            {parse(sectionData.commentSection.content, {
              replace: replacePlainHTMLWithMuiComponents,
            })}
          </Typography>
          <StyledHyvorTalk>
            <Comments
              website-id={HYVOR_WEBSITE_ID}
              page-id={pageID}
              loading="lazy"
            />
          </StyledHyvorTalk>
        </Paper>
      </Box>
    </Container>
  );
}

export default CommentSection;
