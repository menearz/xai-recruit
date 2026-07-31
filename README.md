# Mission: xAI Recruit

AI mastery training game with **The Domain** (Forerunner hard-light) branding.

Train Python → regression / gradient descent → neural nets → transformers → LoRA → ship.

## Play live (GitHub Pages)

**URL:** https://menearz.github.io/xai-recruit/

### Enable Pages (one-time, ~30 seconds)

1. Open https://github.com/menearz/xai-recruit/settings/pages  
2. Under **Build and deployment** → **Source**, choose **Deploy from a branch**  
3. Branch: **main** · Folder: **/docs**  
4. Click **Save**  
5. Wait 1–2 minutes, then open https://menearz.github.io/xai-recruit/ on your phone  

### Install on Android

Chrome → open the URL → ⋮ menu → **Add to Home screen** / **Install app**.

## Local dev

```bash
npm install
npm run dev
```

## Rebuild Pages static site

```bash
npx vite build --config vite.pages.config.ts
```

Output goes to `docs/` (served by GitHub Pages).

## Stack

React · Vite · Zustand · Domain design tokens (Orbitron / Exo 2 / Share Tech Mono)
