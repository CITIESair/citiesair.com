import { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Container } from '@mui/material';
import { LinkContext } from '../ContextProviders/LinkContext';

export default function FourOhFour({ title }) {
  // Update the page's title
  useEffect(() => {
    document.title = title;
  }, [title]);

  const [_, setCurrentPage] = useContext(LinkContext);

  // set underline link to 404 (to undo any other underlined links)
  useEffect(() => {
    setCurrentPage('404');
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
        Please contact CITIESair if you think this is a mistake.
      </Typography>
      <Button component={Link} to="/" variant="contained" sx={{ mt: 3 }}>
        <Typography>Return home</Typography>
      </Button>
    </Container>
  );
}
