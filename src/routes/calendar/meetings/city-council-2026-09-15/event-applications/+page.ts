import type { PageLoad } from "./$types"

/**
 * The three permit applications share one heading on the agenda (12.4), the
 * same way the Petitions section bundles Tag Days and Annual License Renewals
 * under one item page apiece.
 */
export const load: PageLoad = () => ({
  item: { title: "Amusement/Event Applications" },
})
