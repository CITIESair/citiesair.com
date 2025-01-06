import { Grid } from "@mui/material";
import ScreenDropDownMenu from "../../Components/AirQuality/AirQualityScreen/ScreenDropDownMenu";
import DatasetDownloadDialog from "../../Components/DatasetDownload/DatasetDownloadDialog";
import AirQualityAlerts from "../../Components/AirQuality/AirQualityAlerts/AirQualityAlert";
import LoginPopupHandler from "../../Components/Account/LoginPopupHandler";
import useLoginHandler from "../../Components/Account/useLoginHandler";
import { SnackbarMetadata } from "../../Utils/SnackbarMetadata";
import { useSnackbar } from "notistack";

const ProjectReservedArea = () => {
    const { loggedIn } = useLoginHandler();
    const { enqueueSnackbar } = useSnackbar()

    const handleLoginSuccess = () => {
        enqueueSnackbar("You can now access TV Screens, Dataset, and Alerts functionalities.", {
            variant: SnackbarMetadata.success.name,
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
                        <ScreenDropDownMenu onButtonClick={loggedIn ? null : openLoginPopup} />
                    </Grid>
                    <Grid item>
                        <DatasetDownloadDialog onButtonClick={loggedIn ? null : openLoginPopup} />
                    </Grid>
                    <Grid item>
                        <AirQualityAlerts onButtonClick={loggedIn ? null : openLoginPopup} />
                    </Grid>
                </Grid>
            )}
        </LoginPopupHandler>
    );
};

export default ProjectReservedArea;
