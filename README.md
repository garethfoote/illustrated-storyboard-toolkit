# Illustrated Storyboard Toolkit

A browser-based editor for composing illustrated scenes from layered SVG character
parts, speech bubbles and props. Scenes save to the current browser's localStorage;
SVG and PNG exports are generated in the browser. There is no backend.

## Run locally

Use Node.js 24 (the version used to validate this checkout).

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4174. Stop the server with Ctrl+C.

`npm run build` copies Carbon CSS and regenerates the asset manifest. It does not
produce a `dist` bundle. Static hosting must include `index.html`, `styles.css`,
`app.js`, `src/` and `assets/`. Serve over HTTP; the app now uses native ES modules.

## Tests

Install Chromium once after installing dependencies:

```sh
npx playwright install chromium
npm test
```

- `npm run test:unit` checks stateless helpers with Node's test runner.
- `npm run test:browser` runs Chromium workflows and a desktop screenshot check.
  Tests launch an isolated server on port 4175 and use a fresh browser context for
  each case, so they do not overwrite the scene saved in your normal browser.
- Failed browser tests retain screenshots and Playwright traces in `test-results/`.
  Inspect a trace with `npx playwright show-trace <path-to-trace.zip>`.

The checked-in visual reference was captured on Windows with Playwright 1.64.1.
Screenshot filenames are platform-specific; another OS needs a separately reviewed
reference. To intentionally refresh references, run
`npm run test:browser -- --update-snapshots` and review the image changes. Do not
refresh references just to make an unexpected visual regression pass.

Tests cover character styles, skin colour, naming and independent character state;
all scene object categories; layering, flipping, deletion, reset and undo; keyboard
movement, pointer dragging and resizing; the object limit; persistence after reload;
SVG/PNG downloads; responsive editor controls; and initial desktop appearance.
Browser tests also fail on uncaught page errors and failed HTTP responses.

They do not yet guarantee clipboard permissions, every pose/palette combination,
legacy storage migrations, calibration editing, or Firefox/Safari behaviour.

## Code map

- `index.html`: editor structure and accessible controls.
- `styles.css`: responsive layout and custom appearance.
- `app.js`: editor orchestration, character configuration, scene state, history,
  rendering, interactions, persistence and scene export composition.
- `src/utils.mjs`: stateless numeric, colour and asset label helpers.
- `src/svg-assets.mjs`: SVG fetching and dimension metadata.
- `src/downloads.mjs`: image decoding, canvas encoding and browser downloads.
- `assets/parts/`: SVG library, manifest and calibration data.
- `scripts/`: cross-platform static asset preparation.

After adding SVG variants, run `npm run build:assets`. See
`assets/parts/README.md` for asset conventions and `docs/javascript-audit.md` for
the maintenance audit and recommended next steps.
