import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const partDirectories = {
  "right-arm": "right-arm",
  glasses: "glasses",
  headset: "headset",
  mask: "mask",
  wrinkles: "wrinkles",
  "facial-hair": "facial-hair",
  face: "face",
  hair: "head",
  table: "table",
  body: "body",
  legs: "legs",
  "left-arm": "left-arm",
  seat: "seat"
};

const partsRoot = path.resolve("assets/parts");
const manifest = {};

for (const [partId, directory] of Object.entries(partDirectories)) {
  const files = await readdir(path.join(partsRoot, directory));
  manifest[partId] = files
    .filter((fileName) => fileName.toLowerCase().endsWith(".svg"))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base", numeric: true }));
}

await writeFile(
  path.join(partsRoot, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8"
);
