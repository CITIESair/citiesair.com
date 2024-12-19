/* eslint-disable */
import { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  CircularProgress,
  Typography,
  Container,
  Paper,
  Button,
  Box,
} from "@mui/material";

import { UserContext } from "../../ContextProviders/UserContext";
import { getApiUrl } from "../../API/ApiUrls";
import { GeneralAPIendpoints, RESTmethods } from "../../API/Utils";
import { AppRoutes } from "../../Utils/AppRoutes";
import { useNotificationContext } from "../../ContextProviders/NotificationContext";
import { fetchDataFromURL } from "../../API/ApiFetch";

export default function Verify() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);

  const { setUser } = useContext(UserContext);
  const {
    setShowNotification,
    setMessage: setNotificationMessage,
    setSeverity,
  } = useNotificationContext();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      verifyAccount();
    } else {
      setMessage("Invalid or missing token.");
      setStatus("error");
      setLoading(false);
    }
  }, [token]);

  const verifyAccount = async () => {
    try {
      const response = await fetchDataFromURL({
        url: getApiUrl({ endpoint: GeneralAPIendpoints.verify }),
        restMethod: RESTmethods.POST,
        body: { token },
      });
      console.log(response.status);

      if (response.message === "Email verified") {
        // console.log("Hello");
        setStatus("success");
        setMessage("Account verified! Click below to refresh.");
        setUser((prev) => ({ ...prev, isVerified: true }));

        // Redirect based on login state
        const isLoggedIn = Boolean(localStorage.getItem("clerk-db-jwt"));
        setTimeout(() => {
          navigate(isLoggedIn ? AppRoutes.nyuad : AppRoutes.login);
        }, 3000);
      } else {
        throw new Error("Verification failed");
      }
    } catch (error) {
      setStatus("error");
      setMessage(
        "Account verification unsuccessful. Please contact citiesdashboard@gmail.com or try signing up again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ my: 3 }}>
      <Paper sx={{ p: 3 }} elevation={3}>
        <Typography variant="h5" fontWeight={500} gutterBottom>
          {loading
            ? "Verifying..."
            : status === "success"
            ? "Verified"
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
            color={status === "success" ? "green" : "red"}
          >
            {message}
          </Typography>
        )}

        {!loading && status === "success" && (
          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        )}
      </Paper>
    </Container>
  );
}
