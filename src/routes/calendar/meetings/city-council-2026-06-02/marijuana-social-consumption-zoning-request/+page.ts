import type { PageLoad } from "./$types"

/**
 * The same matter as `city-council-2026-07-14/marijuana-social-consumption-
 * zoning-request`, under that page's title and slug. Continued tonight to 14
 * July at the Planning Director's request, the Planning Board having
 * continued its own hearing to 8 July.
 */
export const load: PageLoad = () => ({
  item: { title: "Marijuana Social Consumption Zoning Request" },
})
