# JavaScript maintenance audit

Audited 21 October 2026. Scope: application source, asset preparation and a first
automated behaviour baseline. This is a maintainability review, not a comprehensive
security audit.

## Architecture and state flow

The initial application has approximately 4,000 lines of JavaScript in one classic
script. There is no application framework. HTML supplies the controls; JavaScript
builds scene DOM containing inline SVG artwork. A 6,000 by 4,500 logical canvas is
scaled and translated inside the viewport. Characters compose part slots, SVG
variants, pose rules, calibration offsets and colour overrides.

Startup loads the manifest, SVGs, calibration and character navigator, restores
browser storage, builds an undo snapshot, renders and fits the canvas. The manifest
contains 187 SVG files in 16 categories. Those files are fetched eagerly.

`sceneObjects` holds scene items and per-character settings. The selected character
also exists in shared variables such as `selections`, `visibility` and
`clothingColours`. `syncGlobalsToSelectedCharacter`, `loadCharacterIntoGlobals` and
`withCharacterObject` bridge those representations. `render()` also synchronizes
state, records history and saves the scene. Export composition temporarily loads
each character into those same shared variables.

## Findings, ordered by maintenance impact

### High: two representations of character state

Selection, rendering, thumbnails and export depend on synchronization order.
`withCharacterObject` restores references with `finally`, which helps, but callbacks
still operate on shared mutable state. Extracting these functions without an explicit
state contract would carry substantial regression risk.

Next step: make character rendering and geometry accept a character configuration
explicitly. Migrate one caller at a time, checking independent character edits,
selection switches, undo, reload and export. Do not replace the entire state model
in one change.

### High: rendering performs persistence and history work

`render()` is both a view update and a state checkpoint. UI changes and scene edits
are difficult to reason about separately. History snapshots use JSON cloning;
rendering repeatedly serializes objects to compare signatures.

Next step: introduce explicit scene mutation/checkpoint operations before making
rendering side-effect free. Preserve checkpoint boundaries for drags, colour changes,
reset and deletion. Add multi-step undo tests before changing this boundary.

### Medium: orchestration and configuration dominate one file

DOM references, palette definitions, Figma offsets, pose rules, asset loading,
interaction handlers and export assembly share a scope. Function dependencies are
implicit, and there was no test script or top-level development documentation.

The first refactor extracts existing stateless helpers, SVG metadata fetching and
download primitives without changing their algorithms. `app.js` now imports these
through native ES modules. The editor state and event order remain in place.

Next: extract configuration, then introduce an asset catalog boundary. Keep scene
export composition coupled to the editor until its character dependencies are explicit.

### Medium: persistence contracts need stronger validation

Scene storage uses a key ending in `v2` while the written payload says `version: 3`.
`normalizeSceneObject` checks some fields but restores character selection maps and
colour maps with limited validation. Asset selections use indices, making saved
characters sensitive to asset library ordering changes. Calibration JSON is parsed
without validating its shape, and its save path lacks the error handling used by
scene persistence.

Next: document the current schema and test malformed, older and reordered-asset
fixtures before changing migrations or switching saved selections to stable labels.
Keep compatibility with existing saved scenes.

### Medium: startup and repeated SVG processing

All catalog SVGs load at startup, and several render/colour/export paths parse SVG
text repeatedly. Rendering rebuilds scene and control DOM and binds fresh handlers.
This is manageable for the ten-object limit but creates performance and pointer/focus
risks if changed casually. `initializeApp()` also lacks a top-level error boundary;
a required navigator failure can prevent startup without an actionable UI message.

Next: measure startup and editing before caching or incremental rendering. Cache
immutable asset metadata first; preserve per-character colouring. Add network failure
fixtures before implementing loading/error states.

### Low: platform-dependent asset preparation

The original Carbon copy script uses Unix `mkdir -p` and `cp`, which fails with the
default Windows npm shell. Replaced with Node filesystem calls. The asset manifest
build remains unchanged.

### Dependency follow-up

At audit time `npm audit` reports three high-severity findings involving Vite,
nanoid and source-map-js. Dependency upgrades are separate from this refactor so
that tooling changes do not obscure behaviour comparisons. Review the advisory
details and compatible fixes before exposing the dev server beyond localhost.

## Validation and remaining risk

Seven Chromium workflow/appearance tests were established against the original
application before module extraction. Four focused unit tests cover extracted
helper contracts. The screenshot reference uses deterministic random choices and
was captured before extraction. Browser assertions interact through controls and
inspect the existing persisted scene contract rather than private functions.

The first extraction is low risk relative to changing scene state: it moves existing
function bodies, adds explicit imports, and changes script loading to module mode.
Module mode adds strict scope and deferred loading; browser startup, workflows and
the visual baseline exercise that change. Future state/history work is higher risk
and needs broader undo, migration, calibration and export-content fixtures first.

Current tests do not prove every feature or browser. Clipboard permissions, every
pose/palette, legacy migration, calibration and cross-browser behaviour still need
manual verification or additional tests when those areas change. Screenshot updates
must be reviewed; accepting new images automatically defeats their protection.
