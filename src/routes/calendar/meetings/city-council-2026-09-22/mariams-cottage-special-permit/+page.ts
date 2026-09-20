import type { PageLoad } from "./$types"

/**
 * The same matter the Council heard on August 25, and it keeps that meeting's
 * title and slug so a reader following one to the other gets the same word.
 * The name of the business, as the agenda quotes it, and what the application
 * form calls itself. "Doc 21-D" is left off, as the cover sheet behind the
 * item is titled Document # 21-D.
 */
export const load: PageLoad = () => ({
  item: { title: "Mariam's Cottage Special Permit" },
})
