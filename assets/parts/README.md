Body-part SVGs live in folders that match the character layer categories.

Current layer order is defined in `app.js`. Earlier parts are behind later parts.
SVGs can keep their original export filenames, including spaces and capital letters.
Run `npm run build:assets` after adding variants so they are included in the asset
manifest. Filenames that differ only by spaces, hyphens, underscores, or letter case
are treated as the same option in the UI.
