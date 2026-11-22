import type { PageLoad } from "./$types"

/**
 * The section's own heading, "Applications/Handicap Parking Signs", less the
 * "Applications/". It stands for both 8.1 and 8.2, two applicants under one
 * heading, as tag-days does on the agenda of 25 August 2026. 13 1/2 Grove st
 * has no map: Nominatim finds 13 Grove Street, which is another address.
 */
export const load: PageLoad = () => ({
  item: { title: "Handicap Parking Signs" },
})
