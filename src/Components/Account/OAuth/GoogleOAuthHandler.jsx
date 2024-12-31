import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertSeverity, useNotificationContext } from "../../../ContextProviders/NotificationContext";
import { getApiUrl } from "../../../API/ApiUrls";
import { GeneralAPIendpoints, RESTmethods } from "../../../API/Utils";
import { fetchDataFromURL } from "../../../API/ApiFetch";
import { UserContext } from "../../../ContextProviders/UserContext";
import { AppRoutes } from "../../../Utils/AppRoutes";
import { CircularProgress, Container, Paper, Typography } from "@mui/material";

export default function GoogleOAuthHandler() {
    const navigate = useNavigate();
    const { setShowNotification, setMessage, setSeverity } = useNotificationContext();
    const { authenticationState, setUser, setAuthenticationState } = useContext(UserContext);
    const [status, setStatus] = useState("Initiating authentication...");

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const redirect_url = queryParams.get(AppRoutes.redirectQuery)?.toLowerCase() || AppRoutes.dashboard;

    const gracefulErrorHandling = () => {
        navigate("/login", { replace: true });
        setMessage("Something went wrong with Google Authentication, please try again later.");
        setSeverity(AlertSeverity.error);
        setShowNotification(true);
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get("code");
        if (code) {
            setStatus("Processing authentication...");
            handleGoogleLogin(code);
        } else {
            console.error("Authorization code not found in the URL.");
            setStatus("Authentication failed");
            gracefulErrorHandling();
        }
    }, []);

    const handleGoogleLogin = async (code) => {
        fetchDataFromURL({
            url: getApiUrl({ endpoint: GeneralAPIendpoints.googleCallback }),
            restMethod: RESTmethods.POST,
            body: { code }
        }).then((data) => {
            setAuthenticationState({
                checkedAuthentication: true,
                authenticated: true
            })
            setUser(data);

            if (data.message) {
                setMessage(data.message);
                setSeverity(AlertSeverity.success);
                setShowNotification(true);
            }

            setStatus("Authentication successful. Redirecting...");
        }).catch((error) => {
            console.error("Error during Google login:", error);
            setStatus("Authentication failed. Please try again.");
            gracefulErrorHandling();
        })
    };

    useEffect(() => {
        if (authenticationState.checkedAuthentication && authenticationState.authenticated) {
            navigate(redirect_url, { replace: true });
        }
    }, [authenticationState]);

    return (
        <Container maxWidth="sm" sx={{ my: 3 }}>
            <Paper sx={{ p: 3 }} elevation={3}>
                <Typography variant="h5" fontWeight={500} gutterBottom>
                    Google Authentication
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {status}
                </Typography>
                <CircularProgress disableShrink color="inherit" size="1.5rem" />
            </Paper>
        </Container>
    );
}
