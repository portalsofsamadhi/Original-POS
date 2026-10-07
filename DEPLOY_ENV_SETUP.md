# Deployment: Environment Variable Setup (Render, Vercel, Netlify)

This document shows exactly which environment variables to set for common hosting providers so the frontend and API work correctly.

Important: Never commit production secrets to the repository. Use the provider UI (or secrets store) and ensure `.env.local` remains local.

Required variables (minimum)
- VITE_GOOGLE_CLIENT_ID — Google OAuth client ID used by the frontend (public)
- GOOGLE_CLIENT_ID — Google OAuth client ID used by server-side validation (same as above)
- VITE_STRIPE_PUBLIC_KEY — Stripe publishable key for frontend
- STRIPE_SECRET_KEY — Stripe secret key (server-only)
- VITE_PAYPAL_CLIENT_ID — PayPal client ID for frontend
- VITE_API_URL — Full URL of your API (frontend uses this for requests)
- ADMIN_BEARER_TOKEN — Admin token used by server endpoints (server-only)

Optional / Debug
- DEBUG_GOOGLE_AUTH=true — temporarily enable debug endpoint `/api/debug/google-config` (use only for validation and then disable)

Notes
- `VITE_` prefixed keys are injected into the frontend build. Set them in the hosting provider's **Environment** or **Project Settings** and trigger a rebuild after changes.
- Server-only keys (no `VITE_` prefix) must be added to the server service/environment and are never exposed to the browser.

Render (web service)
1. In your Render dashboard, open the service that hosts the frontend. Go to **Environment** → **Environment Variables**.
2. Add the following for the frontend service:
   - VITE_GOOGLE_CLIENT_ID = <your-google-client-id>
   - VITE_STRIPE_PUBLIC_KEY = <pk_live_xxx or pk_test_xxx>
   - VITE_PAYPAL_CLIENT_ID = <your-paypal-client-id>
   - VITE_API_URL = https://your-api-service.onrender.com
3. For the backend (API) service, add server-only variables:
   - GOOGLE_CLIENT_ID = <your-google-client-id>
   - STRIPE_SECRET_KEY = <sk_live_xxx or sk_test_xxx>
   - ADMIN_BEARER_TOKEN = <a-strong-random-token>
   - MONGODB_URI = <your-mongodb-connection-string> (if used)
4. Redeploy each service after setting env vars.

Vercel
1. Open your project on Vercel → Settings → Environment Variables.
2. Add the variables and choose the Environment (Production / Preview / Development):
   - VITE_GOOGLE_CLIENT_ID
   - VITE_STRIPE_PUBLIC_KEY
   - VITE_PAYPAL_CLIENT_ID
   - VITE_API_URL (set to your backend URL)
3. Add server-only variables to your server deployment (if server is a separate Vercel Function or service):
   - GOOGLE_CLIENT_ID
   - STRIPE_SECRET_KEY
   - ADMIN_BEARER_TOKEN
4. After adding, trigger a redeploy (Vercel redeploys automatically when env vars are added via UI).

Netlify
1. In Netlify, open Site settings → Build & deploy → Environment.
2. Add the `VITE_...` variables for the frontend site and server-only variables for any server functions you have:
   - VITE_GOOGLE_CLIENT_ID
   - VITE_STRIPE_PUBLIC_KEY
   - VITE_PAYPAL_CLIENT_ID
   - VITE_API_URL
   - GOOGLE_CLIENT_ID (for server functions)
   - STRIPE_SECRET_KEY (server-only)
3. Rebuild your site after changes.

Validation steps (after deploy)
1. Frontend: visit the frontend URL, open DevTools → Network/Console. Look for loaded Google/PayPal/Stripe scripts and no client_id warnings.
2. API: call `/api/health` and expect 200.
   - Example (PowerShell):
     ```powershell
     Invoke-WebRequest -UseBasicParsing https://your-api-url.example.com/api/health
     ```
3. Optional debug endpoint (enable only temporarily): set `DEBUG_GOOGLE_AUTH=true` on the server and visit `/api/debug/google-config` to verify both `serverGoogleClientId` and `viteGoogleClientId` values.

Troubleshooting
- If Google returns `invalid_client`, verify the client ID exactly (no extra whitespace), ensure the OAuth credentials are configured to include your app’s origins and redirect URIs, and confirm the client id you set in the provider matches the one registered in Google Cloud.
- If Stripe/PayPal fails, ensure you used the correct live vs test keys (testing environment should use test keys).

If you'd like, I can generate provider-specific step-by-step screenshots or a CLI script that sets env vars via provider APIs (need API tokens). Tell me which provider you want next and I will create an automated helper.
