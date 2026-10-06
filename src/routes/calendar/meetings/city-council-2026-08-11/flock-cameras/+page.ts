import type { PageLoad } from "./$types"

/**
 * The agenda gives this item a sentence rather than a name; the title names
 * the technology the Police Department is presenting. The minutes print
 * "Couand" for "and" in the agenda line's echo; it is left out of the title.
 */
export const load: PageLoad = () => ({
  item: { title: "Flock Cameras and License Plate Monitoring" },
})
