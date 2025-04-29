import { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Paper, CircularProgress } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchDataFromURL } from '../API/ApiFetch';
import { getApiUrl } from '../API/ApiUrls';
import { GeneralAPIendpoints, RESTmethods } from '../API/Utils';

const UnsubscribeAlert = () => {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const handleUnsubscribe = async () => {
            try {
                const data = await fetchDataFromURL({
                    url: getApiUrl({ endpoint: GeneralAPIendpoints.unsubscribe }),
                    restMethod: RESTmethods.POST,
                    body: { token },
                });

                if (data.is_enabled === false) {
                    setMessage("You have successfully unsubscribed from this alert.");
                    setStatus("success");
                } else {
                    setMessage("Failed to unsubscribe to this alert. Please try again.");
                    setStatus("error");
                }
            } catch (error) {
                setStatus("error");
                setMessage("Failed to unsubscribe. Please try again or contact us.");
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            handleUnsubscribe();
        } else {
            setMessage("No valid alert to unsubscribe from. Please contact us if you believe this is an error.");
            setStatus("error");
            setLoading(false);
        }
    }, [token]);

    return (

        <Container maxWidth="sm" sx={{ my: 3 }}>
            <Paper sx={{ p: 3 }} elevation={3}>
                <Typography variant="h5" fontWeight={500} gutterBottom>
                    {loading
                        ? "Unsubscribing..."
                        : status === "success"
                            ? "Unsubscribed"
                            : "Error"}
                </Typography>

                {loading && (
                    <Box display="flex" justifyContent="center" my={2}>
                        <CircularProgress />
                    </Box>
                )}

                {!loading && (
                    <Typography
                        variant="body1"
                        color="text.secondary"
                    >
                        {message}
                    </Typography>
                )}

                {!loading && status === "success" && (
                    <Button
                        variant="contained"
                        sx={{ mt: 3 }}
                        onClick={() => navigate("/")}
                    >
                        Refresh
                    </Button>
                )}
            </Paper>
        </Container>
    );
};

export default UnsubscribeAlert;