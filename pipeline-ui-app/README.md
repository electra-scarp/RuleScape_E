# RuleScape Pipeline UI

Standalone Vite + React frontend for the RuleScape pipeline flow.

## What it includes

- Step 1: Configure Cello inputs
- Step 2: Review Knox
- Step 3: Configure ML
- Step 4: Review results

The app is visual-only right now. It is not yet wired to the live Cello/Knox pipeline.

## Prerequisites

- macOS or Linux
- `curl`

## Quick install

From the `pipeline-ui-app` directory:

```bash
./scripts/install_frontend.sh
```

What the script does:

- checks for Node.js and npm
- installs `nvm` if needed
- installs Node.js 24 through `nvm` if needed
- runs `npm install`

If you want to verify the toolchain manually after the script runs:

```bash
node -v
npm -v
```

## Run locally

```bash
npm run dev
```

Vite runs on `http://127.0.0.1:5173`.

## Build

```bash
npm run build
```

## Project structure

```text
pipeline-ui-app/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── styles.css
│   └── stages/
│       ├── CelloStage.jsx
│       ├── BridgeStage.jsx
│       ├── MlStage.jsx
│       └── ReportStage.jsx
├── scripts/
│   └── install_frontend.sh
├── package.json
└── vite.config.js
```

## Notes

- The Vite dev server proxies `/api/pipeline` to `http://127.0.0.1:8051`.
- Stage-specific UI is split into separate files in `src/stages/` so teammates can work on one step without editing the full app shell.
- If `nvm` was just installed for the first time, opening a new shell will make it available outside the script as well.
