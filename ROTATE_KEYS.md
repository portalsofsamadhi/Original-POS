Rotate credentials and update deployment secrets — step-by-step

This document explains how to rotate keys and update your deployment environment variables.
Do these steps immediately if any credentials were committed to this repository or a public remote.

1) High-level plan
- Rotate credentials at the provider dashboards (Stripe, PayPal, Gmail/App Passwords, JWT secret).
- Update your deployment environment variables (Render, Netlify, Vercel, GitHub Actions secrets, etc.).
- Rebuild the frontend and backend with the new secrets.
- Run the smoke test (see `scripts/smoke-test.js`) to verify everything.

2) Rotate keys (provider-specific)

Stripe (recommended)
- Login to https://dashboard.stripe.com
- Go to Developers -> API keys
- Create a new secret key and new restricted/reusable keys if needed
- Replace any public secret usage (server-side) with the new secret
- If you used publishable key only in the frontend (VITE_STRIPE_PUBLIC_KEY) you may keep, but rotate secret if exposed
- Revoke the old secret key after testing is successful

PayPal
- Login to https://developer.paypal.com
- Find your REST app under My Apps & Credentials
- Generate a new Secret (and keep client ID/public client id if needed)
- Update any server-side secret used for server captures
- For frontend `VITE_PAYPAL_CLIENT_ID` update the build env and rebuild frontend

Gmail / SMTP (App password)
- If you used Gmail app password or account password, open account.google.com -> Security
- Under "App passwords" generate a new app password for the mailer
- Update `SMTP_USER` and `SMTP_PASS` in your server host environment
- Test sending emails (use `test-smtp.js` or run the newsletter server tests)

JWT_SECRET
- Generate a new high-entropy string (32+ bytes) using a secure generator
- Update `JWT_SECRET` on server hosts
- Revoke any tokens signed with old secrets if necessary (optional)

3) Update secrets in hosts (examples)

Render
- Project -> Environment -> Add Key
- Add keys: `VITE_GOOGLE_CLIENT_ID`, `VITE_PAYPAL_CLIENT_ID`, `VITE_STRIPE_PUBLIC_KEY`, `VITE_API_URL`, `SMTP_USER`, `SMTP_PASS`, `JWT_SECRET`
- Re-deploy after saving

GitHub Actions (for builds)
- Repository -> Settings -> Secrets -> Actions -> New repository secret
- Add `VITE_PAYPAL_CLIENT_ID`, `VITE_STRIPE_PUBLIC_KEY`, etc.
- Ensure your deployment workflow injects secrets into the build step

Netlify / Vercel
- Site Settings -> Environment Variables -> Add Key/Value -> Save
- Re-deploy site

4) Rebuild & redeploy
- After updating secrets, rebuild the frontend (Vite will inline `VITE_*` vars at build time)

Example (on CI or host):
```powershell
npm ci
npm run build
# Restart your site (platform-specific)
```

5) Verify
- Run `.	emplates\scripts\find-secrets.ps1` locally to ensure the repo no longer contains old secrets
- Run the smoke test below and confirm each step passes

6) Rollback plan
- Keep a copy of the previous secret (if required) until new creds validated
- If something fails, restore previous env values temporarily and revert to known-good deployments

If you want, I can also prepare the exact command-line snippets for Render/Netlify/Vercel to set secrets via their CLIs — tell me which host and I will add them.
