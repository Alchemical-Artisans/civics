import type { PageLoad } from "./$types"

/**
 * The agenda gives this item a sentence rather than a name; the title names
 * the zoning change Haverhill STEM asked for, which the applicant withdrew at
 * this sitting.
 */
export const load: PageLoad = () => ({
  item: { title: "Marijuana Social Consumption Zoning Request" },
})
