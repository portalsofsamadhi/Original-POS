import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

type Props = {
  onSuccess: (user: unknown) => void;
  onError?: (err: unknown) => void;
};

type BoundaryState = { failed: boolean };

/** Prevent Google SDK errors from white-screening the whole profile page. */
class GoogleButtonBoundary extends Component<{ children: ReactNode; onFail?: () => void }, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("GoogleLoginButton error:", error, info);
    this.props.onFail?.();
  }

  render() {
    if (this.state.failed) {
      return (
        <p className="text-center text-xs opacity-70 px-2">
          Google sign-in is unavailable right now. Use email and password instead.
        </p>
      );
    }
    return this.props.children;
  }
}

function decodeCredential(credential: string): Record<string, unknown> {
  const base64Url = credential.split(".")[1];
  if (!base64Url) throw new Error("Invalid Google credential");
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload) as Record<string, unknown>;
}

/**
 * Google Identity button. Must only render when app is wrapped in GoogleOAuthProvider
 * and VITE_GOOGLE_CLIENT_ID is set. No One Tap (avoids blank-page crashes).
 */
export const GoogleLoginButton: React.FC<Props> = ({ onSuccess, onError }) => {
  const clientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim();

  if (!clientId || clientId.toLowerCase().includes("redacted")) {
    return (
      <p className="text-center text-xs opacity-70 px-2">
        Google sign-in is not configured yet.
      </p>
    );
  }

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("No credential returned");
      }
      const user = decodeCredential(credentialResponse.credential);
      onSuccess(user);
    } catch (err) {
      onError?.(err);
    }
  };

  return (
    <GoogleButtonBoundary onFail={() => onError?.("Google sign-in failed to load")}>
      <div className="w-full flex items-center justify-center min-h-[44px]">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => onError?.("Google sign in failed")}
          useOneTap={false}
          theme="outline"
          size="large"
          text="continue_with"
          shape="rectangular"
          width="320"
        />
      </div>
    </GoogleButtonBoundary>
  );
};

export default GoogleLoginButton;
