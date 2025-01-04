import { Grid } from "@mui/material";
import ScreenDropDownMenu from "../../Components/AirQuality/AirQualityScreen/ScreenDropDownMenu";
import DatasetDownloadDialog from "../../Components/DatasetDownload/DatasetDownloadDialog";
import AirQualityAlerts from "../../Components/AirQuality/AirQualityAlerts/AirQualityAlert";
import LoginPopupHandler from "../../Components/Account/LoginPopupHandler";
import useLoginHandler from "../../Components/Account/useLoginHandler";

const ProjectReservedArea = () => {
    const { loggedIn } = useLoginHandler();

    const handleLoginSuccess = () => {

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
