import { useContext } from "react";
import QRCode from "react-qr-code";
import { DashboardContext } from "../../../ContextProviders/DashboardContext";
import { CITIESair_HOST_NAME } from "../../../Utils/GlobalVariables";

const ScreenQRcode = () => {
    const { schoolMetadata, currentSchoolID } = useContext(DashboardContext);
    const isPublic = schoolMetadata?.is_public;

    const url = document.location.href;
    const urlComponents = url.split('screen');
    const urlAfterScreen = `${'screen'}${urlComponents.pop()}`;

    const qrValue = isPublic === true
        ? `${CITIESair_HOST_NAME}/dashboard/${currentSchoolID}?source=${urlAfterScreen}`
        : `${CITIESair_HOST_NAME}?source=${urlAfterScreen}`;

    return (
        <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={qrValue}
            viewBox={`0 0 256 256`}
        />
    );
};

export default ScreenQRcode;

