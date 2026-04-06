import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { useSnackbar } from "notistack";

import { AppRoutes } from "../../Utils/AppRoutes";
import { SnackbarMetadata } from "../../Utils/SnackbarMetadata";
import { successfulAuthenticationState } from "../../types/AuthenticationState";
import type { UserData } from "../../types/UserData";
import { useUser } from "../../ContextProviders/UserContext";
import { LoginTypes } from "../Account/Utils";

import EmailVerificationDialog from "./EmailVerificationDialog";

type PasswordLoginMessage =
  | {
      type: typeof LoginTypes.password;
      success: true;
      user: UserData & { message?: string; recently_registered?: boolean };
    }
  | {
      type: typeof LoginTypes.password;
      success: false;
      errorMessage?: string;
    };

const isPasswordLoginMessage = (data: unknown): data is PasswordLoginMessage => {
  if (!data || typeof data !== "object") return false;
  const maybe = data as { type?: unknown; success?: unknown };
  return maybe.type === LoginTypes.password && typeof maybe.success === "boolean";
};

type LoginPopupHandlerChildrenArgs = {
  openLoginPopup: () => void;
};

type LoginPopupHandlerProps = {
  onLoginSuccess?: () => void;
  children: (args: LoginPopupHandlerChildrenArgs) => ReactNode;
};

const LoginPopupHandler = ({ onLoginSuccess, children }: LoginPopupHandlerProps) => {
  const popupRef = useRef<Window | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const { setAuthenticationState, setUser } = useUser();

  const [showVerificationDialog, setShowVerificationDialog] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (!isPasswordLoginMessage(event.data)) return;

      if (event.data.success === true) {
        const user = event.data.user;

        setAuthenticationState(successfulAuthenticationState);
        setUser(user);

        if (user.message) {
          enqueueSnackbar(user.message, SnackbarMetadata.success);
        }

        if (user.is_verified === false) {
          setShowVerificationDialog(true);
          setEmail(user.email ?? "");
        }

        onLoginSuccess?.();
      }
    },
    [enqueueSnackbar, onLoginSuccess, setAuthenticationState, setUser]
  );

  const openLoginPopup = useCallback(() => {
    const width = 500;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const popup = window.open(AppRoutes.login, "Login", `width=${width},height=${height},top=${top},left=${left}`);

    if (popup) {
      popup.focus();
      popupRef.current = popup;

      const intervalId = window.setInterval(() => {
        if (popup.closed) {
          window.clearInterval(intervalId);
          window.removeEventListener("message", handleMessage);
          popupRef.current = null;
        }
      }, 500);
    } else {
      alert("Popup blocked. Please enable popups for login.");
    }
  }, [handleMessage]);

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [handleMessage]);

  return (
    <>
      {children({
        openLoginPopup,
      })}
      <EmailVerificationDialog open={showVerificationDialog} email={email} />
    </>
  );
};

export default LoginPopupHandler;
