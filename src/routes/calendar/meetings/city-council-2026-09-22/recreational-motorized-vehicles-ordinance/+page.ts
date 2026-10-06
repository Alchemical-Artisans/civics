import type { PageLoad } from "./$types"

/**
 * The agenda gives this item a sentence rather than a name, so the title is
 * cut from the article it amends -- Chapter 222 Article XI, Recreational
 * Motorized Vehicles -- rather than from the "E-Bike Ordinance" the Mayor's
 * and the City Solicitors' own subject lines use: the ordinance restricts
 * scooters and motorized bicycles as well as electric ones.
 *
 * `wide` for the diff, which lays today's text and the amended text side by
 * side by default, and a 48rem reading column halves each to a few words a
 * line.
 */
export const load: PageLoad = () => ({
  item: { title: "Recreational Motorized Vehicles Ordinance" },
  wide: true,
})
