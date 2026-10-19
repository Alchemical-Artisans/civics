import type { PageLoad } from "./$types"

/**
 * The City Engineer's own subject line with the stretch of street the
 * ordinance names: the agenda's "Ordinance re: Vehicles and Traffic; Amend Ch
 * 240" is the same line it prints over 14.1, a different street.
 *
 * The map is the stretch itself, unlike 14.1's single address: this is a run
 * of Washington Street between two cross streets, and a map centred on one
 * point of it would claim a precision the ordinance does not have. It is
 * drawn as a line now rather than left off -- see `stretch.ts`.
 */
export const load: PageLoad = () => ({
  item: { title: "Washington St, Niagara St to Pleasant View Ave – No Parking Ordinance" },
})
