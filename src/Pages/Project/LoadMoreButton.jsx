import { Stack, Button } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useContext } from "react";
import { DashboardContext } from "../../ContextProviders/DashboardContext";

const LoadMoreButton = () => {
    const { loadMoreCharts, setLoadMoreCharts } = useContext(DashboardContext);

    if (loadMoreCharts === false) {
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
    else {
        return null;
    }
}

export default LoadMoreButton;