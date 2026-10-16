import type { PageLoad } from "./$types"

/**
 * The petition's own heading cut to the street it is about: the agenda's line
 * says "North Boardway", which is the city's own slip for North Broadway, and
 * the petition, the order and the plan all name North Broadway.
 */
export const load: PageLoad = () => ({
  item: { title: "Joint Pole Location, North Broadway" },
})
