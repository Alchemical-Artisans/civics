import type { PageLoad } from "./$types"

/**
 * The same ordinance the Mayor filed on 22 September, back as unfinished
 * business, so it keeps the title and slug it has there: cut from the article
 * it amends -- Chapter 222 Article XI, Recreational Motorized Vehicles --
 * rather than from the "E-Bike Ordinance" the Mayor's and the City
 * Solicitors' own subject lines use, since the ordinance restricts scooters
 * and motorized bicycles as well as electric ones.
 *
 * `wide` for the diff, which lays today's text and the amended text side by
 * side by default, and a 48rem reading column halves each to a few words a
 * line.
 */
export const load: PageLoad = () => ({
  item: { title: "Recreational Motorized Vehicles Ordinance" },
  wide: true,
})
