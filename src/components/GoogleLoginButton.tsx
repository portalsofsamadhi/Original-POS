import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

export const GoogleLoginButton: React.FC<{ onSuccess: (user: unknown) => void; onError?: (err: unknown) => void }> = ({ onSuccess, onError }) => {
  // Handle Google OAuth credential response
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error('No credential returned');
      }
      // Decode JWT to get user info
      const base64Url = credentialResponse.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      const user = JSON.parse(jsonPayload);
      // user.email, user.name, user.picture
      onSuccess(user);
    } catch (err) {
      if (onError) onError(err);
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => onError && onError('Google sign in failed')}
        width={320}
        useOneTap
      />
    </div>
  );
};
