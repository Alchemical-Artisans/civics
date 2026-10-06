import type { PageLoad } from "./$types"

/**
 * The agenda prints the petition's document number; the title names the street
 * and the kind of petition.
 */
export const load: PageLoad = () => ({
  item: { title: "Joint Pole Location, South Prospect St" },
})
