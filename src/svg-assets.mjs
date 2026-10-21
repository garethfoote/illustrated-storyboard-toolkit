import { parseSvgDimension } from "./utils.mjs";

// Load local SVG artwork without depending on editor state.

export async function fetchSvgMetadata(src, fallbackSlot) {
  const response = await fetch(src, { cache: "no-store" });
  if (!response.ok) {
    return { svgText: "", width: fallbackSlot.width, height: fallbackSlot.height };
  }

  const svgText = await response.text();
  const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
  const svg = doc.querySelector("svg");
  if (!svg) {
    return { svgText, width: fallbackSlot.width, height: fallbackSlot.height };
  }

  const width = parseSvgDimension(svg.getAttribute("width"));
  const height = parseSvgDimension(svg.getAttribute("height"));

  if (width && height) {
    return { svgText, width, height };
  }

  const viewBox = (svg.getAttribute("viewBox") || "").trim().split(/\s+/).map(Number);
  if (viewBox.length === 4 && viewBox.every((value) => Number.isFinite(value))) {
    return { svgText, width: Math.ceil(viewBox[2]), height: Math.ceil(viewBox[3]) };
  }

  return { svgText, width: fallbackSlot.width, height: fallbackSlot.height };
}
