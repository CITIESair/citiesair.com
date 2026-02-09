import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const FullWidthBox = styled(Box)({
  paddingLeft: 'env(safe-area-inset-left)',
  paddingRight: 'env(safe-area-inset-right)',
});

export default FullWidthBox;
