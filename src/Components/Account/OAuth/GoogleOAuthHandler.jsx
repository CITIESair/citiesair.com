import { useEffect } from "react";
import { getApiUrl } from "../../../API/ApiUrls";
import { GeneralAPIendpoints, RESTmethods } from "../../../API/Utils";
import { fetchDataFromURL } from "../../../API/ApiFetch";
import { Container, Paper, Typography } from "@mui/material";

const handleGoogleLogin = async (code) => {
    fetchDataFromURL({
        url: getApiUrl({ endpoint: GeneralAPIendpoints.googleCallback }),
        restMethod: RESTmethods.POST,
        body: { code },
    }).then((data) => {
        // Send the result to the main window
        window.opener.postMessage(
            {
                type: "google-auth",
                success: true,
                user: data,
            },
            window.location.origin
        );
    }).catch((error) => {
        console.error("Error during Google login:", error);

        // Notify the main window of the error
        window.opener.postMessage(
            {
                type: "google-auth",
                success: false,
                errorMessage: error.message
            },
            window.location.origin
        );
    }).finally(() => {
        window.close(); // Close the popup
    });
};

export default function GoogleOAuthHandler() {
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get("code");
        if (code) {
            handleGoogleLogin(code);
        } else {
            console.error("Authorization code is missing from the URL.");

            // Notify the main window about the failure
            window.opener.postMessage(
                {
                    type: "google-auth",
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
                    Google Authentication
                </Typography>
            </Paper>
        </Container>
    );
}
