import { Alert, Box } from "@mui/material";

const NoChartToRender = ({ dataType, height, selectableAxes }) => {
    let messagePrefix = "This sensor ";
    let messageSuffix = " data. Choose a different sensor or data type.";

    if (selectableAxes) {
        messagePrefix = "This pair of sensors ";
        messageSuffix = " correlation data. Choose another pair or a different data type."
    }

    return (
        <Box height={height}>
            <Alert severity="error" sx={{ my: 2 }}>
                {messagePrefix}
                does not have&nbsp;
                <Box component="span" textTransform="capitalize">
                    {dataType}
                </Box>
                {messageSuffix}
            </Alert>
        </Box>
    )
}

export default NoChartToRender;