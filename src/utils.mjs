// Stateless helpers shared by the editor and asset loader.

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function normalizeHexColour(value) {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value) ? value.toLowerCase() : null;
}

export function getContrastColour(hexColour) {
  const red = Number.parseInt(hexColour.slice(1, 3), 16);
  const green = Number.parseInt(hexColour.slice(3, 5), 16);
  const blue = Number.parseInt(hexColour.slice(5, 7), 16);
  return red * 0.299 + green * 0.587 + blue * 0.114 > 150 ? "#161616" : "#ffffff";
}

export function parseSvgDimension(value) {
  if (!value) {
    return null;
  }

  const match = value.match(/-?\d+(\.\d+)?/);
  return match ? Math.ceil(Number(match[0])) : null;
}

export function formatAssetLabel(fileName) {
  const baseName = fileName.replace(/\.svg$/i, "").replace(/[_-]+/g, " ").trim();
  return baseName.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function canonicalizeLabel(value) {
  return value.toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}
