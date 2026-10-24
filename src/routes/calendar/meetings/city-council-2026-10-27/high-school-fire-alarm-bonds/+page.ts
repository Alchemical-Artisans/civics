import type { PageLoad } from "./$types"

/**
 * The order's own heading, "$800,000 Haverhill High School Fire Alarm Project
 * Bonds", without the sum: the sum is in the first line of the order itself and
 * a title carrying it would print the figure twice before the reader reaches
 * it.
 */
export const load: PageLoad = () => ({
  item: { title: "Haverhill High School Fire Alarm Project Bonds" },
})
