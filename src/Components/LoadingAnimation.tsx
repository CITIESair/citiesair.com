import { Typography, Container, CircularProgress, Stack } from '@mui/material/';

interface LoadingAnimationProps {
  optionalText?: string;
}

export default function LoadingAnimation({ optionalText }: LoadingAnimationProps) {
  return (
    <Container sx={{ height: '100%' }}>
      <Stack
        p={4}
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={1}
        height="100%"
      >
        <CircularProgress disableShrink size="1.5rem" />
        {optionalText && (
          <Typography variant="body2" textAlign="center" color="text.primary">
            {optionalText}
          </Typography>
        )}
      </Stack>
    </Container>
  );
}
