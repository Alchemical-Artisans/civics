import type { PageLoad } from "./$types"

/**
 * The agenda gives the order's sentence; the title is its first half, as
 * "FY25 Bills" is for the sitting that names the year. This order names none.
 */
export const load: PageLoad = () => ({
  item: { title: "Previous Years’ Bills" },
})
