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
                return false;
            } else {
                // Return false if the user hasn't been verified
                if (user?.is_verified === false) {
                    enqueueSnackbar(`Please verify your account first`, SnackbarMetadata.error);
                    return false;
                }

                // Return false if the user doesn't have access to this school
                if (!user?.allowedSchools.some(school => school.school_id === currentSchoolID)) {
                    enqueueSnackbar(`Your account does not have access to ${currentSchoolID.toUpperCase()} Alerts`, SnackbarMetadata.error);
                    return false;
                }

                // Else, return true to allow user access
                action?.();
                return true;
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
