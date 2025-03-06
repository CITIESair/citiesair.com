import { useContext, useCallback } from "react";
import { UserContext } from "../../ContextProviders/UserContext";
import { DashboardContext } from "../../ContextProviders/DashboardContext";
import { useSnackbar } from "notistack";
import { SnackbarMetadata } from "../../Utils/SnackbarMetadata";

const useLoginHandler = (openLoginPopup) => {
    const { authenticationState, user } = useContext(UserContext);
    const loggedIn = authenticationState.authenticated && authenticationState.checkedAuthentication;
    const { currentSchoolID } = useContext(DashboardContext);
    const { enqueueSnackbar } = useSnackbar()

    const handleRestrictedAccess = useCallback(
        (action) => {
            if (!loggedIn) {
                openLoginPopup?.();
            } else {
                if (user?.allowedSchools.some(school => school.school_id === currentSchoolID)) {
                    action?.();
                } else {
                    enqueueSnackbar(`Your account does not have access to ${currentSchoolID.toUpperCase()} Alerts`, SnackbarMetadata.error);
                }
            }
        },
        [loggedIn, openLoginPopup, currentSchoolID, user, enqueueSnackbar]
    );

    return {
        loggedIn,
        handleRestrictedAccess,
    };
};

export default useLoginHandler;
