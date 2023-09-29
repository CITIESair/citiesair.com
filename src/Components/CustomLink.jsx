import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';

const StyledLink = styled(Link)(({ theme }) => ({
  '&:hover': {
    color: theme.palette.primary.main,
  }
}));

export default function CustomLink({ href, text }) {
  return (
    <StyledLink href={href} variant="body1" color="text.secondary" target="_blank" rel="noreferrer">
      {text}
    </StyledLink>
  );
}
