import type { PageLoad } from "./$types"

/** The agenda gives a sentence; the title is the program year and the grant. */
export const load: PageLoad = () => ({
  item: { title: "FY2027 Community Development Block Grant Application" },
})
