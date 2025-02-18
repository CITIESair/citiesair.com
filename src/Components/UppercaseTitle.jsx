import { Skeleton, Typography } from '@mui/material';

export default function UppercaseTitle({ text, sx, ...otherProps }) {
  return (
    <Typography
      variant="h4"
      color="text.primary"
      sx={{
        fontWeight: 'medium',
        display: 'block',
        textTransform: 'uppercase',
        pb: 3,
        lineHeight: 1,
        ...sx
      }}
      {...otherProps}
    >
      {text || <Skeleton variant='text' />}
    </Typography>
  );
}
