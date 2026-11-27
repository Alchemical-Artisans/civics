import type { PageLoad } from "./$types"

/**
 * The Mayor's letter heads it "Loan Order - Silver Hill Elementary School roof
 * replacement". Placed on file on 12 May (Document 26-C), back for its vote.
 * No map: 675 Washington St resolves in OpenStreetMap to the Consentino
 * Middle School building rather than to Silver Hill, and the school's own
 * name finds nothing.
 */
export const load: PageLoad = () => ({
  item: { title: "Loan Order, Silver Hill Elementary School Roof Replacement" },
})
