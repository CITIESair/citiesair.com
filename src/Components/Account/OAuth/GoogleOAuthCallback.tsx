import { useEffect, useState } from "react";

import { CircularProgress, Container, Paper, Typography } from "@mui/material";

import { fetchDataFromURL } from "../../../API/ApiFetch";
import { getApiUrl } from "../../../API/APIUtils";
import type { UserData } from "../../../types/UserData";
import { LoginTypes } from "../Utils";

type GoogleOAuthCallbackSuccessMessage = {
    type: typeof LoginTypes.google;
    success: true;
    user: UserData & { recently_registered?: boolean; message?: string };
};

type GoogleOAuthCallbackFailureMessage = {
    type: typeof LoginTypes.google;
    success: false;
    errorMessage: string;
};

export default function GoogleOAuthCallback() {
    const [status, setStatus] = useState<string>("Initiating authentication...");

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get("code");

        const opener = window.opener;
        if (!opener) {
            setStatus("Authentication failed");
            // eslint-disable-next-line no-console
            console.error("Google OAuth callback opened without an opener window.");
            return;
        }

        if (code) {
            setStatus("Processing authentication...");

            fetchDataFromURL({
                url: getApiUrl({ endpoint: "google/callback" }),
                RESTmethod: "POST",
                body: { code },
            })
                .then((data) => {
                    const message: GoogleOAuthCallbackSuccessMessage = {
                        type: LoginTypes.google,
                        success: true,
                        user: data as UserData & { recently_registered?: boolean; message?: string },
                    };

                    // Send the result to the main window
                    opener.postMessage(message, window.location.origin);
                })
                .catch((error: unknown) => {
                    setStatus("Authentication failed");
                    // eslint-disable-next-line no-console
                    console.error("Error during Google login:", error);

                    const errorMessage = error instanceof Error ? error.message : "Google Login failed, please try again.";
                    const message: GoogleOAuthCallbackFailureMessage = {
                        type: LoginTypes.google,
                        success: false,
                        errorMessage,
                    };

                    // Notify the main window of the error
                    opener.postMessage(message, window.location.origin);
                })
                .finally(() => {
                    window.close(); // Close the popup
                });
        } else {
            setStatus("Authentication failed");
            // eslint-disable-next-line no-console
            console.error("Authorization code is missing from the URL.");

            const message: GoogleOAuthCallbackFailureMessage = {
                type: LoginTypes.google,
                success: false,
                errorMessage: "Google Login failed, please try again.",
            };

            // Notify the main window about the failure
            opener.postMessage(message, window.location.origin);

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
