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

### Build + Deploy in one step

```bash
pnpm run build
npx wrangler pages deploy dist --project-name calculate-anything
```

Or use the combined deploy script:

```bash
pnpm run deploy
```

> The `deploy` script in `package.json` runs `astro build` then `wrangler pages deploy` automatically.

### What happens

1. `astro build` generates static files into the `dist/` folder (124 pages).
2. Wrangler uploads the `dist/` folder to Cloudflare Pages.
3. Cloudflare serves the site from their global edge network.

---

## Live URLs

| Type | URL |
|---|---|
| Production Domain | https://calculate-anything.in |
| Cloudflare Pages URL | https://calculate-anything.pages.dev |
| Latest deploy preview | https://05ca7711.calculate-anything-b3z.pages.dev |

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

## Switching Cloudflare Accounts

If you need to deploy from a different Cloudflare account:

```bash
# Log out of the current account
npx wrangler logout

# Log in with the new account
npx wrangler login

# Then deploy as normal
pnpm run deploy
```

---

## Troubleshooting

### `pnpm install --frozen-lockfile` fails on Cloudflare CI

This project uses **Wrangler direct deploy** instead of Cloudflare Pages CI to avoid pnpm version mismatches. If you re-enable CI builds, set the `PNPM_VERSION` environment variable to `12.16.1` in the Cloudflare Pages dashboard under **Settings → Environment Variables**.

### `packages field missing or empty` error

This means Cloudflare Pages is using pnpm 9 and reading `pnpm-workspace.yaml` as a monorepo config. Fix: deploy via Wrangler locally (as above) instead of using the Cloudflare git integration.

### Wrangler asks to create a new project

Run with the explicit project name flag:

```bash
npx wrangler pages deploy dist --project-name calculate-anything
```

### Uncommitted changes warning

Safe to ignore — Wrangler deploys from `dist/` directly, not from git. Pass `--commit-dirty=true` to silence it:

```bash
npx wrangler pages deploy dist --project-name calculate-anything --commit-dirty=true
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
