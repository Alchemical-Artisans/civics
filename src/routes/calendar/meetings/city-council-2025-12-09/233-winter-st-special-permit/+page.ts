import type { PageLoad } from "./$types"

/**
 * The agenda prints the matter as an application sentence with no name of its
 * own; the title names the permit and the address, as
 * `marshland-st-special-permit` does.
 *
 * The packet carries the application twice: as filed in June (pages 52 to
 * 110 of the agenda file) and again as resubmitted for this sitting (pages 111
 * to 202), the second with the October department reviews, the traffic memo,
 * the Planning Director's memo, the hearing notice and the presentation added.
 * The attorney's letter, the deed, the criteria narrative and the plans are
 * the same documents in both, so each is cut once, from the first; the
 * application form is likewise cut from the first. The abutters list and the
 * Assessors' certification behind it (pages 196 to 202) are names and home
 * addresses of private people, and are left in the city's full file rather
 * than cut out here.
 */
export const load: PageLoad = () => ({
  item: { title: "Special Permit, 233 Winter St" },
})
