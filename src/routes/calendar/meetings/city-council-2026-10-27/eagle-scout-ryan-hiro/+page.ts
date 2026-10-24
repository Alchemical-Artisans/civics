import type { PageLoad } from "./$types"

/** The agenda prints a sentence; the title is who is being recognised and for what. */
export const load: PageLoad = () => ({
  item: { title: "Ryan Hiro, Eagle Scout" },
})
