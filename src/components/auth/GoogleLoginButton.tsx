import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

interface GoogleLoginButtonProps {
  onSuccess: (credential: string) => void;
  onError?: () => void;
}

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

const GoogleLoginButton = ({ onSuccess, onError }: GoogleLoginButtonProps) => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={credentialResponse => {
          if (credentialResponse.credential) {
            onSuccess(credentialResponse.credential);
          }
        }}
        onError={onError}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
