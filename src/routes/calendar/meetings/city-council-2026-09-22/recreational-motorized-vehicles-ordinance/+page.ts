import type { PageLoad } from "./$types"

/**
 * The agenda gives this item a sentence rather than a name, so the title is
 * cut from the article it amends -- Chapter 222 Article XI, Recreational
 * Motorized Vehicles -- rather than from the "E-Bike Ordinance" the Mayor's
 * and the City Solicitors' own subject lines use: the ordinance restricts
 * scooters and motorized bicycles as well as electric ones.
 */
export const load: PageLoad = () => ({
  item: { title: "Recreational Motorized Vehicles Ordinance" },
})
