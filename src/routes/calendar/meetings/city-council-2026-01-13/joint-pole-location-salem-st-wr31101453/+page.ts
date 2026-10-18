import type { PageLoad } from "./$types"

/**
 * The agenda prints the petition's document number; the title names the street
 * and the kind of petition. Two of this sitting's five petitions are on Salem
 * St, and the work request number is the only thing the agenda tells them
 * apart by, so it is in both titles.
 */
export const load: PageLoad = () => ({
  item: { title: "Joint Pole Location, Salem St, WR#31101453" },
})
