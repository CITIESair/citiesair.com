import { Button, Stack } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useContext } from "react";
import { DashboardContext } from "../ContextProviders/DashboardContext";

const LoadMoreChartsButton = () => {
  const { setLoadMoreCharts } = useContext(DashboardContext);

  return (
    <Stack sx={{ mt: 6, mx: 'auto', maxWidth: 'sm' }}>
      <Button
        variant="contained"
        onClick={() => {
          setLoadMoreCharts(true);
        }}
      >
        <KeyboardArrowDownIcon sx={{ fontSize: '1rem' }} />&nbsp;Load More Charts
      </Button>
    </Stack>
  )
}
export default LoadMoreChartsButton;