import type { PageLoad } from "./$types"

/**
 * The order's own opening words, as on every sitting's. "Tree Green Capital"
 * is the agenda's spelling; the Mayor's letter and the invoices say "True
 * Green Capital", and the agenda's is the one transcribed.
 */
export const load: PageLoad = () => ({
  item: { title: "Pay Bills of Previous Years" },
})
