## Deploying the frontend to GitHub Pages

This repository includes a GitHub Actions workflow (`.github/workflows/deploy-gh-pages.yml`) that will build the Vite frontend and publish the `dist/` folder to the `gh-pages` branch whenever you push to `main`.

Quick steps to enable:

1. Add repository Secrets (Settings → Secrets & variables → Actions):
   - VITE_GOOGLE_CLIENT_ID
   - VITE_STRIPE_PUBLIC_KEY
   - VITE_PAYPAL_CLIENT_ID
   - VITE_NEWSLETTER_API_URL
   - VITE_APP_URL
   - VITE_API_URL
   - VITE_EMAIL_USER

2. Confirm the workflow is active in the Actions tab.

3. Configure GitHub Pages (Settings → Pages):
   - Source: gh-pages branch
   - Folder: / (root)

Notes:
- The workflow only builds and deploys the frontend. Your API (newsletter, bookings, profile) still needs a backend host — either a separate Node server or serverless functions. You can point `VITE_API_URL` to that host.
- Do NOT commit production secrets into the repo. Use repository Secrets instead. If sensitive values were previously committed, rotate them as soon as possible.
