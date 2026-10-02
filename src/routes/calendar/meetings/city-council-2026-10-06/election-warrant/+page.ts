import type { PageLoad } from "./$types"

/**
 * The agenda gives this item a sentence; the title names the document the
 * Clerk submits. The Council votes the warrant, and it is the document that
 * tells a voter where their precinct votes and what is on the ballot, so it is
 * transcribed in full rather than linked as a scan.
 */
export const load: PageLoad = () => ({
  item: { title: "Election Warrant, 2026 State Election" },
})
