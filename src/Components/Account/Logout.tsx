import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { CircularProgress } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSnackbar } from "notistack";

import { StyledMenuItem } from "../Header/MenuItemAsNavLink";
import { fetchDataFromURL } from "../../API/ApiFetch";
import { getApiUrl } from "../../API/APIUtils";
import { useUser } from "../../ContextProviders/UserContext";
import { defaultAuthenticationState } from "../../types/AuthenticationState";
import { EMPTY_USER_DATA } from "../../types/UserData";
import { SnackbarMetadata } from "../../Utils/SnackbarMetadata";

type LogoutResponse = {
  message?: string;
};

const isLogoutResponse = (value: unknown): value is LogoutResponse => {
  return !!value && typeof value === "object";
};

export default function LogOut() {
  const { setUser, setAuthenticationState } = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const logOut = async (): Promise<void> => {
    setLoading(true);

    fetchDataFromURL({
      url: getApiUrl({ endpoint: "logout" }),
      RESTmethod: "GET",
    })
      .then((data: unknown) => {
        setLoading(false);
        setAuthenticationState(defaultAuthenticationState);
        setUser(EMPTY_USER_DATA);

        const message = isLogoutResponse(data) && typeof data.message === "string" ? data.message : "Logout successfully";
        enqueueSnackbar(message, SnackbarMetadata.success);
        navigate("/");
      })
      .catch((error: unknown) => {
        setLoading(false);
        const message = error instanceof Error ? error.message : String(error);
        enqueueSnackbar(message, SnackbarMetadata.error);
      });
  };

  return (
    <StyledMenuItem onClick={logOut} sx={{ "& *": { fontSize: "1rem" } }}>
      {loading ? (
        <>
          <CircularProgress disableShrink color="inherit" size="1.5rem" />
        </>
      ) : (
        <>
          <LogoutIcon />&nbsp;Logout
        </>
      )}
    </StyledMenuItem>
  );
}
