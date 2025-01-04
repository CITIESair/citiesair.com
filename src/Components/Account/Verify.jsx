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
import { fetchDataFromURL } from "../../API/ApiFetch";
import { AppRoutes } from "../../Utils/AppRoutes";
import { MetadataContext } from "../../ContextProviders/MetadataContext";

export default function Verify() {
  const { setCurrentPage } = useContext(MetadataContext);

  // set current page to login
  useEffect(() => {
    setCurrentPage(AppRoutes.verify);
  }, [setCurrentPage]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);

  const { setUser } = useContext(UserContext);
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

      if (response.message === "Email verified") {
        setStatus("success");
        setMessage("Account verified! Click below to refresh.");
        setUser((prev) => ({ ...prev, is_verified: true }));
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
}
