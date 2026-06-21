# Render deployment & runbook (pos-api / pos-website)

This file documents the exact steps to get the API service (`pos-api`) and the frontend (`pos-website`) deployed correctly on Render, the environment variables you must set, smoke tests, and security steps (rotate secrets, remove `.env`).

Keep this file in the repository so future deploys are consistent.

---

## Goal (quick)
- Deploy a Node Web Service named `pos-api` that runs `server/index.js` and responds at `https://pos-api.onrender.com`.
- Ensure the static frontend `pos-website` is built with the correct `VITE_*` build-time variables and served from `https://www.portalsofsamadhi.com`.

## Preflight checklist
- Render account access (owner or service admin).
- Rotate any secrets that were previously committed to the repo (recommended immediately).
- Keep a secure copy of the new `ADMIN_BEARER_TOKEN` and `JWT_SECRET` (password manager).

## 1) Create the `pos-api` Web Service (recommended)
Use Render UI -> New -> Web Service and follow these values exactly:

- Repository: `portalsofsamadhi/POS-Website` (branch `main`)
- Name: `pos-api` (or `pos-api-yourname` — keep consistent)
- Environment: `Node`
- Root Directory: leave blank (server/index.js lives at repo root)
- Build Command: (optional) leave default or `npm ci` — Not required for a pure API service
- Start Command: `node server/index.js`
- Health Check Path: `/api/health`
- Instance Type: choose according to plan (free, starter, etc.)

After creation, click Manual Deploy.

## 2) Environment variables (pos-api service)
Add these keys in Render → pos-api → Environment → Environment Variables (mark sensitive values as secret):

- NODE_ENV = production
- PORT = 10000
- GOOGLE_CLIENT_ID = 346119506050-a115o7rhr5o3ce0vijhkgmtmoegto76c.apps.googleusercontent.com
- ADMIN_BEARER_TOKEN = Bearer <strong-random-token-here>
- JWT_SECRET = <strong-random-secret-here>
- STRIPE_SECRET_KEY = sk_live_... (rotate if leaked)
- VITE_STRIPE_PUBLIC_KEY = pk_live_... (optional)
- EMAIL_USER = portalsofsamadhi@gmail.com
- EMAIL_PASSWORD = <smtp-password> (if used)
- MONGODB_URI = mongodb+srv://... (optional; if present the server will use Mongo instead of local JSON files)
- DEBUG_GOOGLE_AUTH = true (optional; set only while debugging then remove)

Notes:
- `ADMIN_BEARER_TOKEN` should be a strong random token prefixed with `Bearer ` because the server compares full Authorization header strings.
- Add only the secrets required for your production flows. Do not put long-lived secrets in the repo.

## 3) Rebuild the frontend (pos-website) with correct VITE_* values
The frontend is built with Vite and requires build-time envs to be present when `npm run build` runs on Render.

If `pos-website` is a Static Site on Render (recommended):
- In the pos-website service settings set the Build Environment Variables:
  - VITE_API_URL = https://pos-api.onrender.com
  - VITE_GOOGLE_CLIENT_ID = 346119506050-a115o7rhr5o3ce0vijhkgmtmoegto76c.apps.googleusercontent.com
  - VITE_STRIPE_PUBLIC_KEY = pk_live_...
  - VITE_PAYPAL_CLIENT_ID = <your-paypal-client-id>
- Trigger Manual Deploy for pos-website (this runs `npm run build` and produces `dist/`).

If you prefer to build frontend in the same repo step as pos-api (not recommended):
- Set `VITE_*` envs on the pos-api service before deploy and ensure your start/build commands include building the client.

## 4) Google OAuth Console changes (required for GSI to work)
In the Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client IDs → Edit the Web client (the client id above):

- Add the following Authorized JavaScript origins:
  - https://www.portalsofsamadhi.com
  - https://portalsofsamadhi.com
- (Optional) Add any Render preview domains or staging domains you use.

Without this you'll see GSI errors like "Origin not allowed" or 403 from Google.

## 5) Smoke tests after deploy
Run these from your machine (PowerShell examples):

1) Health check
```powershell
Invoke-RestMethod -Uri 'https://pos-api.onrender.com/api/health' -Method GET
```

Expected: { "status": "healthy", "timestamp": "..." }

2) Debug Google config (only if DEBUG_GOOGLE_AUTH=true)
```powershell
Invoke-RestMethod -Uri 'https://pos-api.onrender.com/api/debug/google-config' -Method GET
```

Expected: JSON showing presence booleans for server and build client ids.

3) Newsletter public check
```powershell
Invoke-RestMethod -Uri 'https://pos-api.onrender.com/api/newsletter/check?email=you@example.com' -Method GET
```

Expected: { success: true, profile: null | { ... } }

4) Admin endpoints (replace token)
```powershell
$headers = @{ Authorization = 'Bearer <your-admin-token>' }
Invoke-RestMethod -Uri 'https://pos-api.onrender.com/api/bookings' -Method GET -Headers $headers
```

Expected: { success: true, bookings: [...] }

5) Browser tests
- Open your frontend at https://www.portalsofsamadhi.com
- Test Google Sign-In on the profile page
- Test newsletter signup and booking flows

## 6) Troubleshooting quick checks
- If `/api/health` is 404: verify the Render service is a Web Service (not Static) and that Start Command is `node server/index.js`.
- If CORS errors persist: ensure `VITE_API_URL` in the built client points to `https://pos-api.onrender.com` and `server/index.js` whitelist includes `https://www.portalsofsamadhi.com` or change CORS to use an environment-configured origin list.
- If admin endpoints return 401: ensure Authorization header exactly matches `ADMIN_BEARER_TOKEN` (prefix `Bearer ` included).
- If logs show missing env values: add them in Render and redeploy.

## 7) Security: remove `.env` and rotate leaked secrets
If `.env` was committed to the repo, do the following locally (PowerShell):

```powershell
# Add .env to .gitignore
if (-not (Get-Content .gitignore | Select-String -Pattern '^\s*\.env\s*$')) { Add-Content -Path .gitignore -Value '.env' }

# Remove .env from git (keep local file)
git rm --cached .env
git add .gitignore
git commit -m "chore: remove .env from repo and ignore it"
git push origin main
```

Then rotate any keys/secrets that were exposed in the repository (Stripe, SMTP, JWT_SECRET, ADMIN_BEARER_TOKEN, MONGODB credentials).

If you want to purge secrets from history, use BFG or `git filter-repo` (advanced) — contact me if you want the exact commands and I will provide them.

## 8) Optional: using `render.yaml`
If you prefer deploying both services from `render.yaml`, Render can read `render.yaml` at repo root and create both `pos-website` (static) and `pos-api` (web) automatically. After that, set secrets in both services and manually deploy.

## 9) Rollback & logs
- Use Render's Deploys -> View Deploy Logs to see startup logs and runtime errors.
- If a deploy breaks, rollback to the previous successful deploy from the Render dashboard.

---

If you want, I will also:
- add `.env` to `.gitignore` and remove it from the repo (I will commit this change), and/or
- create a `deploy-checklist.ps1` that runs the smoke tests automatically.

Tell me which of those extras you'd like and I will commit them next.
