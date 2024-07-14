import { useState } from 'react';
import { Alert, Container } from '@mui/material';

import parse from 'html-react-parser';
import { replacePlainHTMLWithMuiComponents } from '../../Utils/Utils';

const PromoAlert = (props) => {
  const { message } = props;
  const [open, setOpen] = useState(true);

  if (!open) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Alert
        severity="info"
        sx={{ py: 0.25 }}
        onClose={() => setOpen(false)}
      >
        {message ? parse(message, {
          replace: replacePlainHTMLWithMuiComponents,
        }) : ''}
      </Alert>
    </Container>
  );
}

export default PromoAlert;
