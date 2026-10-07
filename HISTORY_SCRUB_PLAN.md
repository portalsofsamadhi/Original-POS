HISTORY SCRUB PLAN
==================

Purpose
-------
This document describes a safe, repeatable plan to scrub sensitive values from the repository history using git-filter-repo. It includes pre-checks, backup steps, a dry-run mode, and recovery instructions for collaborators.

High-level steps
----------------
1. Make sure all working changes are committed and pushed (or stashed) locally.
2. Create a complete mirror backup clone of the repository (keeps refs and full history).
3. Ensure adequate disk space for history rewrite (at least 2-3x repo size recommended).
4. Prepare `replacements.txt` mapping literal secrets to placeholders. (This repo already contains `replacements.txt`.)
5. Run git-filter-repo on the mirror clone with `--replace-text replacements.txt`.
6. Inspect the rewritten mirror to confirm secrets removed.
7. If OK, force-push the cleaned branches to remote and notify collaborators.

Important warnings
------------------
- This operation rewrites commit history. ALL collaborators will need to re-clone or reset their local clones after the rewrite.
- Make sure you have a full backup clone before proceeding.
- Coordinate with any CI/CD or deployment systems; they may require reconfiguration.

Recovery & collaborator instructions (to share after scrub completes)
-------------------------------------------------------------------
1. Everyone must fetch and reset their local main (example):

   git fetch origin --prune
   git switch main
   git reset --hard origin/main

2. If they have local branches they want to preserve, rebase them onto the new main or create patches before the scrub.

Checklist before running (required)
----------------------------------
- [ ] Create mirror backup: `git clone --mirror <repo_url> repo-backup.git`
- [ ] Verify `replacements.txt` contains all strings you want replaced
- [ ] Ensure you have at least 2-3x repo size free on disk
- [ ] Notify collaborators and schedule the force-push window
- [ ] Confirm remote write access and that CI will accept force pushes

Notes about tools
-----------------
- git-filter-repo is recommended (fast, flexible). Install instructions: https://github.com/newren/git-filter-repo
- BFG is an alternative, easier to use for simple replacements, but git-filter-repo gives full control.

Contact & rollback
------------------
If something goes wrong, use the mirror backup created in step 2 to restore the repository on the remote (manual process) and reach out with the backup path and timestamp.
