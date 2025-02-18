import { Button } from "@mui/material";
import { useTheme } from '@emotion/react';
import { AppRoutes } from '../../../Utils/AppRoutes';
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../ContextProviders/UserContext";
import { SnackbarMetadata } from '../../../Utils/SnackbarMetadata';
import { LoginTypes } from "../Utils";
import { useSnackbar } from "notistack";

const svgs = {
    light: 'images/oauth/google/web_light_sq_ctn.svg',
    dark: 'images/oauth/google/web_dark_sq_ctn.svg'
}

export default function GoogleOAuthButtonAndPopupHandler() {
    const [isPopupItself, setIsPopupItself] = useState(false);

    useEffect(() => {
        // Check if the window was opened as a popup
        if (window.opener) {
            setIsPopupItself(true);
        }
    }, []);

    const navigate = useNavigate();
    const { setUser, setAuthenticationState } = useContext(UserContext);
    const { enqueueSnackbar } = useSnackbar()

    const theme = useTheme();
    const currentSvg = theme.palette.mode === 'dark' ? svgs.dark : svgs.light;

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const redirect_url = queryParams.get(AppRoutes.redirectQuery)?.toLowerCase() || AppRoutes.dashboard;

    const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=205604064780-1jsjqcvf6isv0up6v29c42uvdigb0pbp.apps.googleusercontent.com&redirect_uri=${window.location.origin}${AppRoutes.googleCallback}&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&access_type=offline&prompt=consent`;

    const handleOAuthClick = () => {
        const width = 500;
        const height = 600;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;

        const popup = window.open(
            googleOAuthUrl,
            "GoogleOAuth",
            `width=${width},height=${height},top=${top},left=${left}`
        );

        if (popup) {
            popup.focus();

            // Listen for the message from the popup
            window.addEventListener("message", (event) => {
                if (event.origin === window.location.origin && event.data.type === LoginTypes.google) {
                    if (event.data.success) {
                        const userData = event.data.user;
                        if (isPopupItself) {
                            // Send the result to the main window
                            window.opener.postMessage(
                                {
                                    type: LoginTypes.password,
                                    success: true,
                                    user: userData,
                                },
                                window.location.origin
                            );

                            window.close(); // Close the popup
                        } else {
                            setAuthenticationState({
                                checkedAuthentication: true,
                                authenticated: true
                            });
                            setUser(userData);

                            if (userData.message) {
                                enqueueSnackbar(userData.message, {
                                    variant: SnackbarMetadata.success.name,
                                    duration: SnackbarMetadata.success.duration
                                });
                            }

                            navigate(redirect_url, { replace: true });
                        }
                    } else {
                        enqueueSnackbar(event.data.errorMessage, {
                            variant: SnackbarMetadata.error.name,
                            duration: SnackbarMetadata.error.duration
                        });
                    }
                }
            });
        } else {
            alert("Popup blocked. Please enable popups for Google Login.");
        }
    };

    return (
        <Button fullWidth variant="outlined" sx={{ p: 0 }} onClick={handleOAuthClick}>
            <img src={currentSvg} alt="Google OAuth Button" />
        </Button>
    );
}