import type { PageLoad } from "./$types"

/**
 * The bucket heading, standing for both of its sub-items, 12.6.1 and 12.6.2,
 * two different events, the way `event-applications` is written up on other
 * sittings. The applications themselves are permit-portal printouts,
 * certificates of insurance and police forms, so they are not cut into
 * excerpts; each is linked at its page in the city's file.
 */
export const load: PageLoad = () => ({
  item: { title: "Amusement/Event Application" },
})
