import type { PageLoad } from "./$types"

/**
 * The agenda line is an introduction with no name of its own; the title names
 * the petition it brings and the applicant it is for.
 */
export const load: PageLoad = () => ({
  item: { title: "Home Rule Age Waiver, Jonathan Gagne" },
})
