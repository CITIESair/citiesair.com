import { useContext, useCallback } from "react";
import { UserContext } from "../../ContextProviders/UserContext";

const useLoginHandler = (openLoginPopup) => {
    const { authenticationState } = useContext(UserContext);
    const loggedIn = authenticationState.authenticated && authenticationState.checkedAuthentication;

    const handleRestrictedAccess = useCallback(
        (action) => {
            if (!loggedIn) {
                openLoginPopup?.();
            } else {
                action?.();
            }
        },
        [loggedIn, openLoginPopup]
    );

    return {
        loggedIn,
        handleRestrictedAccess,
    };
};

export default useLoginHandler;
