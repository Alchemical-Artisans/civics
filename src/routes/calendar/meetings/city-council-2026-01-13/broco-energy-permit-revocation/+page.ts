import type { PageLoad } from "./$types"

/**
 * The agenda calls it a revocation hearing on the licence issued to Broco
 * Energy; the address is in the abutters' own petition and in the city's
 * hearing notice, and is what tells this matter from the company's other
 * business before the Council.
 */
export const load: PageLoad = () => ({
  item: { title: "Revocation Hearing, Broco Energy, 168 Hale Street" },
})
