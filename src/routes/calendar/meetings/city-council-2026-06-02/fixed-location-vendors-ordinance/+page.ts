import type { PageLoad } from "./$types"

/**
 * The agenda's line is the Mayor's sentence and the order's heading; the
 * title is the article's own subject as the order names it, "Fixed Location
 * Vendors". The packet carries the city's marked-up copy, so the diff is a
 * transcription of its marks (`ordinance.ts`) and its strike-through link is
 * that copy.
 *
 * `wide` for the diff, which sets the two versions side by side.
 */
export const load: PageLoad = () => ({
  item: { title: "Fixed Location Vendors Ordinance" },
  wide: true,
})
