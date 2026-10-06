import type { PageLoad } from "./$types"

/**
 * The bucket's own heading; one applicant is filed under it, so the page
 * carries the heading and that application.
 */
export const load: PageLoad = () => ({
  item: { title: "Amusement/Event Application" },
})
