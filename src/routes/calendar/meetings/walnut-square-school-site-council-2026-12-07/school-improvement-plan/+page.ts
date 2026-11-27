import type { PageLoad } from "./$types"

/**
 * The agenda's own line for item 3, as printed. The directory drops the
 * school's name, which every page under this sitting already carries.
 */
export const load: PageLoad = () => ({
  item: { title: "Reviewing Walnut Square's School Improvement Plan" },
})
