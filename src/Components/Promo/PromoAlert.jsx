import { Alert, Container } from "@mui/material";
import FullWidthBox from "../FullWidthBox";

const PromoAlert = (props) => {
  const { message } = props;

  return (
    <FullWidthBox sx={{
      backgroundColor: "customAlternateBackground",
      pt: 4
    }}>
      <Container maxWidth="lg">
        <Alert severity="info">{message}</Alert>
      </Container >
    </FullWidthBox>
  )
}

export default PromoAlert;