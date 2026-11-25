import type { PageLoad } from "./$types"

/**
 * The same matter, title and slug as on 29 September and 20 October, where the
 * order this one corrects was first read and then adopted: the Mayor's letter
 * calls this a correction of "a scrivener's error in Section D" of the section
 * those sittings amended.
 *
 * `wide` for the diff, as on 20 October.
 */
export const load: PageLoad = () => ({
  item: { title: "All-Night Parking Ordinance" },
  wide: true,
})
