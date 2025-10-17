import { useContext } from "react";
import QRCode from "react-qr-code";
import { DashboardContext } from "../../../ContextProviders/DashboardContext";
import { CITIESair_HOST_NAME } from "../../../Utils/GlobalVariables";
import useSchoolMetadata from "../../../hooks/useSchoolMetadata";

const ScreenQRcode = () => {
    const { currentSchoolID } = useContext(DashboardContext);
    const { data: schoolMetadata } = useSchoolMetadata();
    const isPublic = schoolMetadata?.is_public;

    const url = document.location.href;
    const urlComponents = url.split('screen');
    const urlAfterScreen = `${'screen'}${urlComponents.pop()}`;
    const sanitizedUrlAfterScreen = urlAfterScreen.split('?')[0];

    const qrValue = isPublic === true
        ? `https://${CITIESair_HOST_NAME}/dashboard/${currentSchoolID}?source=${sanitizedUrlAfterScreen}`
        : `https://${CITIESair_HOST_NAME}?source=${sanitizedUrlAfterScreen}`;

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

