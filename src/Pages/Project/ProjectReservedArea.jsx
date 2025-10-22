import { Grid } from "@mui/material";
import ScreenDropDownMenu from "../../Components/AirQuality/AirQualityScreen/ScreenDropDownMenu";
import DatasetDownloadDialog from "../../Components/DatasetDownload/DatasetDownloadDialog";
import AirQualityAlerts from "../../Components/AirQuality/AirQualityAlerts/AirQualityAlert";
import LoginPopupHandler from "../../Components/Account/LoginPopupHandler";
import useLoginHandler from "../../Components/Account/useLoginHandler";
import { SnackbarMetadata } from "../../Utils/SnackbarMetadata";
import { AirQualityAlertProvider } from "../../ContextProviders/AirQualityAlertContext";
import { useSnackbar } from "notistack";

const ProjectReservedArea = () => {
    const { loggedIn } = useLoginHandler();
    const { enqueueSnackbar } = useSnackbar()

    const handleLoginSuccess = () => {
        enqueueSnackbar("You can now access Dataset and Alerts.", {
            variant: SnackbarMetadata.success.variant,
            duration: SnackbarMetadata.success.duration * 2
        });
    };

    return (
        <LoginPopupHandler
            onLoginSuccess={handleLoginSuccess}
        >
            {({ openLoginPopup }) => (
                <Grid container spacing={1} justifyContent="center" alignItems="center">
                    <Grid item>
                        {/* Use this code block if TV screen should be only for logged in users even for publicly available institutions */}
                        {/* <ScreenDropDownMenu onButtonClick={loggedIn ? null : openLoginPopup} /> */}

                        {/* For now, it doesn't require login */}
                        <ScreenDropDownMenu onButtonClick={null} />
                    </Grid>
                    <Grid item>
                        <DatasetDownloadDialog onButtonClick={loggedIn ? null : openLoginPopup} />
                    </Grid>
                    <Grid item>
                        <AirQualityAlertProvider>
                            <AirQualityAlerts onButtonClick={loggedIn ? null : openLoginPopup} />
                        </AirQualityAlertProvider>
                    </Grid>
                </Grid>
            )}
        </LoginPopupHandler>
    );
};

export default ProjectReservedArea;
