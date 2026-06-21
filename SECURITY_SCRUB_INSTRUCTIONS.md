Security scrub instructions (git history) — read fully before running

WARNING: Rewriting git history is destructive. Only proceed if you understand the consequences
and have agreement from all collaborators. Always make a backup clone before running any rewrite.

1) Make a backup of your repository (recommended)

PowerShell (at repo root):

```powershell
# create a bundle backup (fast and safe)
git bundle create ../pos-website-backup.bundle --all
# also create an archive of your working tree
Compress-Archive -Path . -DestinationPath ..\pos-website-working-tree.zip -Force
```

2) Install git-filter-repo (preferred method)

- Linux/macOS/Windows (with Python):
  - pip install git-filter-repo
  - Docs: https://github.com/newren/git-filter-repo

3) Prepare a replacements file for `git-filter-repo` (this safely replaces secret strings across history)

Create a file named `replacements.txt` with the following entries (literal replacement):

```
# Replace exact sensitive strings with placeholders; see `replacements.txt` for the exact mappings used by the scrub tool.
```

Notes:
- `git-filter-repo --replace-text replacements.txt` will replace these sequences wherever they appear in any file content across history.
- The replacements file format uses `==>` to map the old literal to the new literal.

4) Remove whole files (optional) e.g., `.env` and `php-backend/.env`

If you want to remove specific files entirely from history (recommended for .env files), run:

```powershell
# create a fresh clone for rewriting
git clone --mirror https://github.com/your-org/pos-website.git pos-website-mirror.git
cd pos-website-mirror.git

# Remove sensitive file paths from history
git filter-repo --invert-paths --paths .env --paths php-backend/.env

# NOTE: the above command REMOVES everything EXCEPT the listed paths. To *delete* specific paths
# use the --paths option differently. Instead, to delete files use:
# git filter-repo --path .env --path php-backend/.env --invert-paths
# But this is dangerous: test in a clone first.

# After successful rewrite push back to remote (force push)
git remote set-url origin https://github.com/your-org/pos-website.git
git push --force --all
git push --force --tags
```

5) Alternative: Use BFG Repo-Cleaner (easier for files)

- Download BFG: https://rtyley.github.io/bfg-repo-cleaner/
- Mirror-clone your repo and run BFG to delete files or replace strings.

Example to delete files named `.env`:

```bash
git clone --mirror https://github.com/your-org/pos-website.git
java -jar bfg.jar --delete-files .env pos-website.git
cd pos-website.git
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push --force
```

To replace text with BFG, you can supply a text file to `--replace-text`.

6) After rewriting history (if you do)
- Everyone who clones/pulls must re-clone or reset their local clones.
- Instruct collaborators to run:

```powershell
# re-clone fresh
git clone https://github.com/your-org/pos-website.git
```

7) Rotate credentials (MUST DO)
- Immediately rotate any credentials that were previously in the repo (Stripe secret keys, PayPal secret, SMTP app password, JWT secret) — do this from the provider dashboards.
- Update the deployment host environment variables with the new secrets (Render, Netlify, GitHub Actions secrets, etc.).

8) Rebuild frontend and backend
- Rebuild after adding VITE_* env vars to host (Vite injects at build time):

```powershell
# Example (on host or CI)
npm ci
npm run build
# Restart services e.g. pm2 or your host's auto deploy
```

9) Verify flows
- Clear service worker in browser or use Incognito, then test Google Sign, bookings+email, PayPal checkout, and newsletter subscribe.

10) If you want, I can prepare the exact `replacements.txt` containing every string we found, and a small PowerShell wrapper to execute `git-filter-repo` locally on your machine (I will NOT execute it). Reply "prepare scrub" and I will generate those files for you to run.

-- End of instructions --
