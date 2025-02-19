import { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Container } from '@mui/material';
import { MetadataContext } from '../ContextProviders/MetadataContext';
import { AppRoutes } from '../Utils/AppRoutes';
import { CITIESair } from '../Utils/GlobalVariables';

export default function FourOhFour({ title }) {
  // Update the page's title
  useEffect(() => {
    document.title = title;
  }, [title]);

  const { setCurrentPage } = useContext(MetadataContext);

  // set underline link to 404 (to undo any other underlined links)
  useEffect(() => {
    setCurrentPage(AppRoutes[404]);
  }, [setCurrentPage]);

  return (
    <Container sx={{ p: 5, textAlign: 'center', margin: 'auto' }}>
      <Typography
        variant="h3"
        fontWeight="medium"
        color="text.primary"
        gutterBottom
      >
        Page not found
      </Typography>
      <Typography variant="h5" color="text.secondary" gutterBottom>
        Please contact {CITIESair} if you think this is a mistake.
      </Typography>
      <Button component={Link} to="/" variant="contained" sx={{ mt: 3 }}>
        <Typography>Return home</Typography>
      </Button>
    </Container>
  );
}
