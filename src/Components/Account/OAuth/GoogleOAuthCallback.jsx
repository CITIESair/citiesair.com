import { useEffect, useState } from "react";
import { getApiUrl } from "../../../API/ApiUrls";
import { GeneralAPIendpoints, RESTmethods } from "../../../API/Utils";
import { fetchDataFromURL } from "../../../API/ApiFetch";
import { Container, Paper, Typography, CircularProgress } from "@mui/material";
import { LoginTypes } from "../Utils";

export default function GoogleOAuthCallback() {
    const [status, setStatus] = useState("Initiating authentication...");

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get("code");
        if (code) {
            setStatus("Processing authentication...");

            fetchDataFromURL({
                url: getApiUrl({ endpoint: GeneralAPIendpoints.googleCallback }),
                restMethod: RESTmethods.POST,
                body: { code },
            }).then((data) => {
                // Send the result to the main window
                window.opener.postMessage(
                    {
                        type: LoginTypes.google,
                        success: true,
                        user: data,
                    },
                    window.location.origin
                );
            }).catch((error) => {
                setStatus("Authentication failed");
                console.error("Error during Google login:", error);

                // Notify the main window of the error
                window.opener.postMessage(
                    {
                        type: LoginTypes.google,
                        success: false,
                        errorMessage: error.message
                    },
                    window.location.origin
                );
            }).finally(() => {
                window.close(); // Close the popup
            });

        } else {
            setStatus("Authentication failed");
            console.error("Authorization code is missing from the URL.");

            // Notify the main window about the failure
            window.opener.postMessage(
                {
                    type: LoginTypes.google,
                    success: false,
                    errorMessage: "Google Login failed, please try again."
                },
                window.location.origin
            );

            // Close the popup
            window.close();
        }
    }, []);

    return (
        <Container maxWidth="sm" sx={{ my: 3 }}>
            <Paper sx={{ p: 3 }} elevation={3}>
                <Typography variant="h5" fontWeight={500} gutterBottom>
                    Google Login
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {status}
                </Typography>
                <CircularProgress disableShrink color="inherit" size="1.5rem" />
            </Paper>
        </Container>
    );
}
