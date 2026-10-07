import "./registerServiceWorker";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';

const basename = import.meta.env.BASE_URL || "";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID && typeof console !== 'undefined' && typeof console.warn === 'function') {
  console.warn('VITE_GOOGLE_CLIENT_ID is not set. Google sign-in will not work without a valid client ID.');
}

const RootApp = (
  <BrowserRouter basename={basename}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* Only initialize Google provider when a client ID is available to avoid loading Google scripts with `client_id=undefined` */}
    {GOOGLE_CLIENT_ID ? (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>{RootApp}</GoogleOAuthProvider>
    ) : (
      RootApp
    )}
  </React.StrictMode>
);
