import { Alert, Box } from "@mui/material";

const NoChartToRender = ({ customMessage, dataType, height, isPairOfSensor = false }) => {
    const item = isPairOfSensor ? "sensor" : "pair of sensors";
    let messagePrefix = `This ${item} `;
    let messageSuffix = ` data. Choose a different ${item} or data type.`;

    return (
        <Box height={height}>
            <Alert severity="error" sx={{ my: 2 }}>
                {
                    customMessage ? customMessage : (
                        <>
                            {messagePrefix}
                            does not have&nbsp;
                            <Box component="span" textTransform="capitalize">
                                {dataType}
                            </Box>
                            {messageSuffix}
                        </>
                    )
                }
            </Alert>
        </Box>
    )
}

export default NoChartToRender;