// disable eslint for this file
/* eslint-disable */
import { Button } from "@mui/material";
import { Link } from 'react-router-dom';
import TvIcon from '@mui/icons-material/Tv';

const ScreenDialog = () => {
  return (
    <Button
      variant="contained"
      component={Link}
      to="screen"
    >
      <TvIcon sx={{ fontSize: '1rem' }} />&nbsp;TV Screen
    </Button>
  )
};

export default ScreenDialog;