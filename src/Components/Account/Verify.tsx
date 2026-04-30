import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Box, Button, CircularProgress, Container, Paper, Typography } from "@mui/material";

import { fetchDataFromURL } from "../../API/ApiFetch";
import { getApiUrl } from "../../API/APIUtils";
import { usePreferences } from "../../ContextProviders/PreferenceContext";
import { useUser } from "../../ContextProviders/UserContext";
import { AppRoutes } from "../../Utils/AppRoutes";
import type { paths } from "../../types/backend-api.types";

type VerifyStatus = "success" | "error" | null;

type VerifyResponse =
  paths["/verify"]["post"]["responses"][200]["content"]["application/json"];

export default function Verify() {
  const { setCurrentPage } = usePreferences();

  useEffect(() => {
    setCurrentPage(AppRoutes.verify);
  }, [setCurrentPage]);

  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<VerifyStatus>(null);

  const { setUser } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const verifyAccount = async (tokenValue: string): Promise<void> => {
    try {
      const response = await fetchDataFromURL({
        url: getApiUrl({ endpoint: "verify" }),
        RESTmethod: "POST",
        body: { token: tokenValue },
      }) as VerifyResponse;

      if (response.message === "Email verified") {
        setStatus("success");
        setMessage(`Account verified for ${response.email || response.username || ""}. Click below to refresh.`);
        setUser((prev) => ({ ...prev, is_verified: true }));
      } else {
        throw new Error("Verification failed");
      }
    } catch {
      setStatus("error");
      setMessage("Account verification unsuccessful. Please contact citiesdashboard@gmail.com or try signing up again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      void verifyAccount(token);
    } else {
      setMessage("Invalid or missing token.");
      setStatus("error");
      setLoading(false);
    }
    // Intentionally depends only on `token`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <Container maxWidth="sm" sx={{ my: 3 }}>
      <Paper sx={{ p: 3 }} elevation={3}>
        <Typography variant="h5" fontWeight={500} gutterBottom>
          {loading ? "Verifying..." : status === "success" ? "Verified" : "Error"}
        </Typography>

        {loading && (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress />
          </Box>
        )}

        {!loading && (
          <Typography variant="body1" color="text.secondary">
            {message}
          </Typography>
        )}

        {!loading && status === "success" && (
          <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate("/")}>
            Refresh
          </Button>
        )}
      </Paper>
    </Container>
  );
}
