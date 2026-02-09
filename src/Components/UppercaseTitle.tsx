import { Skeleton, Typography, TypographyProps } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

interface UppercaseTitleProps extends TypographyProps {
  text?: string;
  sx?: SxProps<Theme>;
}

export default function UppercaseTitle({ text, sx, ...otherProps }: UppercaseTitleProps) {
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
