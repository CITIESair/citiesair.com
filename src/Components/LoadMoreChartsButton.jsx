import { Button } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const LoadMoreChartsButton = () => {
  return (
    <Button
      variant="contained"
    >
      <KeyboardArrowDownIcon sx={{ fontSize: '1rem' }} />&nbsp;Load More Charts
    </Button>
  )
}
export default LoadMoreChartsButton;