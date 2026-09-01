/**
 * The colours a chart hands out, in the order it hands them out: biggest
 * category first, so a category keeps its colour whatever else is in the book.
 *
 * One sequence for every chart on a page, so a page carrying a bar and a pie
 * draws its categories from one palette rather than two.
 *
 * Ordered so that neighbouring marks are far apart in hue, then checked with
 * the dataviz palette validator rather than by eye: every step clears the
 * lightness band, the chroma floor and 3:1 against the page, and the closest
 * adjacent pair under simulated deuteranopia is Lime/Rose at dE 6.3 -- inside
 * the 6-8 band that is allowed only where something other than colour
 * identifies the mark, which here is the label on hover or focus and the white
 * gap between one mark and the next.
 */
export const COLOURS = [
  "#0369a1",
  "#ea580c",
  "#0d9488",
  "#7c3aed",
  "#65a30d",
  "#e11d48",
  "#0891b2",
  "#d97706",
  "#4f46e5",
  "#16a34a",
  "#a21caf",
  "#a16207",
  "#2563eb",
  "#db2777",
]
