import { Typography, Container, Box, Stack } from '@mui/material';
import { Facebook, LinkedIn, Twitter } from '@mui/icons-material/';
import { AiFillInstagram } from 'react-icons/ai';
import CustomLink from './CustomLink';

function getYear() {
  const d = new Date();
  return d.getFullYear();
}

export default function Footer() {
  return (
    <Box width="100%" backgroundColor="customAlternateBackground" p={3} pt={2}>
      <Container maxWidth="lg">
        <Stack direction="column" textAlign="center">
          <Typography variant="body1" fontWeight="bold" color="text.primary" pb={2}>
            CITIESair | Center for Interacting Urban Networks (CITIES)
            <br />
            {getYear()}
          </Typography>

          <Stack direction="column">
            <Stack
              direction="row"
              spacing={1}
              justifyContent="center"
              sx={{
                '& svg': {
                  fontSize: '2rem'
                }
              }}
            >
              <CustomLink href="https://twitter.com/cities_nyuad/" text={<Twitter />} />
              <CustomLink href="https://www.linkedin.com/company/center-for-interacting-urban-networks/" text={<LinkedIn />} />
              <CustomLink href="https://www.facebook.com/nyuad.cities/" text={<Facebook />} />
              <CustomLink href="https://www.instagram.com/cities.nyuad/" text={<AiFillInstagram />} />
            </Stack>

            <CustomLink href="mailto:nyuad.cities@nyu.edu" text="nyuad.cities@nyu.edu" />
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
