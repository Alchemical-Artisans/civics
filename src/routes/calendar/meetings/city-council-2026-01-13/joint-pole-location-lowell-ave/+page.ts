import type { PageLoad } from "./$types"

/**
 * The agenda prints the street and the work request number; the title names
 * the street and the kind of petition, as the sitting's five utility hearings
 * do. This one is filed under Petitions, not heard: the hearing is set for
 * February 10, 2026.
 */
export const load: PageLoad = () => ({
  item: { title: "Joint Pole Location, Lowell Ave" },
})
