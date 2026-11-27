import type { PageLoad } from "./$types"

/**
 * The bucket heading, standing for both of its sub-items, 12.2.1 and 12.2.2,
 * two different events, the way `event-applications` is written up on other
 * sittings. The applications are permit-portal printouts, letters,
 * certificates of insurance and tax-exemption letters, so each is linked at
 * its page in the city's file rather than cut out.
 */
export const load: PageLoad = () => ({
  item: { title: "Amusement/Event Application" },
})
