import type { PageLoad } from "./$types"

/**
 * The same ordinance the Mayor filed on 22 September, back as unfinished
 * business, so it keeps the title and slug it has there: cut from the article
 * it amends -- Chapter 222 Article XI, Recreational Motorized Vehicles --
 * rather than from the "E-Bike Ordinance" the Mayor's and the City
 * Solicitors' own subject lines use, since the ordinance restricts scooters
 * and motorized bicycles as well as electric ones.
 */
export const load: PageLoad = () => ({
  item: { title: "Recreational Motorized Vehicles Ordinance" },
})
