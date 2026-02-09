import { Typography, Container, Box, Stack } from '@mui/material';
import { Facebook, LinkedIn, Twitter } from '@mui/icons-material/';
import { AiFillInstagram } from 'react-icons/ai';
import CustomLink from './CustomLink';
import { CITIESair } from '../Utils/GlobalVariables';
import { ReactNode } from 'react';

function getYear(): number {
  const d = new Date();
  return d.getFullYear();
}




export default function Footer() {
  return (
    <Box width="100%" p={3} pt={2} sx={{ backgroundColor: 'customAlternateBackground' }}>
      <Container maxWidth="lg">
        <Stack direction="column" textAlign="center">
          <Typography variant="body1" fontWeight="bold" color="text.primary" pb={2}>
            {CITIESair} | Center for Interacting Urban Networks (CITIES)
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
              <CustomLink href="https://twitter.com/cities_nyuad/">
                <Twitter />
              </CustomLink>
              <CustomLink href="https://www.linkedin.com/company/center-for-interacting-urban-networks/">
                <LinkedIn />
              </CustomLink>
              <CustomLink href="https://www.facebook.com/nyuad.cities/">
                <Facebook />
              </CustomLink>
              <CustomLink href="https://www.instagram.com/cities.nyuad/">
                <AiFillInstagram />
              </CustomLink>
            </Stack>

            <CustomLink href="mailto:nyuad.cities@nyu.edu">
              nyuad.cities@nyu.edu
            </CustomLink>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
