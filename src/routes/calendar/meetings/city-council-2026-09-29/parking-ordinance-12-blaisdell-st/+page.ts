import type { PageLoad } from "./$types"

/**
 * The same slug and title the matter carries on the meeting of 15 September,
 * where it had its first reading -- the agenda's own name for it, "Doc 10-Q -
 * Ordinance re: Vehicles and Traffic; Amend Ch 240", says nothing about which
 * street, and the Council had three of them before it that night.
 */
export const load: PageLoad = () => ({
  item: { title: "12 Blaisdell St – No Parking Ordinance" },
})
