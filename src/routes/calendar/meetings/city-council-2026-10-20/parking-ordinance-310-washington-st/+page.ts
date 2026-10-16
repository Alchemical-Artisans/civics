import type { PageLoad } from "./$types"

/**
 * The same shape every such ordinance takes here: the agenda's own "Ordinance
 * re: Vehicles and Traffic; Amend Ch 240" names every one of them alike and
 * says nothing about which street.
 */
export const load: PageLoad = () => ({
  item: { title: "310 Washington St – No Parking Ordinance" },
})
