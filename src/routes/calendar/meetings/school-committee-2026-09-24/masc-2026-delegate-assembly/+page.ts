import type { PageLoad } from "./$types"

/**
 * The agenda's phrase, cut to the matter: "Elect delegate to Massachusetts
 * Association of School Committees 2026 Delegate Assembly" is what the
 * Committee is doing, and the assembly is what it is doing it for.
 *
 * The packet's own page is headed "MASC Official Delegate Form" and that
 * heading stays on the page, but it names the paperwork rather than the
 * decision, and the form itself -- "below", the page says -- is not in the
 * packet at all. What the city attached is the covering note and the by-law
 * the election answers to; there is nothing here to fill in.
 */
export const load: PageLoad = () => ({
  item: { title: "MASC 2026 Delegate Assembly" },
})
