import { useEffect, useRef, useCallback, useContext, useState } from "react";
import { AppRoutes } from "../../Utils/AppRoutes";
import { LoginTypes } from "../Account/Utils";
import { SnackbarMetadata } from '../../Utils/SnackbarMetadata';
import { UserContext } from "../../ContextProviders/UserContext";
import EmailVerificationDialog from "./EmailVerificationDialog";
import { useSnackbar } from "notistack";

const LoginPopupHandler = ({ onLoginSuccess, children }) => {
    const popupRef = useRef(null);
    const { enqueueSnackbar } = useSnackbar()
    const { setAuthenticationState, setUser } = useContext(UserContext);

    const [showVerificationDialog, setShowVerificationDialog] = useState(false);
    const [email, setEmail] = useState("");

    const openLoginPopup = useCallback(() => {
        const width = 500;
        const height = 600;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;

        const popup = window.open(
            AppRoutes.login,
            "Login",
            `width=${width},height=${height},top=${top},left=${left}`
        );

        if (popup) {
            popup.focus();
            popupRef.current = popup;

            const intervalId = setInterval(() => {
                if (popup.closed) {
                    clearInterval(intervalId);
                    window.removeEventListener("message", handleMessage);
                    popupRef.current = null;
                }
            }, 500);
        } else {
            alert("Popup blocked. Please enable popups for login.");
        }
    }, []);

    const handleMessage = useCallback(
        (event) => {
            if (event.origin === window.location.origin && event.data.type === LoginTypes.password) {
                if (event.data.success) {
                    const user = event.data.user;

                    setAuthenticationState({
                        checkedAuthentication: true,
                        authenticated: true,
                    });
                    setUser(user);

                    if (user.message) {
                        enqueueSnackbar(user.message, {
                            variant: SnackbarMetadata.success.name,
                            duration: SnackbarMetadata.success.duration
                        });
                    }

                    if (user.is_verified === false) {
                        setShowVerificationDialog(true);
                        setEmail(user.email);
                    }

                    onLoginSuccess?.();
                }
            }
        },
        [onLoginSuccess]
    );

    useEffect(() => {
        window.addEventListener("message", handleMessage);
        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, [handleMessage]);

    return (
        <>
            {children({
                openLoginPopup,
            })}
            <EmailVerificationDialog
                open={showVerificationDialog}
                email={email}
            />
        </>
    );
};

export default LoginPopupHandler;
