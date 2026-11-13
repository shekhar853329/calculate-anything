# Deployment Guide

This project is deployed to **Cloudflare Pages** using Wrangler CLI directly from your local machine.

---

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 12
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (included via `npx`, no global install needed)
- A Cloudflare account logged in via Wrangler

---

## First-Time Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Authenticate with Cloudflare

```bash
npx wrangler login
```

This opens a browser window to authorise Wrangler with your Cloudflare account.

---

## Deploy

### Deploy the site from PowerShell

Run these commands from the project root:

```powershell
$env:PUBLIC_PRESENCE_URL = "wss://calculate-anything-presence.shekharshine25.workers.dev/presence"
pnpm run build
if ($LASTEXITCODE -eq 0) {
    pnpm exec wrangler pages deploy dist --project-name calculate-anything --branch main --commit-dirty=true
}
```

The environment variable must be set **before every production build**. Without it, the online-users counter is hidden. `--branch main` targets the production branch; `--commit-dirty=true` allows deployment of the current working tree.

Deploy the presence worker separately only when its code or configuration changes:

```powershell
pnpm presence:deploy
```

### What happens

1. `astro build` generates static files into the `dist/` folder.
2. Wrangler uploads the `dist/` folder to Cloudflare Pages.
3. Cloudflare serves the site from their global edge network.

---

## Live URLs

| Type | URL |
|---|---|
| Production Domain | https://calculate-anything.in |
| Cloudflare Pages URL | https://calculate-anything-b3z.pages.dev |
| Latest deployment URL | https://98defe69.calculate-anything-b3z.pages.dev |

---

## Project Configuration

| File | Purpose |
|---|---|
| `wrangler.toml` | Cloudflare project name and build output directory |
| `astro.config.mjs` | Astro build config — static output, site URL |
| `pnpm-workspace.yaml` | pnpm 12 build script approvals (esbuild, workerd) |
| `.npmrc` | Disables package-manager-strict for Wrangler compatibility |

### wrangler.toml

```toml
name = "calculate-anything"
pages_build_output_dir = "./dist"
compatibility_date = "2024-01-01"
```

---

## Live Online Users Counter (Presence Worker)

The footer shows a real-time count of visitors. It is served by a separate Cloudflare Worker (`cloudflare-worker/`) with a Durable Object that tracks open WebSocket connections. The Pages site itself stays static.

### Deploy the worker

```powershell
pnpm exec wrangler login    # once, if not already logged in
pnpm presence:deploy        # deploys cloudflare-worker/wrangler.toml
```

The deployed worker URL is `https://calculate-anything-presence.shekharshine25.workers.dev`.

### Point the site at the worker

`PUBLIC_PRESENCE_URL` is inlined at build time. Use the production value in the [deployment commands](#deploy-the-site-from-powershell). If it is unset, the footer hides the counter and no socket is opened.

### Origin allowlist

The worker only accepts WebSocket connections from origins listed in `ALLOWED_ORIGINS` in `cloudflare-worker/wrangler.toml`. Add any new production or preview domain there and redeploy the worker, or its connections will be rejected with HTTP 403.

### Local development

Run these in separate PowerShell terminals:

```powershell
pnpm presence:dev --port 8787 --ip 127.0.0.1
```

```powershell
$env:PUBLIC_PRESENCE_URL = "ws://127.0.0.1:8787/presence"
pnpm exec astro dev --background --port 4321
```

---

## Switching Cloudflare Accounts

If you need to deploy from a different Cloudflare account:

```bash
# Log out of the current account
npx wrangler logout

# Log in with the new account
npx wrangler login

```

Then follow the [production deployment commands](#deploy-the-site-from-powershell).

---

## Troubleshooting

### `pnpm install --frozen-lockfile` fails on Cloudflare CI

This project uses **Wrangler direct deploy** instead of Cloudflare Pages CI to avoid pnpm version mismatches. If you re-enable CI builds, set the `PNPM_VERSION` environment variable to `12.16.1` in the Cloudflare Pages dashboard under **Settings → Environment Variables**.

### `packages field missing or empty` error

This means Cloudflare Pages is using pnpm 9 and reading `pnpm-workspace.yaml` as a monorepo config. Fix: deploy via Wrangler locally (as above) instead of using the Cloudflare git integration.

### Wrangler asks to create a new project

Run with the explicit project name flag:

```bash
pnpm exec wrangler pages deploy dist --project-name calculate-anything --branch main
```

### Uncommitted changes warning

Safe to ignore — Wrangler deploys from `dist/` directly, not from git. Pass `--commit-dirty=true` to silence it:

```bash
pnpm exec wrangler pages deploy dist --project-name calculate-anything --branch main --commit-dirty=true
```

---

## Adding the Deploy Script to package.json

The `deploy` script is already configured:

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "deploy": "astro build && wrangler pages deploy dist --project-name calculate-anything --commit-dirty=true"
}
```

Set `PUBLIC_PRESENCE_URL` first, as shown in the [production deployment commands](#deploy-the-site-from-powershell). The script uses the current Git branch; use the explicit `--branch main` command above when targeting production.
