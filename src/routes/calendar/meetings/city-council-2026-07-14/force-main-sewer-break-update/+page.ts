import type { PageLoad } from "./$types"

/**
 * The agenda gives this item a sentence rather than a name; the title names
 * the failure the Director is reporting on.
 */
export const load: PageLoad = () => ({
  item: { title: "42-Inch Force Main Sewer Break Update" },
})
