import { useEffect, useRef } from 'react';

interface GoogleIdentityButtonProps {
  onSuccess: (credential: string) => void;
  onError?: () => void;
}

const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string) || '';

const GoogleIdentityButton = ({ onSuccess, onError }: GoogleIdentityButtonProps) => {
  const buttonDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Defensive guard: avoid initializing Google Identity when client id is missing
    // or still the REDACTED placeholder. This prevents Google returning invalid_client
    // and provides a clearer developer message during testing.
    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.toLowerCase().includes('redacted')) {
      if (typeof console !== 'undefined' && typeof console.warn === 'function') {
        console.warn('Google Identity not initialized: VITE_GOOGLE_CLIENT_ID is not set or still REDACTED. Set a valid client id in your environment to enable Google Sign-In.');
      }
      if (onError) onError();
      return;
    }

    // @ts-expect-error - Google Identity Services types not available
    if (window.google && buttonDiv.current) {
      // Disable auto-select globally before rendering
      // @ts-expect-error - Google Identity Services types not available
      window.google.accounts.id.disableAutoSelect();
      // Render the Google Sign-In button with always prompt
      // @ts-expect-error - Google Identity Services types not available
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: { credential?: string }) => {
          if (response.credential) {
            onSuccess(response.credential);
          } else if (onError) {
            onError();
          }
        },
        auto_select: false, // Always show account chooser
        prompt_parent_id: buttonDiv.current.id,
      });
      // @ts-expect-error - Google Identity Services types not available
      window.google.accounts.id.renderButton(buttonDiv.current, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: 240,
      });
      // Always prompt for account selection
      // @ts-expect-error - Google Identity Services types not available
      window.google.accounts.id.prompt();
    }
  }, [onSuccess, onError]);

  return <div id="google-identity-btn" ref={buttonDiv}></div>;
};

export default GoogleIdentityButton;
