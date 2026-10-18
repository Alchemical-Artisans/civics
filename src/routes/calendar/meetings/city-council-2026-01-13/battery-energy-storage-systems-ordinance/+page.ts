import type { PageLoad } from "./$types"

/**
 * The same matter, under the same title, as the 14 July, 25 August and
 * 15 September 2026 agendas and the Planning Board's own hearings. The
 * document number differs -- this is Doc 5-B, filed in January 2025 and
 * continued through the year; the mid-2026 agendas carry Doc 21-B -- but the
 * subject is the one zoning amendment, so the item keeps one title across
 * every sitting it comes back to.
 */
export const load: PageLoad = () => ({
  item: { title: "Battery Energy Storage Systems Ordinance" },
})
